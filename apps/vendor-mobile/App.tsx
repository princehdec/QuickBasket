import { StatusBar } from "expo-status-bar";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

const orders = [
  { id: "QB-10482", customer: "Rahul Sharma", amount: "₹684", action: "Accept" },
  { id: "QB-10481", customer: "Neha Verma", amount: "₹312", action: "Mark ready" },
];

const stock = [
  { name: "Aashirvaad Atta 5 kg", status: "In stock", color: "#236837" },
  { name: "Amul Gold Milk 1 L", status: "Low stock", color: "#8A5A00" },
  { name: "Fortune Mustard Oil", status: "Out of stock", color: "#8E2F23" },
];

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>QUICKBASKET VENDOR</Text>
            <Text style={styles.title}>Sharma Store</Text>
            <Text style={styles.subtitle}>Lucknow · Online / ऑनलाइन</Text>
          </View>
          <View style={styles.avatar}><Text style={styles.avatarText}>S</Text></View>
        </View>

        <View style={styles.metricRow}>
          <View style={styles.metric}><Text style={styles.metricLabel}>Orders today</Text><Text style={styles.metricValue}>24</Text><Text style={styles.metricHint}>आज के ऑर्डर</Text></View>
          <View style={styles.metric}><Text style={styles.metricLabel}>This week</Text><Text style={styles.metricValue}>₹18.4k</Text><Text style={styles.metricHint}>इस सप्ताह</Text></View>
        </View>

        <View style={styles.sectionHeader}><View><Text style={styles.sectionTitle}>Order queue</Text><Text style={styles.sectionHindi}>ऑर्डर सूची</Text></View><Text style={styles.linkText}>View all</Text></View>
        {orders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderMain}><Text style={styles.orderId}>{order.id}</Text><Text style={styles.orderCustomer}>{order.customer}</Text><Text style={styles.orderMeta}>6 items · {order.amount}</Text></View>
            <Pressable style={styles.actionButton} accessibilityLabel={`${order.action} ${order.id}`}><Text style={styles.actionText}>{order.action}</Text></Pressable>
          </View>
        ))}

        <View style={styles.sectionHeader}><View><Text style={styles.sectionTitle}>Inventory watch</Text><Text style={styles.sectionHindi}>स्टॉक निगरानी</Text></View><Text style={styles.linkText}>Manage</Text></View>
        <View style={styles.stockCard}>
          {stock.map((item, index) => (
            <View key={item.name} style={[styles.stockRow, index < stock.length - 1 && styles.stockBorder]}>
              <View style={styles.stockDot}><View style={[styles.stockDotInner, { backgroundColor: item.color }]} /></View>
              <Text style={styles.stockName}>{item.name}</Text>
              <Text style={[styles.stockStatus, { color: item.color }]}>{item.status}</Text>
            </View>
          ))}
        </View>

        <View style={styles.bottomActions}>
          <Pressable style={styles.primaryButton}><Text style={styles.primaryText}>Add product / उत्पाद जोड़ें</Text></Pressable>
          <Pressable style={styles.secondaryButton}><Text style={styles.secondaryText}>Settlement / भुगतान</Text></Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FBF9F3" },
  content: { padding: 20, paddingBottom: 36 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 22 },
  eyebrow: { color: "#236837", fontSize: 11, fontWeight: "800", letterSpacing: 1.8 },
  title: { color: "#1E2620", fontSize: 26, fontWeight: "800", marginTop: 6 },
  subtitle: { color: "#5E6A60", fontSize: 14, marginTop: 4 },
  avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: "#E8F3E9", alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#236837", fontSize: 20, fontWeight: "800" },
  metricRow: { flexDirection: "row", gap: 10 },
  metric: { flex: 1, backgroundColor: "#FFFDF7", borderRadius: 16, borderWidth: 1, borderColor: "#E7E2D7", padding: 15 },
  metricLabel: { color: "#5E6A60", fontSize: 12, fontWeight: "700" },
  metricValue: { color: "#236837", fontSize: 25, fontWeight: "800", marginTop: 7 },
  metricHint: { color: "#5E6A60", fontSize: 11, marginTop: 3 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: 28, marginBottom: 12 },
  sectionTitle: { color: "#1E2620", fontSize: 19, fontWeight: "800" },
  sectionHindi: { color: "#5E6A60", fontSize: 13, marginTop: 2 },
  linkText: { color: "#236837", fontSize: 13, fontWeight: "800" },
  orderCard: { backgroundColor: "#FFFDF7", borderWidth: 1, borderColor: "#E7E2D7", borderRadius: 16, padding: 15, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  orderMain: { flex: 1 },
  orderId: { color: "#1E2620", fontSize: 15, fontWeight: "800" },
  orderCustomer: { color: "#5E6A60", fontSize: 13, marginTop: 4 },
  orderMeta: { color: "#236837", fontSize: 12, fontWeight: "700", marginTop: 4 },
  actionButton: { backgroundColor: "#E8F3E9", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 },
  actionText: { color: "#236837", fontSize: 12, fontWeight: "800" },
  stockCard: { backgroundColor: "#FFFDF7", borderWidth: 1, borderColor: "#E7E2D7", borderRadius: 16, paddingHorizontal: 15 },
  stockRow: { minHeight: 56, flexDirection: "row", alignItems: "center" },
  stockBorder: { borderBottomWidth: 1, borderBottomColor: "#ECE7DD" },
  stockDot: { width: 22, height: 22, borderRadius: 11, backgroundColor: "#F4F0E7", alignItems: "center", justifyContent: "center", marginRight: 10 },
  stockDotInner: { width: 8, height: 8, borderRadius: 4 },
  stockName: { flex: 1, color: "#1E2620", fontSize: 13, fontWeight: "700" },
  stockStatus: { fontSize: 11, fontWeight: "800" },
  bottomActions: { marginTop: 22, gap: 10 },
  primaryButton: { borderRadius: 13, backgroundColor: "#236837", paddingVertical: 14, alignItems: "center" },
  primaryText: { color: "#FFFFFF", fontSize: 14, fontWeight: "800" },
  secondaryButton: { borderRadius: 13, borderWidth: 1, borderColor: "#236837", paddingVertical: 14, alignItems: "center" },
  secondaryText: { color: "#236837", fontSize: 14, fontWeight: "800" },
});
