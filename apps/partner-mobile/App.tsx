import { useCallback, useEffect, useState } from "react";
import { Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";

type JobStatus = "unassigned" | "offered" | "accepted" | "picked_up" | "out_for_delivery" | "delivered" | "failed" | "reassigned";
type Job = { id: string; orderId: string; status: JobStatus; earnings: string };
type ApiPayload = { data?: unknown; message?: string };

const API_BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:4000").replace(/\/$/, "");
const nextStatus: Partial<Record<JobStatus, JobStatus>> = { offered: "accepted", accepted: "picked_up", picked_up: "out_for_delivery", out_for_delivery: "delivered" };

async function accessToken(): Promise<string | undefined> {
  if (Platform.OS === "web") return window.localStorage.getItem("qb_access_token") ?? undefined;
  return (await SecureStore.getItemAsync("qb_access_token")) ?? undefined;
}

async function apiRequest(path: string, init: RequestInit = {}) {
  const token = await accessToken();
  if (!token) throw new Error("Sign in to load live jobs / लाइव जॉब के लिए साइन इन करें");
  const response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers: { Accept: "application/json", "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...(init.headers ?? {}) } });
  const payload = await response.json().catch(() => null) as ApiPayload | null;
  if (!response.ok) throw new Error(payload?.message ?? "Request failed / अनुरोध विफल हुआ");
  return payload?.data;
}

export default function App() {
  const [isOnline, setIsOnline] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyJobId, setBusyJobId] = useState<string | null>(null);
  const [message, setMessage] = useState("Sign in to load live jobs / लाइव जॉब के लिए साइन इन करें");

  const loadJobs = useCallback(async () => {
    const data = await apiRequest("/api/v1/delivery/jobs");
    setJobs((data as Job[]) ?? []);
  }, []);

  useEffect(() => {
    loadJobs().catch((error: unknown) => setMessage(error instanceof Error ? error.message : "Could not load jobs / जॉब नहीं लोड हो सके")).finally(() => setLoading(false));
  }, [loadJobs]);

  const toggleOnline = async () => {
    const next = !isOnline;
    try {
      await apiRequest("/api/v1/delivery/me/online", { method: "PATCH", body: JSON.stringify({ isOnline: next }) });
      setIsOnline(next);
      setMessage(next ? "You are online / आप ऑनलाइन हैं" : "You are offline / आप ऑफलाइन हैं");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update status / स्थिति update नहीं हुई");
    }
  };

  const updateJob = async (job: Job) => {
    const status = nextStatus[job.status];
    if (!status) return;
    setBusyJobId(job.id);
    try {
      await apiRequest(`/api/v1/delivery/jobs/${job.id}`, { method: "PATCH", body: JSON.stringify({ status }) });
      setJobs((current) => current.map((item) => item.id === job.id ? { ...item, status } : item));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update job / जॉब update नहीं हुआ");
    } finally {
      setBusyJobId(null);
    }
  };

  const actionLabel = (status: JobStatus) => ({ offered: "Accept / स्वीकारें", accepted: "Mark picked up / pickup", picked_up: "Start delivery / delivery शुरू", out_for_delivery: "Mark delivered / delivered", delivered: "Completed / पूरा", unassigned: "Awaiting assignment / assignment बाकी", failed: "Needs support / सहायता चाहिए", reassigned: "Reassigned / फिर से assign" }[status]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}><View><Text style={styles.eyebrow}>QUICKBASKET PARTNER</Text><Text style={styles.title}>Delivery control</Text><Text style={styles.subtitle}>Lucknow + Gopalganj</Text></View><View style={styles.avatar}><Text style={styles.avatarText}>P</Text></View></View>
        <View style={[styles.onlineCard, isOnline && styles.onlineCardActive]}><View><Text style={styles.onlineLabel}>Partner status / पार्टनर स्थिति</Text><Text style={styles.onlineTitle}>{isOnline ? "You are online" : "You are offline"}</Text><Text style={styles.onlineSubtitle}>{message}</Text></View><Pressable onPress={() => void toggleOnline()} style={({ pressed }) => [styles.toggle, pressed && styles.pressed]} accessibilityLabel="Toggle online status"><View style={[styles.toggleKnob, isOnline && styles.toggleKnobActive]} /></Pressable></View>
        <View style={styles.metricsRow}><View style={styles.metric}><Text style={styles.metricLabel}>Available jobs</Text><Text style={styles.metricValue}>{jobs.filter((job) => !["delivered", "failed"].includes(job.status)).length}</Text><Text style={styles.metricHint}>उपलब्ध काम</Text></View><View style={styles.metric}><Text style={styles.metricLabel}>Assigned earnings</Text><Text style={styles.metricValue}>₹{jobs.reduce((sum, job) => sum + Number(job.earnings || 0), 0)}</Text><Text style={styles.metricHint}>assigned jobs</Text></View></View>
        <View style={styles.sectionHeader}><View><Text style={styles.sectionTitle}>Delivery jobs</Text><Text style={styles.sectionHindi}>डिलीवरी काम</Text></View><Pressable onPress={() => void loadJobs()} style={styles.refreshButton}><Text style={styles.refreshText}>Refresh / फिर लोड करें</Text></Pressable></View>
        {loading ? <View style={styles.empty}><Text style={styles.emptyText}>Loading jobs / जॉब लोड हो रहे हैं…</Text></View> : jobs.length === 0 ? <View style={styles.empty}><Text style={styles.emptyTitle}>No assigned jobs / कोई assigned job नहीं</Text><Text style={styles.emptyText}>Admin or dispatch will assign jobs here.</Text></View> : jobs.map((job) => <View key={job.id} style={styles.jobCard}><View style={styles.jobTop}><Text style={styles.jobId}>Order {job.orderId.slice(0, 8)}</Text><Text style={styles.jobAmount}>₹{job.earnings}</Text></View><Text style={styles.status}>{job.status.replaceAll("_", " ")}</Text><Pressable onPress={() => void updateJob(job)} disabled={!nextStatus[job.status] || busyJobId === job.id} style={({ pressed }) => [styles.actionButton, (!nextStatus[job.status] || busyJobId === job.id) && styles.disabled, pressed && styles.pressed]}><Text style={styles.actionText}>{busyJobId === job.id ? "Saving…" : actionLabel(job.status)}</Text></Pressable></View>)}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ safeArea: { flex: 1, backgroundColor: "#FBF9F3" }, content: { padding: 20, paddingBottom: 36 }, header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }, eyebrow: { color: "#236837", fontSize: 11, fontWeight: "800", letterSpacing: 1.8 }, title: { color: "#1E2620", fontSize: 26, fontWeight: "800", marginTop: 6 }, subtitle: { color: "#5E6A60", fontSize: 14, marginTop: 4 }, avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: "#E8F3E9", alignItems: "center", justifyContent: "center" }, avatarText: { color: "#236837", fontSize: 20, fontWeight: "800" }, onlineCard: { borderRadius: 18, backgroundColor: "#8E2F23", padding: 18, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, onlineCardActive: { backgroundColor: "#236837" }, onlineLabel: { color: "#E8F3E9", fontSize: 12, fontWeight: "700" }, onlineTitle: { color: "#FFFFFF", fontSize: 20, fontWeight: "800", marginTop: 5 }, onlineSubtitle: { color: "#FFFFFF", fontSize: 12, marginTop: 4, maxWidth: 230 }, toggle: { width: 48, height: 28, borderRadius: 16, backgroundColor: "#FFFFFF", padding: 3, justifyContent: "center" }, toggleKnob: { width: 22, height: 22, borderRadius: 11, backgroundColor: "#8E2F23" }, toggleKnobActive: { alignSelf: "flex-end", backgroundColor: "#DC9A2B" }, metricsRow: { flexDirection: "row", gap: 10, marginTop: 14 }, metric: { flex: 1, borderRadius: 16, backgroundColor: "#FFFDF7", borderWidth: 1, borderColor: "#E7E2D7", padding: 15 }, metricLabel: { color: "#5E6A60", fontSize: 12, fontWeight: "700" }, metricValue: { color: "#1E2620", fontSize: 24, fontWeight: "800", marginTop: 7 }, metricHint: { color: "#5E6A60", fontSize: 11, marginTop: 3 }, sectionHeader: { marginTop: 28, marginBottom: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }, sectionTitle: { color: "#1E2620", fontSize: 19, fontWeight: "800" }, sectionHindi: { color: "#5E6A60", fontSize: 13, marginTop: 2 }, refreshButton: { padding: 4 }, refreshText: { color: "#236837", fontSize: 12, fontWeight: "800" }, jobCard: { borderRadius: 17, backgroundColor: "#FFFDF7", borderWidth: 1, borderColor: "#E7E2D7", padding: 16, marginBottom: 12 }, jobTop: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }, jobId: { color: "#1E2620", fontSize: 15, fontWeight: "800" }, jobAmount: { color: "#236837", fontSize: 17, fontWeight: "800" }, status: { color: "#5E6A60", textTransform: "capitalize", fontSize: 13, marginBottom: 12 }, actionButton: { borderRadius: 10, backgroundColor: "#E8F3E9", paddingVertical: 11, alignItems: "center" }, actionText: { color: "#236837", fontSize: 12, fontWeight: "800" }, empty: { borderRadius: 16, backgroundColor: "#FFFDF7", borderWidth: 1, borderColor: "#E7E2D7", padding: 20 }, emptyTitle: { color: "#1E2620", fontSize: 16, fontWeight: "800" }, emptyText: { color: "#5E6A60", marginTop: 6 }, disabled: { opacity: 0.55 }, pressed: { opacity: 0.75, transform: [{ scale: 0.98 }] }, });
