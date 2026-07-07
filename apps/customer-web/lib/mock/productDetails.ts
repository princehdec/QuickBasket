import { products, type Product } from "./products";

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export type ProductDetail = {
  id: string;
  brand: string;
  description: string;
  rating: number;
  reviewsCount: number;
  stockStatus: StockStatus;
  stockCount: number;
  images: string[];
  ingredients: string[];
  nutritionalInfo: { label: string; value: string }[];
  storage: string;
  manufacturer: string;
  countryOfOrigin: string;
  similarProductIds: string[];
  boughtTogetherIds: string[];
};

type RawDetail = Omit<ProductDetail, "id" | "similarProductIds" | "boughtTogetherIds">;

const rawDetails: Record<string, RawDetail> = {
  "p-001": {
    brand: "Fresh Mart Select",
    description: "Premium quality red onions sourced from Maharashtra. These onions are hand-picked, sun-dried, and graded for consistent size and freshness. Ideal for daily cooking, salads, and pickling.",
    rating: 4.2,
    reviewsCount: 89,
    stockStatus: "in_stock",
    stockCount: 250,
    images: ["from-red-200 via-red-300 to-amber-200", "from-rose-100 via-red-200 to-amber-100", "from-purple-100 via-red-200 to-orange-100"],
    ingredients: ["Onion"],
    nutritionalInfo: [
      { label: "Calories", value: "40 kcal" },
      { label: "Carbohydrates", value: "9 g" },
      { label: "Protein", value: "1.1 g" },
      { label: "Fat", value: "0.1 g" },
      { label: "Fiber", value: "1.7 g" },
      { label: "Vitamin C", value: "12%" },
    ],
    storage: "Store in a cool, dry, well-ventilated place away from direct sunlight. Do not refrigerate.",
    manufacturer: "Fresh Mart Farms Pvt. Ltd.",
    countryOfOrigin: "India",
  },
  "p-002": {
    brand: "Fresh Mart Select",
    description: "Vine-ripened tomatoes grown in organic conditions. Each tomato is carefully handpicked at peak ripeness to ensure maximum flavor and nutrition. Perfect for curries, salads, soups, and sauces.",
    rating: 4.5,
    reviewsCount: 128,
    stockStatus: "in_stock",
    stockCount: 180,
    images: ["from-red-200 via-red-300 to-orange-200", "from-rose-100 via-red-200 to-orange-100", "from-red-100 via-orange-200 to-amber-100"],
    ingredients: ["Tomato"],
    nutritionalInfo: [
      { label: "Calories", value: "18 kcal" },
      { label: "Carbohydrates", value: "3.9 g" },
      { label: "Protein", value: "0.9 g" },
      { label: "Fat", value: "0.2 g" },
      { label: "Fiber", value: "1.2 g" },
      { label: "Vitamin C", value: "28%" },
    ],
    storage: "Store at room temperature away from direct sunlight. Refrigerate only after cutting.",
    manufacturer: "Fresh Mart Farms Pvt. Ltd.",
    countryOfOrigin: "India",
  },
  "p-003": {
    brand: "Fresh Mart Select",
    description: "High-quality potatoes sourced from the finest farms in Gujarat. These versatile potatoes have smooth skin and uniform size, making them ideal for cooking, frying, and mashing.",
    rating: 4.3,
    reviewsCount: 95,
    stockStatus: "in_stock",
    stockCount: 300,
    images: ["from-yellow-200 via-yellow-300 to-amber-200", "from-amber-100 via-yellow-200 to-orange-100", "from-stone-100 via-yellow-200 to-amber-100"],
    ingredients: ["Potato"],
    nutritionalInfo: [
      { label: "Calories", value: "77 kcal" },
      { label: "Carbohydrates", value: "17 g" },
      { label: "Protein", value: "2 g" },
      { label: "Fat", value: "0.1 g" },
      { label: "Fiber", value: "2.2 g" },
      { label: "Vitamin C", value: "19%" },
    ],
    storage: "Store in a cool, dark, well-ventilated place. Keep away from onions to prevent sprouting.",
    manufacturer: "Fresh Mart Farms Pvt. Ltd.",
    countryOfOrigin: "India",
  },
  "p-007": {
    brand: "Fresh Mart Premium",
    description: "Crisp, juicy apples imported from the finest orchards in Kashmir. These premium apples are rich in flavor and packed with nutrients. Perfect for snacking, desserts, and healthy eating.",
    rating: 4.7,
    reviewsCount: 210,
    stockStatus: "in_stock",
    stockCount: 120,
    images: ["from-red-300 via-red-400 to-rose-300", "from-red-200 via-rose-300 to-pink-200", "from-red-100 via-red-300 to-rose-200"],
    ingredients: ["Apple"],
    nutritionalInfo: [
      { label: "Calories", value: "52 kcal" },
      { label: "Carbohydrates", value: "14 g" },
      { label: "Protein", value: "0.3 g" },
      { label: "Fat", value: "0.2 g" },
      { label: "Fiber", value: "2.4 g" },
      { label: "Vitamin C", value: "14%" },
    ],
    storage: "Refrigerate for longer freshness. Store at room temperature if consuming within 3 days.",
    manufacturer: "Fresh Mart Imports Pvt. Ltd.",
    countryOfOrigin: "India",
  },
  "p-013": {
    brand: "Fresh Mart Dairy",
    description: "Pure, fresh full cream milk sourced from grass-fed cows. Pasteurized and packed under hygienic conditions to retain natural goodness and creamy texture. Rich in calcium and vitamin D.",
    rating: 4.8,
    reviewsCount: 345,
    stockStatus: "in_stock",
    stockCount: 400,
    images: ["from-blue-200 via-blue-300 to-sky-200", "from-white via-blue-200 to-cyan-100", "from-blue-100 via-sky-200 to-cyan-100"],
    ingredients: ["Pure Full Cream Milk", "Vitamin D"],
    nutritionalInfo: [
      { label: "Calories", value: "128 kcal" },
      { label: "Carbohydrates", value: "10 g" },
      { label: "Protein", value: "8 g" },
      { label: "Fat", value: "8 g" },
      { label: "Calcium", value: "30%" },
      { label: "Vitamin D", value: "15%" },
    ],
    storage: "Keep refrigerated at 4°C. Consume within 3 days of opening.",
    manufacturer: "Fresh Mart Dairy Pvt. Ltd.",
    countryOfOrigin: "India",
  },
  "p-026": {
    brand: "Fresh Mart Premium",
    description: "A premium blend of almonds, cashews, pistachios, walnuts, and raisins. Carefully selected and roasted to perfection for a healthy and delicious snacking experience.",
    rating: 4.6,
    reviewsCount: 178,
    stockStatus: "in_stock",
    stockCount: 85,
    images: ["from-amber-200 via-amber-300 to-brown-200", "from-yellow-200 via-amber-300 to-brown-100", "from-orange-100 via-amber-200 to-brown-200"],
    ingredients: ["Almonds", "Cashews", "Pistachios", "Walnuts", "Raisins"],
    nutritionalInfo: [
      { label: "Calories", value: "180 kcal" },
      { label: "Carbohydrates", value: "8 g" },
      { label: "Protein", value: "6 g" },
      { label: "Fat", value: "15 g" },
      { label: "Fiber", value: "3 g" },
      { label: "Magnesium", value: "20%" },
    ],
    storage: "Store in an airtight container in a cool, dry place. Avoid direct sunlight.",
    manufacturer: "Fresh Mart Premium Foods Pvt. Ltd.",
    countryOfOrigin: "India",
  },
  "p-031": {
    brand: "Fresh Mart Beverages",
    description: "Refreshing orange juice made from freshly squeezed oranges. No added sugar, no preservatives, and no artificial flavors. A natural source of vitamin C for your daily nutrition.",
    rating: 4.4,
    reviewsCount: 92,
    stockStatus: "in_stock",
    stockCount: 60,
    images: ["from-orange-200 via-orange-300 to-amber-200", "from-yellow-200 via-orange-300 to-amber-100", "from-orange-100 via-amber-200 to-yellow-100"],
    ingredients: ["Fresh Orange Juice", "Citric Acid"],
    nutritionalInfo: [
      { label: "Calories", value: "45 kcal" },
      { label: "Carbohydrates", value: "10 g" },
      { label: "Sugar", value: "9 g" },
      { label: "Protein", value: "0.7 g" },
      { label: "Vitamin C", value: "70%" },
      { label: "Potassium", value: "10%" },
    ],
    storage: "Refrigerate after opening. Consume within 24 hours of opening.",
    manufacturer: "Fresh Mart Beverages Pvt. Ltd.",
    countryOfOrigin: "India",
  },
  "p-037": {
    brand: "Fresh Mart Frozen",
    description: "Creamy vanilla ice cream made with real dairy cream and Madagascar vanilla extract. A timeless classic dessert that everyone loves. Perfect on its own or with your favorite toppings.",
    rating: 4.6,
    reviewsCount: 256,
    stockStatus: "in_stock",
    stockCount: 45,
    images: ["from-white via-blue-100 to-cyan-50", "from-cream-100 via-white to-blue-50", "from-white via-yellow-50 to-amber-50"],
    ingredients: ["Milk", "Cream", "Sugar", "Vanilla Extract", "Egg Yolks", "Stabilizers"],
    nutritionalInfo: [
      { label: "Calories", value: "207 kcal" },
      { label: "Carbohydrates", value: "24 g" },
      { label: "Sugar", value: "21 g" },
      { label: "Protein", value: "4 g" },
      { label: "Fat", value: "11 g" },
      { label: "Calcium", value: "10%" },
    ],
    storage: "Keep frozen at -18°C. Do not refreeze after thawing.",
    manufacturer: "Fresh Mart Frozen Foods Pvt. Ltd.",
    countryOfOrigin: "India",
  },
};

function hashMod(id: string, max: number): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash) + id.charCodeAt(i);
    hash |= 0;
  }
  return ((hash % max) + max) % max;
}

function generateDetail(product: Product): RawDetail {
  const categoryGradients: Record<string, string[]> = {
    vegetables: ["from-green-100 via-green-200 to-emerald-100", "from-lime-100 via-green-200 to-teal-100", "from-emerald-100 via-green-200 to-lime-100"],
    fruits: ["from-red-100 via-red-200 to-rose-100", "from-orange-100 via-amber-200 to-yellow-100", "from-purple-100 via-pink-200 to-rose-100"],
    dairy: ["from-blue-100 via-blue-200 to-sky-100", "from-cyan-100 via-blue-200 to-indigo-100", "from-white via-blue-100 to-sky-100"],
    bakery: ["from-amber-100 via-amber-200 to-yellow-100", "from-orange-100 via-amber-200 to-yellow-100", "from-yellow-50 via-amber-100 to-orange-50"],
    snacks: ["from-red-100 via-red-200 to-amber-100", "from-orange-100 via-amber-200 to-yellow-100", "from-yellow-100 via-amber-200 to-red-100"],
    beverages: ["from-blue-100 via-blue-200 to-cyan-100", "from-green-100 via-teal-200 to-cyan-100", "from-orange-100 via-amber-200 to-yellow-100"],
    frozen: ["from-cyan-100 via-blue-200 to-indigo-100", "from-white via-blue-50 to-cyan-100", "from-blue-100 via-sky-200 to-cyan-100"],
    household: ["from-gray-100 via-gray-200 to-slate-100", "from-stone-100 via-gray-200 to-zinc-100", "from-gray-50 via-gray-100 to-slate-200"],
  };

  const cats: Record<string, string> = {
    vegetables: "Vegetables", fruits: "Fruits", dairy: "Dairy", bakery: "Bakery",
    snacks: "Snacks", beverages: "Beverages", frozen: "Frozen", household: "Household",
  };

  const h = hashMod(product.id, 200);
  const images = categoryGradients[product.categoryId] ?? categoryGradients.vegetables;

  return {
    brand: `Fresh Mart ${cats[product.categoryId] ?? "Store"}`,
    description: `Fresh and high-quality ${product.name.toLowerCase()} sourced directly from trusted suppliers. Carefully packed and delivered to your doorstep with guaranteed freshness.`,
    rating: Number((4.0 + (h % 9) / 10).toFixed(1)),
    reviewsCount: 20 + (h % 200),
    stockStatus: "in_stock" as StockStatus,
    stockCount: 50 + (h % 300),
    images,
    ingredients: [product.name],
    nutritionalInfo: [
      { label: "Calories", value: `${20 + (h % 180)} kcal` },
      { label: "Carbohydrates", value: `${2 + (h % 18)} g` },
      { label: "Protein", value: `${(0.5 + (h % 5)).toFixed(1)} g` },
      { label: "Fat", value: `${(0.1 + (h % 10)).toFixed(1)} g` },
      { label: "Fiber", value: `${(0.5 + (h % 3)).toFixed(1)} g` },
    ],
    storage: "Store in a cool, dry place away from direct sunlight. Refrigerate after opening if applicable.",
    manufacturer: "Fresh Mart Foods Pvt. Ltd.",
    countryOfOrigin: "India",
  };
}

export function getProductDetail(productId: string): ProductDetail | null {
  const product = products.find((p) => p.id === productId);
  if (!product) return null;

  const raw = rawDetails[productId] ?? generateDetail(product);

  const sameCategory = products
    .filter((p) => p.id !== productId && p.categoryId === product.categoryId)
    .slice(0, 8)
    .map((p) => p.id);

  const otherCategory = products
    .filter((p) => p.id !== productId && p.categoryId !== product.categoryId)
    .slice(0, 8)
    .map((p) => p.id);

  return {
    id: productId,
    ...raw,
    similarProductIds: sameCategory.length >= 8 ? sameCategory : [...sameCategory, ...otherCategory].slice(0, 8),
    boughtTogetherIds: otherCategory.slice(0, 4),
  };
}
