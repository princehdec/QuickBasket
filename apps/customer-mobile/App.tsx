import { StatusBar } from "expo-status-bar";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

const services = [
  ["General store", "किराना", "🛒"],
  ["Medicines", "दवाइयाँ", "💊"],
  ["Food & bakery", "खाना", "🍞"],
  ["Laundry", "कपड़े", "🧺"],
  ["Electronics", "इलेक्ट्रॉनिक्स", "🔌"],
  ["Fashion", "कपड़े", "👕"],
];

const stores = [
  { name: "Sharma General Store", city: "Lucknow", eta: "25–35 min", tag: "Open" },
  { name: "Gopalganj Family Pharmacy", city: "Gopalganj", eta: "20–30 min", tag: "Prescription review" },
];

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>QUICKBASKET</Text>
            <Text style={styles.title}>What do you need today?</Text>
            <Text style={styles.subtitle}>आज आपको क्या चाहिए?</Text>
          </View>
          <Pressable style={styles.profileButton} accessibilityLabel="Open profile">
            <Text style={styles.profileText}>P</Text>
          </Pressable>
        </View>

        <Pressable style={styles.locationCard} accessibilityLabel="Choose delivery location">
          <View>
            <Text style={styles.locationLabel}>Delivering to / डिलीवरी पता</Text>
            <Text style={styles.locationValue}>Lucknow · Choose address</Text>
          </View>
          <Text style={styles.changeText}>Change</Text>
        </Pressable>

        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>⌕</Text>
          <Text style={styles.searchText}>Search products, stores / खोजें</Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Shop by service</Text>
          <Text style={styles.sectionHindi}>सेवा चुनें</Text>
        </View>
        <View style={styles.serviceGrid}>
          {services.map(([english, hindi, icon]) => (
            <Pressable key={english} style={styles.serviceCard} accessibilityLabel={english}>
              <Text style={styles.serviceIcon}>{icon}</Text>
              <Text style={styles.serviceName}>{english}</Text>
              <Text style={styles.serviceHindi}>{hindi}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Nearby businesses</Text>
            <Text style={styles.sectionHindi}>आस-पास की दुकानें</Text>
          </View>
          <Text style={styles.linkText}>See all</Text>
        </View>
        {stores.map((store) => (
          <Pressable key={store.name} style={styles.storeCard} accessibilityLabel={`Open ${store.name}`}>
            <View style={styles.storeMark}><Text style={styles.storeMarkText}>{store.name.slice(0, 1)}</Text></View>
            <View style={styles.storeDetails}>
              <Text style={styles.storeName}>{store.name}</Text>
              <Text style={styles.storeMeta}>{store.city} · {store.eta}</Text>
              <Text style={styles.storeTag}>{store.tag}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FBF9F3" },
  content: { padding: 20, paddingBottom: 36 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  eyebrow: { color: "#236837", fontSize: 12, fontWeight: "800", letterSpacing: 2 },
  title: { color: "#1E2620", fontSize: 26, fontWeight: "800", marginTop: 6, maxWidth: 260 },
  subtitle: { color: "#5E6A60", fontSize: 16, marginTop: 4 },
  profileButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#E8F3E9", alignItems: "center", justifyContent: "center" },
  profileText: { color: "#236837", fontSize: 18, fontWeight: "800" },
  locationCard: { borderRadius: 16, backgroundColor: "#E8F3E9", padding: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  locationLabel: { color: "#5E6A60", fontSize: 12, fontWeight: "700" },
  locationValue: { color: "#236837", fontSize: 15, fontWeight: "800", marginTop: 4 },
  changeText: { color: "#236837", fontSize: 13, fontWeight: "800" },
  searchBox: { height: 52, borderRadius: 14, backgroundColor: "#FFFDF7", borderWidth: 1, borderColor: "#E7E2D7", flexDirection: "row", alignItems: "center", paddingHorizontal: 16, marginTop: 16 },
  searchIcon: { color: "#236837", fontSize: 24, marginRight: 10 },
  searchText: { color: "#8A938A", fontSize: 15 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: 26, marginBottom: 12 },
  sectionTitle: { color: "#1E2620", fontSize: 19, fontWeight: "800" },
  sectionHindi: { color: "#5E6A60", fontSize: 13, marginTop: 2 },
  linkText: { color: "#236837", fontSize: 13, fontWeight: "800" },
  serviceGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  serviceCard: { width: "31.8%", minHeight: 104, borderRadius: 16, backgroundColor: "#FFFDF7", borderWidth: 1, borderColor: "#E7E2D7", padding: 10 },
  serviceIcon: { fontSize: 24 },
  serviceName: { color: "#1E2620", fontSize: 12, fontWeight: "800", marginTop: 7 },
  serviceHindi: { color: "#5E6A60", fontSize: 11, marginTop: 2 },
  storeCard: { borderRadius: 16, backgroundColor: "#FFFDF7", borderWidth: 1, borderColor: "#E7E2D7", padding: 14, flexDirection: "row", alignItems: "center", marginBottom: 10 },
  storeMark: { width: 48, height: 48, borderRadius: 14, backgroundColor: "#F4D58D", alignItems: "center", justifyContent: "center" },
  storeMarkText: { color: "#8A5A00", fontSize: 22, fontWeight: "800" },
  storeDetails: { flex: 1, marginLeft: 12 },
  storeName: { color: "#1E2620", fontSize: 15, fontWeight: "800" },
  storeMeta: { color: "#5E6A60", fontSize: 12, marginTop: 4 },
  storeTag: { color: "#236837", fontSize: 12, fontWeight: "700", marginTop: 5 },
  arrow: { color: "#236837", fontSize: 28, marginLeft: 8 },
});
