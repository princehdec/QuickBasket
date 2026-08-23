import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

type Job = {
  id: string;
  orderId: string;
  status: "unassigned" | "offered" | "accepted" | "picked_up" | "out_for_delivery" | "delivered" | "failed" | "reassigned";
  earnings: string;
};

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

function accessToken(): string | undefined {
  if (typeof globalThis === "undefined") return undefined;
  return (globalThis as typeof globalThis & { localStorage?: { getItem(key: string): string | null } }).localStorage?.getItem("qb_access_token") ?? undefined;
}

export default function App() {
  const [isOnline, setIsOnline] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [message, setMessage] = useState("Sign in to load live jobs / लाइव जॉब के लिए साइन इन करें");

  const api = async (path: string, init: RequestInit = {}) => {
    const token = accessToken();
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(init.headers ?? {}) },
    });
    const payload = await response.json().catch(() => null) as { data?: unknown; message?: string } | null;
    if (!response.ok) throw new Error(payload?.message ?? "Request failed");
    return payload?.data;
  };

  useEffect(() => {
    api("/api/v1/delivery/jobs")
      .then((data) => setJobs((data as Job[]) ?? []))
      .catch((error: unknown) => setMessage(error instanceof Error ? error.message : "Could not load jobs"));
  }, []);

  const toggleOnline = async () => {
    const next = !isOnline;
    try {
      await api("/api/v1/delivery/me/online", { method: "PATCH", body: JSON.stringify({ isOnline: next }) });
      setIsOnline(next);
      setMessage(next ? "You are online / आप ऑनलाइन हैं" : "You are offline / आप ऑफलाइन हैं");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update status");
    }
  };

  const updateJob = async (job: Job) => {
    const nextStatus = job.status === "offered" ? "accepted" : job.status === "accepted" ? "picked_up" : job.status === "picked_up" ? "out_for_delivery" : "delivered";
    try {
      await api(`/api/v1/delivery/jobs/${job.id}`, { method: "PATCH", body: JSON.stringify({ status: nextStatus }) });
      setJobs((current) => current.map((item) => item.id === job.id ? { ...item, status: nextStatus } : item));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update job");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}><View><Text style={styles.eyebrow}>QUICKBASKET PARTNER</Text><Text style={styles.title}>Delivery control</Text><Text style={styles.subtitle}>Lucknow + Gopalganj</Text></View><View style={styles.avatar}><Text style={styles.avatarText}>P</Text></View></View>
        <View style={[styles.onlineCard, isOnline && styles.onlineCardActive]}><View><Text style={styles.onlineLabel}>Partner status / पार्टनर स्थिति</Text><Text style={styles.onlineTitle}>{isOnline ? "You are online" : "You are offline"}</Text><Text style={styles.onlineSubtitle}>{message}</Text></View><Pressable onPress={toggleOnline} style={styles.toggle} accessibilityLabel="Toggle online status"><View style={[styles.toggleKnob, isOnline && styles.toggleKnobActive]} /></Pressable></View>
        <View style={styles.metricsRow}><View style={styles.metric}><Text style={styles.metricLabel}>Available jobs</Text><Text style={styles.metricValue}>{jobs.filter((job) => job.status !== "delivered").length}</Text><Text style={styles.metricHint}>उपलब्ध काम</Text></View><View style={styles.metric}><Text style={styles.metricLabel}>Today</Text><Text style={styles.metricValue}>₹{jobs.reduce((sum, job) => sum + Number(job.earnings || 0), 0)}</Text><Text style={styles.metricHint}>आज की कमाई</Text></View></View>
        <View style={styles.sectionHeader}><View><Text style={styles.sectionTitle}>Delivery jobs</Text><Text style={styles.sectionHindi}>डिलीवरी काम</Text></View></View>
        {jobs.length === 0 ? <View style={styles.empty}><Text style={styles.emptyTitle}>No assigned jobs</Text><Text style={styles.emptyText}>Admin or dispatch will assign jobs here.</Text></View> : jobs.map((job) => <View key={job.id} style={styles.jobCard}><View style={styles.jobTop}><Text style={styles.jobId}>Order {job.orderId.slice(0, 8)}</Text><Text style={styles.jobAmount}>₹{job.earnings}</Text></View><Text style={styles.status}>{job.status.replaceAll("_", " ")}</Text><Pressable onPress={() => updateJob(job)} disabled={job.status === "delivered"} style={styles.actionButton}><Text style={styles.actionText}>{job.status === "delivered" ? "Completed" : "Update job status"}</Text></Pressable></View>)}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ safeArea: { flex: 1, backgroundColor: "#FBF9F3" }, content: { padding: 20, paddingBottom: 36 }, header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }, eyebrow: { color: "#236837", fontSize: 11, fontWeight: "800", letterSpacing: 1.8 }, title: { color: "#1E2620", fontSize: 26, fontWeight: "800", marginTop: 6 }, subtitle: { color: "#5E6A60", fontSize: 14, marginTop: 4 }, avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: "#E8F3E9", alignItems: "center", justifyContent: "center" }, avatarText: { color: "#236837", fontSize: 20, fontWeight: "800" }, onlineCard: { borderRadius: 18, backgroundColor: "#8E2F23", padding: 18, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, onlineCardActive: { backgroundColor: "#236837" }, onlineLabel: { color: "#E8F3E9", fontSize: 12, fontWeight: "700" }, onlineTitle: { color: "#FFFFFF", fontSize: 20, fontWeight: "800", marginTop: 5 }, onlineSubtitle: { color: "#FFFFFF", fontSize: 12, marginTop: 4, maxWidth: 230 }, toggle: { width: 48, height: 28, borderRadius: 16, backgroundColor: "#FFFFFF", padding: 3, justifyContent: "center" }, toggleKnob: { width: 22, height: 22, borderRadius: 11, backgroundColor: "#8E2F23" }, toggleKnobActive: { alignSelf: "flex-end", backgroundColor: "#DC9A2B" }, metricsRow: { flexDirection: "row", gap: 10, marginTop: 14 }, metric: { flex: 1, borderRadius: 16, backgroundColor: "#FFFDF7", borderWidth: 1, borderColor: "#E7E2D7", padding: 15 }, metricLabel: { color: "#5E6A60", fontSize: 12, fontWeight: "700" }, metricValue: { color: "#1E2620", fontSize: 24, fontWeight: "800", marginTop: 7 }, metricHint: { color: "#5E6A60", fontSize: 11, marginTop: 3 }, sectionHeader: { marginTop: 28, marginBottom: 12 }, sectionTitle: { color: "#1E2620", fontSize: 19, fontWeight: "800" }, sectionHindi: { color: "#5E6A60", fontSize: 13, marginTop: 2 }, jobCard: { borderRadius: 17, backgroundColor: "#FFFDF7", borderWidth: 1, borderColor: "#E7E2D7", padding: 16, marginBottom: 12 }, jobTop: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }, jobId: { color: "#1E2620", fontSize: 15, fontWeight: "800" }, jobAmount: { color: "#236837", fontSize: 17, fontWeight: "800" }, status: { color: "#5E6A60", textTransform: "capitalize", fontSize: 13, marginBottom: 12 }, actionButton: { borderRadius: 10, backgroundColor: "#E8F3E9", paddingVertical: 11, alignItems: "center" }, actionText: { color: "#236837", fontSize: 12, fontWeight: "800" }, empty: { borderRadius: 16, backgroundColor: "#FFFDF7", borderWidth: 1, borderColor: "#E7E2D7", padding: 20 }, emptyTitle: { color: "#1E2620", fontSize: 16, fontWeight: "800" }, emptyText: { color: "#5E6A60", marginTop: 6 }, });
