import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import { Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import * as SecureStore from "expo-secure-store";

type OrderStatus = "placed" | "confirmed" | "preparing" | "packed" | "cancelled" | string;
type VendorOrder = { id: string; orderNumber: string; status: OrderStatus; grandTotal: number | string; items: Array<{ quantity: number }> };
type ApiPayload = { data?: unknown; message?: string };

const API_BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:4000").replace(/\/$/, "");
const nextStatus: Partial<Record<string, OrderStatus>> = { placed: "confirmed", confirmed: "preparing", preparing: "packed" };

async function accessToken(): Promise<string | undefined> {
  if (Platform.OS === "web") return window.localStorage.getItem("qb_access_token") ?? undefined;
  return (await SecureStore.getItemAsync("qb_access_token")) ?? undefined;
}

async function apiRequest(path: string, init: RequestInit = {}) {
  const token = await accessToken();
  if (!token) throw new Error("Sign in as vendor to load live orders / लाइव ऑर्डर के लिए vendor sign-in करें");
  const response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers: { Accept: "application/json", "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...(init.headers ?? {}) } });
  const payload = await response.json().catch(() => null) as ApiPayload | null;
  if (!response.ok) throw new Error(payload?.message ?? "Request failed / अनुरोध विफल हुआ");
  return payload?.data;
}

export default function App() {
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyOrderId, setBusyOrderId] = useState<string | null>(null);
  const [message, setMessage] = useState("Sign in as vendor to load live orders / लाइव ऑर्डर के लिए vendor sign-in करें");

  const loadOrders = useCallback(async () => {
    const data = await apiRequest("/api/v1/orders/vendor/queue");
    setOrders((data as VendorOrder[]) ?? []);
  }, []);

  useEffect(() => {
    loadOrders().catch((error: unknown) => setMessage(error instanceof Error ? error.message : "Could not load orders / ऑर्डर नहीं लोड हो सके")).finally(() => setLoading(false));
  }, [loadOrders]);

  const updateStatus = async (order: VendorOrder) => {
    const status = nextStatus[order.status];
    if (!status) return;
    setBusyOrderId(order.id);
    try {
      await apiRequest(`/api/v1/orders/vendor/${order.id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
      setOrders((current) => current.map((item) => item.id === order.id ? { ...item, status } : item));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update order / ऑर्डर update नहीं हुआ");
    } finally {
      setBusyOrderId(null);
    }
  };

  const loadSettlements = async () => {
    try {
      const data = await apiRequest("/api/v1/settlements/me");
      const count = Array.isArray(data) ? data.length : 0;
      setMessage(`${count} settlement records loaded / ${count} settlement records लोड हुए`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load settlements / settlement नहीं लोड हुआ");
    }
  };

  return <SafeAreaView style={styles.safeArea}><StatusBar style="dark" /><ScrollView contentContainerStyle={styles.content}><View style={styles.header}><View><Text style={styles.eyebrow}>QUICKBASKET VENDOR</Text><Text style={styles.title}>Store operations</Text><Text style={styles.subtitle}>Lucknow + Gopalganj · Live / लाइव</Text></View><View style={styles.avatar}><Text style={styles.avatarText}>S</Text></View></View><View style={styles.metricRow}><View style={styles.metric}><Text style={styles.metricLabel}>Live orders</Text><Text style={styles.metricValue}>{orders.length}</Text><Text style={styles.metricHint}>लाइव ऑर्डर</Text></View><View style={styles.metric}><Text style={styles.metricLabel}>Pending</Text><Text style={styles.metricValue}>{orders.filter((order) => order.status === "placed").length}</Text><Text style={styles.metricHint}>लंबित</Text></View></View><View style={styles.sectionHeader}><View><Text style={styles.sectionTitle}>Order queue</Text><Text style={styles.sectionHindi}>ऑर्डर सूची</Text></View><Pressable onPress={() => void loadOrders()} style={styles.refreshButton}><Text style={styles.refreshText}>Refresh</Text></Pressable></View>{loading ? <View style={styles.empty}><Text style={styles.emptyText}>Loading / लोड हो रहा है…</Text></View> : orders.length === 0 ? <View style={styles.empty}><Text style={styles.emptyTitle}>No live orders / अभी कोई live order नहीं</Text><Text style={styles.emptyText}>{message}</Text></View> : orders.map((order) => <View key={order.id} style={styles.orderCard}><View style={styles.orderMain}><Text style={styles.orderId}>{order.orderNumber}</Text><Text style={styles.orderCustomer}>{order.status.replaceAll("_", " ")}</Text><Text style={styles.orderMeta}>{order.items.reduce((sum, item) => sum + item.quantity, 0)} items · ₹{order.grandTotal}</Text></View><Pressable onPress={() => void updateStatus(order)} disabled={!nextStatus[order.status] || busyOrderId === order.id} style={({ pressed }) => [styles.actionButton, (!nextStatus[order.status] || busyOrderId === order.id) && styles.disabled, pressed && styles.pressed]}><Text style={styles.actionText}>{busyOrderId === order.id ? "Saving…" : order.status === "placed" ? "Accept" : order.status === "confirmed" ? "Prepare" : order.status === "preparing" ? "Ready" : "Done"}</Text></Pressable></View>)}<View style={styles.bottomActions}><Pressable onPress={() => setMessage("Add products from vendor web / नए उत्पाद vendor web से जोड़ें")} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}><Text style={styles.primaryText}>Add product / उत्पाद जोड़ें</Text></Pressable><Pressable onPress={() => void loadSettlements()} style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}><Text style={styles.secondaryText}>Settlement / भुगतान</Text></Pressable></View></ScrollView></SafeAreaView>;
}

const styles = StyleSheet.create({ safeArea: { flex: 1, backgroundColor: "#FBF9F3" }, content: { padding: 20, paddingBottom: 36 }, header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }, eyebrow: { color: "#236837", fontSize: 11, fontWeight: "800", letterSpacing: 1.8 }, title: { color: "#1E2620", fontSize: 26, fontWeight: "800", marginTop: 6 }, subtitle: { color: "#5E6A60", fontSize: 14, marginTop: 4 }, avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: "#E8F3E9", alignItems: "center", justifyContent: "center" }, avatarText: { color: "#236837", fontSize: 20, fontWeight: "800" }, metricRow: { flexDirection: "row", gap: 10 }, metric: { flex: 1, backgroundColor: "#FFFDF7", borderRadius: 16, borderWidth: 1, borderColor: "#E7E2D7", padding: 15 }, metricLabel: { color: "#5E6A60", fontSize: 12, fontWeight: "700" }, metricValue: { color: "#236837", fontSize: 25, fontWeight: "800", marginTop: 7 }, metricHint: { color: "#5E6A60", fontSize: 11, marginTop: 3 }, sectionHeader: { marginTop: 28, marginBottom: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }, sectionTitle: { color: "#1E2620", fontSize: 19, fontWeight: "800" }, sectionHindi: { color: "#5E6A60", fontSize: 13, marginTop: 2 }, refreshButton: { padding: 4 }, refreshText: { color: "#236837", fontSize: 12, fontWeight: "800" }, orderCard: { backgroundColor: "#FFFDF7", borderWidth: 1, borderColor: "#E7E2D7", borderRadius: 16, padding: 15, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }, orderMain: { flex: 1 }, orderId: { color: "#1E2620", fontSize: 15, fontWeight: "800" }, orderCustomer: { color: "#5E6A60", fontSize: 13, marginTop: 4, textTransform: "capitalize" }, orderMeta: { color: "#236837", fontSize: 12, fontWeight: "700", marginTop: 4 }, actionButton: { backgroundColor: "#E8F3E9", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 }, actionText: { color: "#236837", fontSize: 12, fontWeight: "800" }, bottomActions: { marginTop: 22, gap: 10 }, primaryButton: { borderRadius: 13, backgroundColor: "#236837", paddingVertical: 14, alignItems: "center" }, primaryText: { color: "#FFFFFF", fontSize: 14, fontWeight: "800" }, secondaryButton: { borderRadius: 13, borderWidth: 1, borderColor: "#236837", paddingVertical: 14, alignItems: "center" }, secondaryText: { color: "#236837", fontSize: 14, fontWeight: "800" }, empty: { borderRadius: 16, backgroundColor: "#FFFDF7", borderWidth: 1, borderColor: "#E7E2D7", padding: 20 }, emptyTitle: { color: "#1E2620", fontSize: 16, fontWeight: "800" }, emptyText: { color: "#5E6A60", marginTop: 6 }, disabled: { opacity: 0.55 }, pressed: { opacity: 0.75, transform: [{ scale: 0.98 }] }, });
