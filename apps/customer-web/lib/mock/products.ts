export type Product = {
  id: string;
  storeId: string;
  categoryId: string;
  name: string;
  unit: string;
  price: number;
  originalPrice?: number;
  image: string;
  isVeg: boolean;
  isBestseller?: boolean;
};

export const products: Product[] = [
  // ── Vegetables ──────────────────────────────────────────
  { id: "p-001", storeId: "fresh-mart", categoryId: "vegetables", name: "Onion", unit: "1 kg", price: 30, originalPrice: 40, image: "from-red-100 via-red-200 to-amber-100", isVeg: true },
  { id: "p-002", storeId: "fresh-mart", categoryId: "vegetables", name: "Tomato", unit: "500 g", price: 20, originalPrice: 25, image: "from-red-100 via-red-200 to-orange-100", isVeg: true, isBestseller: true },
  { id: "p-003", storeId: "fresh-mart", categoryId: "vegetables", name: "Potato", unit: "2 kg", price: 40, originalPrice: 50, image: "from-yellow-100 via-yellow-200 to-amber-100", isVeg: true },
  { id: "p-004", storeId: "fresh-mart", categoryId: "vegetables", name: "Spinach", unit: "250 g", price: 15, image: "from-green-100 via-green-200 to-emerald-100", isVeg: true },
  { id: "p-005", storeId: "fresh-mart", categoryId: "vegetables", name: "Cauliflower", unit: "1 pc", price: 35, image: "from-white via-gray-100 to-green-50", isVeg: true },
  { id: "p-006", storeId: "fresh-mart", categoryId: "vegetables", name: "Capsicum", unit: "250 g", price: 18, image: "from-green-200 via-green-300 to-emerald-200", isVeg: true },

  // ── Fruits ──────────────────────────────────────────────
  { id: "p-007", storeId: "fresh-mart", categoryId: "fruits", name: "Apple", unit: "1 kg", price: 120, originalPrice: 150, image: "from-red-200 via-red-300 to-rose-200", isVeg: true, isBestseller: true },
  { id: "p-008", storeId: "fresh-mart", categoryId: "fruits", name: "Banana", unit: "6 pcs", price: 30, image: "from-yellow-100 via-yellow-200 to-amber-100", isVeg: true },
  { id: "p-009", storeId: "fresh-mart", categoryId: "fruits", name: "Orange", unit: "1 kg", price: 80, originalPrice: 100, image: "from-orange-100 via-orange-200 to-amber-100", isVeg: true },
  { id: "p-010", storeId: "fresh-mart", categoryId: "fruits", name: "Grapes", unit: "500 g", price: 60, image: "from-purple-100 via-purple-200 to-violet-100", isVeg: true },
  { id: "p-011", storeId: "fresh-mart", categoryId: "fruits", name: "Pomegranate", unit: "1 kg", price: 140, originalPrice: 180, image: "from-red-200 via-red-300 to-rose-200", isVeg: true },
  { id: "p-012", storeId: "fresh-mart", categoryId: "fruits", name: "Mango", unit: "1 kg", price: 90, image: "from-yellow-200 via-yellow-300 to-orange-200", isVeg: true },

  // ── Dairy ───────────────────────────────────────────────
  { id: "p-013", storeId: "fresh-mart", categoryId: "dairy", name: "Full Cream Milk", unit: "1 L", price: 60, originalPrice: 68, image: "from-blue-100 via-blue-200 to-sky-100", isVeg: true, isBestseller: true },
  { id: "p-014", storeId: "fresh-mart", categoryId: "dairy", name: "Curd", unit: "500 g", price: 40, image: "from-white via-gray-50 to-blue-50", isVeg: true },
  { id: "p-015", storeId: "fresh-mart", categoryId: "dairy", name: "Butter", unit: "200 g", price: 55, originalPrice: 65, image: "from-yellow-100 via-yellow-200 to-amber-100", isVeg: true },
  { id: "p-016", storeId: "fresh-mart", categoryId: "dairy", name: "Paneer", unit: "250 g", price: 85, image: "from-white via-gray-100 to-gray-50", isVeg: true },
  { id: "p-017", storeId: "fresh-mart", categoryId: "dairy", name: "Cheese Slices", unit: "10 pcs", price: 95, image: "from-yellow-50 via-yellow-100 to-amber-50", isVeg: true },
  { id: "p-018", storeId: "fresh-mart", categoryId: "dairy", name: "Buttermilk", unit: "1 L", price: 30, image: "from-white via-blue-50 to-sky-50", isVeg: true },

  // ── Bakery ──────────────────────────────────────────────
  { id: "p-019", storeId: "fresh-mart", categoryId: "bakery", name: "Brown Bread", unit: "400 g", price: 40, originalPrice: 50, image: "from-amber-100 via-amber-200 to-yellow-100", isVeg: true },
  { id: "p-020", storeId: "fresh-mart", categoryId: "bakery", name: "White Bread", unit: "400 g", price: 35, image: "from-white via-gray-100 to-gray-50", isVeg: true },
  { id: "p-021", storeId: "fresh-mart", categoryId: "bakery", name: "Pav", unit: "6 pcs", price: 25, image: "from-amber-100 via-amber-200 to-orange-100", isVeg: true },
  { id: "p-022", storeId: "fresh-mart", categoryId: "bakery", name: "Cake (Vanilla)", unit: "500 g", price: 250, image: "from-pink-100 via-pink-200 to-rose-100", isVeg: false },
  { id: "p-023", storeId: "fresh-mart", categoryId: "bakery", name: "Biscuits", unit: "200 g", price: 20, image: "from-amber-50 via-amber-100 to-yellow-50", isVeg: true },
  { id: "p-024", storeId: "fresh-mart", categoryId: "bakery", name: "Croissant", unit: "2 pcs", price: 60, image: "from-amber-100 via-amber-200 to-orange-100", isVeg: true },

  // ── Snacks ──────────────────────────────────────────────
  { id: "p-025", storeId: "fresh-mart", categoryId: "snacks", name: "Potato Chips", unit: "100 g", price: 20, originalPrice: 25, image: "from-red-100 via-red-200 to-amber-100", isVeg: true },
  { id: "p-026", storeId: "fresh-mart", categoryId: "snacks", name: "Mixed Nuts", unit: "200 g", price: 150, image: "from-amber-100 via-amber-200 to-brown-100", isVeg: true, isBestseller: true },
  { id: "p-027", storeId: "fresh-mart", categoryId: "snacks", name: "Namkeen", unit: "250 g", price: 35, image: "from-yellow-100 via-yellow-200 to-orange-100", isVeg: true },
  { id: "p-028", storeId: "fresh-mart", categoryId: "snacks", name: "Chocolate Bar", unit: "50 g", price: 45, image: "from-brown-200 via-brown-300 to-amber-200", isVeg: false },
  { id: "p-029", storeId: "fresh-mart", categoryId: "snacks", name: "Popcorn", unit: "150 g", price: 30, image: "from-yellow-100 via-yellow-200 to-amber-100", isVeg: true },

  // ── Beverages ───────────────────────────────────────────
  { id: "p-030", storeId: "fresh-mart", categoryId: "beverages", name: "Packaged Water", unit: "1 L", price: 20, image: "from-blue-100 via-blue-200 to-cyan-100", isVeg: true },
  { id: "p-031", storeId: "fresh-mart", categoryId: "beverages", name: "Orange Juice", unit: "1 L", price: 85, originalPrice: 100, image: "from-orange-100 via-orange-200 to-amber-100", isVeg: true },
  { id: "p-032", storeId: "fresh-mart", categoryId: "beverages", name: "Cola", unit: "750 ml", price: 40, image: "from-red-100 via-red-200 to-rose-100", isVeg: true },
  { id: "p-033", storeId: "fresh-mart", categoryId: "beverages", name: "Green Tea", unit: "25 bags", price: 95, image: "from-green-100 via-green-200 to-emerald-100", isVeg: true },
  { id: "p-034", storeId: "fresh-mart", categoryId: "beverages", name: "Cold Coffee", unit: "200 ml", price: 55, image: "from-brown-100 via-brown-200 to-amber-100", isVeg: true },
  { id: "p-035", storeId: "fresh-mart", categoryId: "beverages", name: "Energy Drink", unit: "250 ml", price: 70, image: "from-cyan-100 via-cyan-200 to-blue-100", isVeg: true },

  // ── Frozen ──────────────────────────────────────────────
  { id: "p-036", storeId: "fresh-mart", categoryId: "frozen", name: "Frozen Peas", unit: "500 g", price: 45, image: "from-green-100 via-green-200 to-emerald-100", isVeg: true },
  { id: "p-037", storeId: "fresh-mart", categoryId: "frozen", name: "Ice Cream (Vanilla)", unit: "500 ml", price: 120, originalPrice: 150, image: "from-white via-blue-50 to-cyan-50", isVeg: true, isBestseller: true },
  { id: "p-038", storeId: "fresh-mart", categoryId: "frozen", name: "Frozen Chicken", unit: "500 g", price: 180, image: "from-red-100 via-red-200 to-rose-100", isVeg: false },
  { id: "p-039", storeId: "fresh-mart", categoryId: "frozen", name: "Frozen Veggies", unit: "400 g", price: 60, image: "from-green-100 via-green-200 to-emerald-100", isVeg: true },
  { id: "p-040", storeId: "fresh-mart", categoryId: "frozen", name: "Frozen Pizza", unit: "250 g", price: 150, image: "from-amber-100 via-amber-200 to-yellow-100", isVeg: true },

  // ── Household ───────────────────────────────────────────
  { id: "p-041", storeId: "fresh-mart", categoryId: "household", name: "Dish Soap", unit: "500 ml", price: 65, image: "from-green-100 via-green-200 to-emerald-100", isVeg: false },
  { id: "p-042", storeId: "fresh-mart", categoryId: "household", name: "Detergent Powder", unit: "1 kg", price: 120, originalPrice: 150, image: "from-blue-100 via-blue-200 to-sky-100", isVeg: false },
  { id: "p-043", storeId: "fresh-mart", categoryId: "household", name: "Hand Wash", unit: "250 ml", price: 55, image: "from-pink-100 via-pink-200 to-rose-100", isVeg: false },
  { id: "p-044", storeId: "fresh-mart", categoryId: "household", name: "Toilet Cleaner", unit: "500 ml", price: 70, image: "from-blue-100 via-blue-200 to-indigo-100", isVeg: false },
  { id: "p-045", storeId: "fresh-mart", categoryId: "household", name: "Trash Bags", unit: "20 pcs", price: 40, image: "from-gray-100 via-gray-200 to-slate-100", isVeg: false },
  { id: "p-046", storeId: "fresh-mart", categoryId: "household", name: "Tissue Box", unit: "200 sheets", price: 85, image: "from-white via-gray-100 to-gray-50", isVeg: false },
];
