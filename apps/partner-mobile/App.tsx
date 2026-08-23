import { StatusBar } from "expo-status-bar";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

const jobs = [
  { id: "QB-10482", pickup: "Sharma General Store", drop: "Aliganj, Lucknow", amount: "₹86", status: "New job" },
  { id: "QB-10476", pickup: "Fresh Bake House", drop: "Gopalganj Road", amount: "₹72", status: "In progress" },
];

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>QUICKBASKET PARTNER</Text>
            <Text style={styles.title}>Namaste, Prakash</Text>
            <Text style={styles.subtitle}>Ready for your next delivery?</Text>
          </View>
          <View style={styles.avatar}><Text style={styles.avatarText}>P</Text></View>
        </View>

        <View style={styles.onlineCard}>
          <View>
            <Text style={styles.onlineLabel}>Partner status / पार्टनर स्थिति</Text>
            <Text style={styles.onlineTitle}>You are online</Text>
            <Text style={styles.onlineSubtitle}>Receiving jobs near Lucknow</Text>
          </View>
          <View style={styles.toggle}><View style={styles.toggleKnob} /></View>
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metric}><Text style={styles.metricLabel}>Today / आज</Text><Text style={styles.metricValue}>₹642</Text><Text style={styles.metricHint}>8 deliveries</Text></View>
          <View style={styles.metric}><Text style={styles.metricLabel}>This week / सप्ताह</Text><Text style={styles.metricValue}>₹3,820</Text><Text style={styles.metricHint}>42 deliveries</Text></View>
        </View>

        <View style={styles.sectionHeader}>
          <View><Text style={styles.sectionTitle}>Delivery jobs</Text><Text style={styles.sectionHindi}>डिलीवरी काम</Text></View>
          <Text style={styles.linkText}>History</Text>
        </View>
        {jobs.map((job) => (
          <Pressable key={job.id} style={styles.jobCard} accessibilityLabel={`Open job ${job.id}`}>
            <View style={styles.jobTop}><Text style={styles.jobId}>{job.id}</Text><Text style={styles.jobAmount}>{job.amount}</Text></View>
            <View style={styles.routeRow}><View style={styles.routeDotGreen} /><View style={styles.routeText}><Text style={styles.routeLabel}>Pickup</Text><Text style={styles.routeValue}>{job.pickup}</Text></View></View>
            <View style={styles.routeLine} />
            <View style={styles.routeRow}><View style={styles.routeDotRed} /><View style={styles.routeText}><Text style={styles.routeLabel}>Drop</Text><Text style={styles.routeValue}>{job.drop}</Text></View></View>
            <View style={styles.jobFooter}><Text style={job.status === "New job" ? styles.newStatus : styles.progressStatus}>{job.status}</Text><Text style={styles.openText}>Open ›</Text></View>
          </Pressable>
        ))}
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
  onlineCard: { borderRadius: 18, backgroundColor: "#236837", padding: 18, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  onlineLabel: { color: "#D6E9D7", fontSize: 12, fontWeight: "700" },
  onlineTitle: { color: "#FFFFFF", fontSize: 20, fontWeight: "800", marginTop: 5 },
  onlineSubtitle: { color: "#E8F3E9", fontSize: 12, marginTop: 4 },
  toggle: { width: 48, height: 28, borderRadius: 16, backgroundColor: "#FFFFFF", padding: 3, justifyContent: "center" },
  toggleKnob: { width: 22, height: 22, borderRadius: 11, backgroundColor: "#DC9A2B", alignSelf: "flex-end" },
  metricsRow: { flexDirection: "row", gap: 10, marginTop: 14 },
  metric: { flex: 1, borderRadius: 16, backgroundColor: "#FFFDF7", borderWidth: 1, borderColor: "#E7E2D7", padding: 15 },
  metricLabel: { color: "#5E6A60", fontSize: 12, fontWeight: "700" },
  metricValue: { color: "#1E2620", fontSize: 24, fontWeight: "800", marginTop: 7 },
  metricHint: { color: "#5E6A60", fontSize: 11, marginTop: 3 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: 28, marginBottom: 12 },
  sectionTitle: { color: "#1E2620", fontSize: 19, fontWeight: "800" },
  sectionHindi: { color: "#5E6A60", fontSize: 13, marginTop: 2 },
  linkText: { color: "#236837", fontSize: 13, fontWeight: "800" },
  jobCard: { borderRadius: 17, backgroundColor: "#FFFDF7", borderWidth: 1, borderColor: "#E7E2D7", padding: 16, marginBottom: 12 },
  jobTop: { flexDirection: "row", justifyContent: "space-between", marginBottom: 14 },
  jobId: { color: "#1E2620", fontSize: 15, fontWeight: "800" },
  jobAmount: { color: "#236837", fontSize: 17, fontWeight: "800" },
  routeRow: { flexDirection: "row", alignItems: "center" },
  routeDotGreen: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#2F8144", marginRight: 11 },
  routeDotRed: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#8E2F23", marginRight: 11 },
  routeText: { flex: 1 },
  routeLabel: { color: "#5E6A60", fontSize: 11, fontWeight: "700" },
  routeValue: { color: "#1E2620", fontSize: 13, fontWeight: "700", marginTop: 2 },
  routeLine: { height: 16, borderLeftWidth: 1, borderLeftColor: "#D5D0C6", marginLeft: 4, marginVertical: 2 },
  jobFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 15, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#ECE7DD" },
  newStatus: { color: "#8A5A00", backgroundColor: "#FFF4D6", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, fontSize: 11, fontWeight: "800" },
  progressStatus: { color: "#236837", backgroundColor: "#E8F3E9", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, fontSize: 11, fontWeight: "800" },
  openText: { color: "#236837", fontSize: 13, fontWeight: "800" },
});
