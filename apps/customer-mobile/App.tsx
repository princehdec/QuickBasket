import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as SecureStore from "expo-secure-store";

const API_BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:4000").replace(/\/$/, "");
const cities = ["Lucknow", "Gopalganj"] as const;
type City = (typeof cities)[number];

type Business = { id: string; name: string; city: string; businessType: string; rating: number | string | null; isActive: boolean };
type Product = { id: string; businessId: string; name: string; unit: string | null; price: string | number; categoryName?: string | null; stock: number; requiresPrescription: boolean; isBestseller: boolean; isActive: boolean };
type ApiEnvelope<T> = { data: T; message?: string };

async function apiRequest<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);
  const payload = await response.json() as ApiEnvelope<T>;
  if (!response.ok || payload.data === undefined) throw new Error(payload.message ?? "Unable to load QuickBasket");
  return payload.data;
}

async function readAccessToken() {
  if (Platform.OS === "web") return window.localStorage.getItem("qb_access_token");
  return SecureStore.getItemAsync("qb_access_token");
}

async function saveAccessToken(value: string) {
  if (Platform.OS === "web") window.localStorage.setItem("qb_access_token", value);
  else await SecureStore.setItemAsync("qb_access_token", value);
}

async function authRequest<T>(path: string, body: Record<string, string>) {
  const response = await fetch(`${API_BASE_URL}${path}`, { method: "POST", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const payload = await response.json() as ApiEnvelope<T>;
  if (!response.ok || payload.data === undefined) throw new Error(payload.message ?? "Authentication failed / authentication विफल हुआ");
  return payload.data;
}

export default function App() {
  const [city, setCity] = useState<City>("Lucknow");
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    readAccessToken().then((value) => setAuthToken(value)).catch(() => setAuthToken(null));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setMessage("");

    const load = async () => {
      const businessResult = await apiRequest<{ items: Business[] }>(`/api/v1/businesses?city=${encodeURIComponent(city)}&limit=20`);
      const productResults = await Promise.all(
        businessResult.items.map((business) => apiRequest<{ items: Product[] }>(`/api/v1/products?businessId=${encodeURIComponent(business.id)}&isAvailable=true&limit=20`))
      );
      return { businesses: businessResult.items, products: productResults.flatMap((result) => result.items) };
    };

    load()
      .then((result) => {
        if (!cancelled) {
          setBusinesses(result.businesses);
          setProducts(result.products);
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) setMessage(error instanceof Error ? error.message : "Unable to load stores / दुकानें लोड नहीं हो सकीं");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [city]);

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const available = products.filter((product) => product.isActive && product.stock > 0);
    if (!normalized) return available;
    return available.filter((product) => [product.name, product.categoryName ?? "", product.unit ?? ""].some((value) => value.toLowerCase().includes(normalized)));
  }, [products, query]);

  const cartCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);

  const addToCart = (product: Product) => {
    if (product.requiresPrescription) {
      setMessage("Prescription verification required / प्रिस्क्रिप्शन सत्यापन आवश्यक");
      return;
    }
    setCart((current) => ({ ...current, [product.id]: (current[product.id] ?? 0) + 1 }));
    setMessage(`${product.name} added to cart / cart में जोड़ा गया`);
  };

  const sendOtp = async () => {
    setAuthLoading(true);
    try {
      const result = await authRequest<{ challengeId: string }>("/api/v1/auth/otp/send", { phone });
      setChallengeId(result.challengeId);
      setMessage("OTP sent / OTP भेजा गया");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not send OTP / OTP नहीं भेजा जा सका");
    } finally {
      setAuthLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!challengeId) return;
    setAuthLoading(true);
    try {
      const result = await authRequest<{ tokens: { accessToken: string; refreshToken: string } }>("/api/v1/auth/otp/verify", { phone, otp, challengeId });
      await saveAccessToken(result.tokens.accessToken);
      if (Platform.OS === "web") window.localStorage.setItem("qb_refresh_token", result.tokens.refreshToken);
      else await SecureStore.setItemAsync("qb_refresh_token", result.tokens.refreshToken);
      setAuthToken(result.tokens.accessToken);
      setOtp("");
      setMessage("Signed in / sign in सफल हुआ");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not verify OTP / OTP verify नहीं हुआ");
    } finally {
      setAuthLoading(false);
    }
  };

  const signOut = async () => {
    if (Platform.OS === "web") {
      window.localStorage.removeItem("qb_access_token");
      window.localStorage.removeItem("qb_refresh_token");
    } else {
      await SecureStore.deleteItemAsync("qb_access_token");
      await SecureStore.deleteItemAsync("qb_refresh_token");
    }
    setAuthToken(null);
    setChallengeId(null);
    setMessage("Signed out / sign out हो गया");
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <View style={styles.productMark}><Text style={styles.productMarkText}>{item.name.slice(0, 1)}</Text></View>
      <Text numberOfLines={2} style={styles.productName}>{item.name}</Text>
      <Text style={styles.productMeta}>{item.unit ?? "1 unit"} · ₹{item.price}</Text>
      {item.requiresPrescription ? <Text style={styles.prescriptionText}>Prescription required / प्रिस्क्रिप्शन आवश्यक</Text> : null}
      <Pressable onPress={() => addToCart(item)} disabled={item.requiresPrescription} style={({ pressed }) => [styles.addButton, pressed && styles.pressed]} accessibilityLabel={`Add ${item.name} to cart`}>
        <Text style={styles.addButtonText}>{item.requiresPrescription ? "Prescription required / प्रिस्क्रिप्शन आवश्यक" : cart[item.id] ? `Add more · ${cart[item.id]}` : "Add to cart / जोड़ें"}</Text>
      </Pressable>
    </View>
  );

  const header = (
    <View>
      <View style={styles.header}>
        <View><Text style={styles.eyebrow}>QUICKBASKET</Text><Text style={styles.title}>What do you need today?</Text><Text style={styles.subtitle}>आज आपको क्या चाहिए?</Text></View>
        <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>{cartCount}</Text><Text style={styles.cartLabel}>Cart</Text></View>
      </View>

      <View style={styles.locationCard}>
        <View><Text style={styles.locationLabel}>Delivering to / डिलीवरी शहर</Text><Text style={styles.locationValue}>{city}</Text></View>
        <View style={styles.citySwitch}>{cities.map((option) => <Pressable key={option} onPress={() => setCity(option)} style={[styles.cityButton, city === option && styles.cityButtonActive]}><Text style={[styles.cityButtonText, city === option && styles.cityButtonTextActive]}>{option}</Text></Pressable>)}</View>
      </View>

      {authToken ? <View style={styles.authSignedIn}><Text style={styles.authSignedText}>Signed in / sign in सफल</Text><Pressable onPress={() => void signOut()}><Text style={styles.authLink}>Sign out / बाहर जाएँ</Text></Pressable></View> : <View style={styles.authCard}><Text style={styles.authTitle}>Phone sign-in / फोन से sign in</Text><TextInput value={phone} onChangeText={setPhone} placeholder="10-digit phone number" placeholderTextColor="#8A938A" style={styles.authInput} keyboardType="phone-pad" maxLength={10} /><Pressable onPress={() => void sendOtp()} disabled={authLoading || phone.length < 10} style={({ pressed }) => [styles.authButton, (authLoading || phone.length < 10) && styles.disabled, pressed && styles.pressed]}><Text style={styles.authButtonText}>{authLoading ? "Sending…" : "Send OTP / OTP भेजें"}</Text></Pressable>{challengeId ? <><TextInput value={otp} onChangeText={setOtp} placeholder="6-digit OTP" placeholderTextColor="#8A938A" style={styles.authInput} keyboardType="number-pad" maxLength={6} /><Pressable onPress={() => void verifyOtp()} disabled={authLoading || otp.length !== 6} style={({ pressed }) => [styles.authButton, (authLoading || otp.length !== 6) && styles.disabled, pressed && styles.pressed]}><Text style={styles.authButtonText}>{authLoading ? "Checking…" : "Verify OTP / OTP verify करें"}</Text></Pressable></> : null}</View>}

      <TextInput value={query} onChangeText={setQuery} placeholder="Search products / उत्पाद खोजें" placeholderTextColor="#8A938A" style={styles.searchInput} returnKeyType="search" />

      <View style={styles.sectionHeader}><View><Text style={styles.sectionTitle}>Shop by service</Text><Text style={styles.sectionHindi}>सेवा चुनें</Text></View></View>
      <View style={styles.serviceGrid}>{["General store / किराना", "Medicines / दवाइयाँ", "Food & bakery / खाना", "Laundry / लॉन्ड्री", "Electronics / इलेक्ट्रॉनिक्स", "Fashion / कपड़े"].map((service) => <View key={service} style={styles.serviceCard}><Text style={styles.serviceName}>{service}</Text></View>)}</View>

      <View style={styles.sectionHeader}><View><Text style={styles.sectionTitle}>Nearby businesses</Text><Text style={styles.sectionHindi}>आस-पास की दुकानें</Text></View><Text style={styles.linkText}>{businesses.length} stores</Text></View>
      {businesses.length === 0 ? <Text style={styles.emptyText}>No stores in this city yet / इस शहर में अभी दुकानें नहीं हैं।</Text> : businesses.slice(0, 6).map((business) => <View key={business.id} style={styles.storeCard}><View style={styles.storeMark}><Text style={styles.storeMarkText}>{business.name.slice(0, 1)}</Text></View><View style={styles.storeDetails}><Text style={styles.storeName}>{business.name}</Text><Text style={styles.storeMeta}>{business.businessType} · {business.rating ?? "New"} rating</Text><Text style={styles.storeTag}>{business.isActive ? "Open / खुला" : "Closed / बंद"}</Text></View></View>)}

      <View style={styles.sectionHeader}><View><Text style={styles.sectionTitle}>Trending products</Text><Text style={styles.sectionHindi}>लोकप्रिय उत्पाद</Text></View><Text style={styles.linkText}>{filteredProducts.length} items</Text></View>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {loading ? <View style={styles.loadingBox}><Text style={styles.loadingText}>Loading live catalog / live catalog लोड हो रहा है…</Text></View> : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}><StatusBar style="dark" /><FlatList data={loading ? [] : filteredProducts} keyExtractor={(item) => item.id} renderItem={renderProduct} numColumns={2} columnWrapperStyle={styles.productRow} ListHeaderComponent={header} contentContainerStyle={styles.content} ListEmptyComponent={!loading ? <Text style={styles.emptyText}>No matching products / कोई matching product नहीं मिला।</Text> : null} /></SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FBF9F3" },
  content: { padding: 20, paddingBottom: 36 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  eyebrow: { color: "#236837", fontSize: 12, fontWeight: "800", letterSpacing: 2 },
  title: { color: "#1E2620", fontSize: 26, fontWeight: "800", marginTop: 6, maxWidth: 260 },
  subtitle: { color: "#5E6A60", fontSize: 16, marginTop: 4 },
  cartBadge: { minWidth: 50, minHeight: 50, borderRadius: 16, backgroundColor: "#E8F3E9", alignItems: "center", justifyContent: "center" },
  cartBadgeText: { color: "#236837", fontSize: 18, fontWeight: "800" },
  cartLabel: { color: "#5E6A60", fontSize: 10, fontWeight: "700" },
  locationCard: { borderRadius: 16, backgroundColor: "#E8F3E9", padding: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  locationLabel: { color: "#5E6A60", fontSize: 12, fontWeight: "700" },
  locationValue: { color: "#236837", fontSize: 16, fontWeight: "800", marginTop: 4 },
  authCard: { borderRadius: 16, backgroundColor: "#FFFDF7", borderWidth: 1, borderColor: "#E7E2D7", padding: 14, marginTop: 16 },
  authSignedIn: { borderRadius: 16, backgroundColor: "#E8F3E9", padding: 14, marginTop: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  authTitle: { color: "#1E2620", fontSize: 14, fontWeight: "800", marginBottom: 8 },
  authSignedText: { color: "#236837", fontSize: 13, fontWeight: "800" },
  authLink: { color: "#236837", fontSize: 12, fontWeight: "800" },
  authInput: { height: 44, borderRadius: 10, borderWidth: 1, borderColor: "#DCD6C8", backgroundColor: "#FFFFFF", paddingHorizontal: 12, color: "#1E2620", marginBottom: 8 },
  authButton: { borderRadius: 10, backgroundColor: "#236837", paddingVertical: 11, alignItems: "center", marginBottom: 8 },
  authButtonText: { color: "#FFFFFF", fontSize: 12, fontWeight: "800" },
  disabled: { opacity: 0.5 },
  citySwitch: { flexDirection: "row", gap: 6 },
  cityButton: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 7, backgroundColor: "#D7E9D9" },
  cityButtonActive: { backgroundColor: "#236837" },
  cityButtonText: { color: "#236837", fontSize: 11, fontWeight: "700" },
  cityButtonTextActive: { color: "#FFFFFF" },
  searchInput: { height: 52, borderRadius: 14, backgroundColor: "#FFFDF7", borderWidth: 1, borderColor: "#E7E2D7", paddingHorizontal: 16, marginTop: 16, color: "#1E2620", fontSize: 15 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: 26, marginBottom: 12 },
  sectionTitle: { color: "#1E2620", fontSize: 19, fontWeight: "800" },
  sectionHindi: { color: "#5E6A60", fontSize: 13, marginTop: 2 },
  linkText: { color: "#236837", fontSize: 13, fontWeight: "800" },
  serviceGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  serviceCard: { width: "31.8%", minHeight: 72, borderRadius: 16, backgroundColor: "#FFFDF7", borderWidth: 1, borderColor: "#E7E2D7", padding: 10, justifyContent: "center" },
  serviceName: { color: "#1E2620", fontSize: 12, fontWeight: "800", lineHeight: 17 },
  storeCard: { borderRadius: 16, backgroundColor: "#FFFDF7", borderWidth: 1, borderColor: "#E7E2D7", padding: 14, flexDirection: "row", alignItems: "center", marginBottom: 10 },
  storeMark: { width: 48, height: 48, borderRadius: 14, backgroundColor: "#F4D58D", alignItems: "center", justifyContent: "center" },
  storeMarkText: { color: "#8A5A00", fontSize: 22, fontWeight: "800" },
  storeDetails: { flex: 1, marginLeft: 12 },
  storeName: { color: "#1E2620", fontSize: 15, fontWeight: "800" },
  storeMeta: { color: "#5E6A60", fontSize: 12, marginTop: 4 },
  storeTag: { color: "#236837", fontSize: 12, fontWeight: "700", marginTop: 5 },
  message: { color: "#236837", backgroundColor: "#E8F3E9", borderRadius: 12, padding: 10, fontSize: 12, marginBottom: 10 },
  loadingBox: { backgroundColor: "#F4F0E7", borderRadius: 12, padding: 14 },
  loadingText: { color: "#5E6A60", fontSize: 13 },
  emptyText: { color: "#5E6A60", backgroundColor: "#F4F0E7", borderRadius: 12, padding: 14, fontSize: 13, marginBottom: 10 },
  productRow: { gap: 10, marginBottom: 10 },
  productCard: { flex: 1, minWidth: 0, borderRadius: 16, backgroundColor: "#FFFDF7", borderWidth: 1, borderColor: "#E7E2D7", padding: 12 },
  productMark: { height: 70, borderRadius: 12, backgroundColor: "#E8F3E9", alignItems: "center", justifyContent: "center", marginBottom: 8 },
  productMarkText: { color: "#236837", fontSize: 28, fontWeight: "800" },
  productName: { color: "#1E2620", fontSize: 13, fontWeight: "800", minHeight: 34 },
  productMeta: { color: "#5E6A60", fontSize: 11, marginTop: 4 },
  prescriptionText: { color: "#9C3B2E", fontSize: 10, fontWeight: "800", marginTop: 4 },
  addButton: { borderRadius: 10, backgroundColor: "#236837", paddingVertical: 9, paddingHorizontal: 6, marginTop: 10, alignItems: "center" },
  addButtonText: { color: "#FFFFFF", fontSize: 11, fontWeight: "800" },
  pressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },
});
