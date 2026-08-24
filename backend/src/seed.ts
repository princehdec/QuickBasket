import { and, eq } from "drizzle-orm";
import { db, queryClient } from "./shared/config/database";
import {
  businesses,
  categories,
  products,
  serviceZones,
} from "./shared/schema";

type SeedBusiness = {
  slug: string;
  name: string;
  description: string;
  businessType:
    | "GROCERY"
    | "FOOD"
    | "PHARMACY"
    | "ELECTRONICS"
    | "FASHION"
    | "STATIONERY"
    | "LAUNDRY"
    | "OTHER";
  city: string;
  state: string;
  address: string;
  latitude: string;
  longitude: string;
  tags: string[];
  categories: Array<{
    slug: string;
    name: string;
    description: string;
    products: Array<{
      slug: string;
      name: string;
      description: string;
      unit: string;
      brand: string;
      price: string;
      originalPrice: string;
      stock: number;
      requiresPrescription?: boolean;
      isVeg?: boolean;
      attributes?: Record<string, string | number | boolean>;
    }>;
  }>;
};

const serviceZoneSeeds = [
  {
    cityName: "Lucknow",
    stateName: "Uttar Pradesh",
    name: "Lucknow Central Pilot",
    radiusKm: "5",
    deliveryFeeRules: { baseFee: 25, bands: [{ upToKm: 5, fee: 25 }] },
  },
  {
    cityName: "Lucknow",
    stateName: "Uttar Pradesh",
    name: "Lucknow Gomti Nagar Pilot",
    radiusKm: "5",
    deliveryFeeRules: { baseFee: 30, bands: [{ upToKm: 5, fee: 30 }] },
  },
  {
    cityName: "Gopalganj",
    stateName: "Bihar",
    name: "Gopalganj Central Pilot",
    radiusKm: "5",
    deliveryFeeRules: { baseFee: 20, bands: [{ upToKm: 5, fee: 20 }] },
  },
  {
    cityName: "Gopalganj",
    stateName: "Bihar",
    name: "Gopalganj North Pilot",
    radiusKm: "5",
    deliveryFeeRules: { baseFee: 25, bands: [{ upToKm: 5, fee: 25 }] },
  },
] as const;

const businessSeeds: SeedBusiness[] = [
  {
    slug: "lko-apna-general-store",
    name: "Apna General Store",
    description: "Daily groceries, household essentials, and packaged foods.",
    businessType: "GROCERY",
    city: "Lucknow",
    state: "Uttar Pradesh",
    address: "Hazratganj, Lucknow",
    latitude: "26.8500",
    longitude: "80.9490",
    tags: ["grocery", "daily essentials", "nearby"],
    categories: [
      {
        slug: "staples",
        name: "Staples",
        description: "Rice, flour, pulses, and everyday pantry items.",
        products: [
          {
            slug: "basmati-rice-5kg",
            name: "Basmati Rice",
            description: "Long-grain basmati rice for everyday meals.",
            unit: "5 kg",
            brand: "Fortune",
            price: "499.00",
            originalPrice: "549.00",
            stock: 40,
            attributes: { vegetarian: true, weightKg: 5 },
          },
          {
            slug: "wheat-flour-5kg",
            name: "Whole Wheat Flour",
            description: "Fresh chakki-style whole wheat flour.",
            unit: "5 kg",
            brand: "Aashirvaad",
            price: "289.00",
            originalPrice: "310.00",
            stock: 35,
            attributes: { vegetarian: true, weightKg: 5 },
          },
        ],
      },
      {
        slug: "household-essentials",
        name: "Household Essentials",
        description: "Cleaning and home-care products.",
        products: [
          {
            slug: "dishwash-liquid-500ml",
            name: "Dishwash Liquid",
            description: "Lemon dishwashing liquid for everyday cleaning.",
            unit: "500 ml",
            brand: "Vim",
            price: "115.00",
            originalPrice: "130.00",
            stock: 60,
            attributes: { vegetarian: true },
          },
        ],
      },
    ],
  },
  {
    slug: "lko-careplus-pharmacy",
    name: "CarePlus Pharmacy",
    description: "OTC wellness products and prescription medicines from a verified pharmacy.",
    businessType: "PHARMACY",
    city: "Lucknow",
    state: "Uttar Pradesh",
    address: "Gomti Nagar, Lucknow",
    latitude: "26.8467",
    longitude: "81.0080",
    tags: ["pharmacy", "otc", "prescription"],
    categories: [
      {
        slug: "otc-wellness",
        name: "OTC Wellness",
        description: "Over-the-counter wellness and first-aid products.",
        products: [
          {
            slug: "paracetamol-500mg-10",
            name: "Paracetamol 500 mg",
            description: "Over-the-counter fever and pain relief tablets.",
            unit: "10 tablets",
            brand: "Crocin",
            price: "25.00",
            originalPrice: "28.00",
            stock: 100,
            attributes: { schedule: "OTC" },
          },
          {
            slug: "digital-thermometer",
            name: "Digital Thermometer",
            description: "Fast-read digital thermometer.",
            unit: "1 piece",
            brand: "Dr Trust",
            price: "199.00",
            originalPrice: "249.00",
            stock: 20,
            attributes: { warrantyMonths: 12 },
          },
        ],
      },
      {
        slug: "prescription-medicines",
        name: "Prescription Medicines",
        description: "Restricted medicines available only after pharmacist review.",
        products: [
          {
            slug: "amoxicillin-500mg-10",
            name: "Amoxicillin 500 mg",
            description: "Prescription-only medicine. Upload a valid prescription for review.",
            unit: "10 capsules",
            brand: "Mox",
            price: "85.00",
            originalPrice: "95.00",
            stock: 30,
            requiresPrescription: true,
            attributes: { schedule: "Prescription" },
          },
        ],
      },
    ],
  },
  {
    slug: "lko-techpoint-electronics",
    name: "TechPoint Electronics",
    description: "Everyday electronics, accessories, and small appliances.",
    businessType: "ELECTRONICS",
    city: "Lucknow",
    state: "Uttar Pradesh",
    address: "Aliganj, Lucknow",
    latitude: "26.8900",
    longitude: "80.9460",
    tags: ["electronics", "accessories", "gadgets"],
    categories: [
      {
        slug: "mobile-accessories",
        name: "Mobile Accessories",
        description: "Chargers, cables, and everyday accessories.",
        products: [
          {
            slug: "usb-c-fast-charger",
            name: "USB-C Fast Charger",
            description: "20W USB-C wall charger.",
            unit: "1 piece",
            brand: "boAt",
            price: "699.00",
            originalPrice: "899.00",
            stock: 18,
            attributes: { wattage: 20, warrantyMonths: 6 },
          },
        ],
      },
    ],
  },
  {
    slug: "lko-papertrail-stationery",
    name: "PaperTrail Stationery",
    description: "School, office, and art supplies for nearby homes and businesses.",
    businessType: "STATIONERY",
    city: "Lucknow",
    state: "Uttar Pradesh",
    address: "Indira Nagar, Lucknow",
    latitude: "26.8750",
    longitude: "81.0000",
    tags: ["stationery", "school", "office"],
    categories: [
      {
        slug: "school-office",
        name: "School and Office",
        description: "Notebooks, pens, and desk essentials.",
        products: [
          {
            slug: "a5-notebook-200-pages",
            name: "A5 Notebook",
            description: "Ruled notebook for school or office use.",
            unit: "200 pages",
            brand: "Classmate",
            price: "75.00",
            originalPrice: "85.00",
            stock: 80,
            attributes: { pages: 200 },
          },
        ],
      },
    ],
  },
  {
    slug: "lko-freshcrumbs-bakery",
    name: "FreshCrumbs Bakery",
    description: "Fresh breads, cakes, and baked snacks made locally.",
    businessType: "FOOD",
    city: "Lucknow",
    state: "Uttar Pradesh",
    address: "Mahanagar, Lucknow",
    latitude: "26.8755",
    longitude: "80.9600",
    tags: ["bakery", "fresh", "snacks"],
    categories: [
      {
        slug: "breads-and-snacks",
        name: "Breads and Snacks",
        description: "Freshly baked breads and snacks.",
        products: [
          {
            slug: "milk-bread-400g",
            name: "Milk Bread",
            description: "Soft fresh milk bread.",
            unit: "400 g",
            brand: "FreshCrumbs",
            price: "45.00",
            originalPrice: "50.00",
            stock: 25,
            isVeg: true,
            attributes: { vegetarian: true },
          },
        ],
      },
    ],
  },
  {
    slug: "gkp-shivam-daily-mart",
    name: "Shivam Daily Mart",
    description: "A neighbourhood mini-mart for groceries and household needs.",
    businessType: "GROCERY",
    city: "Gopalganj",
    state: "Bihar",
    address: "Thawe Road, Gopalganj",
    latitude: "26.4700",
    longitude: "84.4400",
    tags: ["grocery", "mini mart", "daily essentials"],
    categories: [
      {
        slug: "snacks-and-beverages",
        name: "Snacks and Beverages",
        description: "Quick snacks and beverages.",
        products: [
          {
            slug: "tea-250g",
            name: "Strong Tea",
            description: "Everyday black tea leaves.",
            unit: "250 g",
            brand: "Tata Tea",
            price: "125.00",
            originalPrice: "140.00",
            stock: 50,
            attributes: { vegetarian: true },
          },
        ],
      },
    ],
  },
  {
    slug: "gkp-sanjeevani-medical",
    name: "Sanjeevani Medical Hall",
    description: "OTC healthcare and pharmacist-reviewed prescription fulfilment.",
    businessType: "PHARMACY",
    city: "Gopalganj",
    state: "Bihar",
    address: "Main Road, Gopalganj",
    latitude: "26.4850",
    longitude: "84.4450",
    tags: ["pharmacy", "otc", "prescription"],
    categories: [
      {
        slug: "health-and-first-aid",
        name: "Health and First Aid",
        description: "Common OTC healthcare essentials.",
        products: [
          {
            slug: "oral-rehydration-salts",
            name: "Oral Rehydration Salts",
            description: "Electrolyte powder for oral rehydration.",
            unit: "1 sachet",
            brand: "Electral",
            price: "22.00",
            originalPrice: "25.00",
            stock: 75,
            attributes: { schedule: "OTC" },
          },
        ],
      },
    ],
  },
  {
    slug: "gkp-radha-vastra",
    name: "Radha Vastra and Garments",
    description: "Everyday clothing and local garments for the family.",
    businessType: "FASHION",
    city: "Gopalganj",
    state: "Bihar",
    address: "Station Road, Gopalganj",
    latitude: "26.4820",
    longitude: "84.4350",
    tags: ["fashion", "garments", "clothing"],
    categories: [
      {
        slug: "everyday-clothing",
        name: "Everyday Clothing",
        description: "Comfortable clothing for daily wear.",
        products: [
          {
            slug: "cotton-kurta-blue",
            name: "Cotton Kurta",
            description: "Comfortable cotton kurta for everyday wear.",
            unit: "1 piece",
            brand: "Radha Vastra",
            price: "499.00",
            originalPrice: "599.00",
            stock: 12,
            attributes: { size: "M", color: "Blue" },
          },
        ],
      },
    ],
  },
  {
    slug: "gkp-cleanpress-laundry",
    name: "CleanPress Laundry",
    description: "Neighbourhood dry-cleaning and laundry pickup service.",
    businessType: "LAUNDRY",
    city: "Gopalganj",
    state: "Bihar",
    address: "Hospital Road, Gopalganj",
    latitude: "26.4760",
    longitude: "84.4300",
    tags: ["laundry", "dry cleaning", "pickup"],
    categories: [
      {
        slug: "laundry-services",
        name: "Laundry Services",
        description: "Pickup and drop laundry services.",
        products: [
          {
            slug: "shirt-dry-cleaning",
            name: "Shirt Dry Cleaning",
            description: "Professional dry cleaning for one shirt.",
            unit: "1 shirt",
            brand: "CleanPress",
            price: "90.00",
            originalPrice: "100.00",
            stock: 999,
            attributes: { turnaroundHours: 48 },
          },
        ],
      },
    ],
  },
];

async function findOrCreateZone(seed: (typeof serviceZoneSeeds)[number]) {
  const existing = await db
    .select({ id: serviceZones.id })
    .from(serviceZones)
    .where(
      and(
        eq(serviceZones.cityName, seed.cityName),
        eq(serviceZones.stateName, seed.stateName),
        eq(serviceZones.name, seed.name),
      ),
    )
    .limit(1);

  if (existing[0]) return existing[0].id;

  const [created] = await db
    .insert(serviceZones)
    .values(seed)
    .returning({ id: serviceZones.id });

  if (!created) {
    throw new Error("Seed insert did not return an id");
  }
  return created.id;
}

async function findOrCreateBusiness(seed: SeedBusiness) {
  const existing = await db
    .select({ id: businesses.id })
    .from(businesses)
    .where(eq(businesses.slug, seed.slug))
    .limit(1);

  if (existing[0]) return existing[0].id;

  const [created] = await db
    .insert(businesses)
    .values({
      slug: seed.slug,
      name: seed.name,
      description: seed.description,
      businessType: seed.businessType,
      city: seed.city,
      address: seed.address,
      latitude: seed.latitude,
      longitude: seed.longitude,
      tags: seed.tags,
      isActive: true,
    })
    .returning({ id: businesses.id });

  if (!created) {
    throw new Error("Seed insert did not return an id");
  }
  return created.id;
}

async function findOrCreateCategory(
  businessId: string,
  seed: SeedBusiness["categories"][number],
) {
  const existing = await db
    .select({ id: categories.id })
    .from(categories)
    .where(
      and(eq(categories.businessId, businessId), eq(categories.slug, seed.slug)),
    )
    .limit(1);

  if (existing[0]) return existing[0].id;

  const [created] = await db
    .insert(categories)
    .values({
      businessId,
      slug: seed.slug,
      name: seed.name,
      description: seed.description,
      isActive: true,
    })
    .returning({ id: categories.id });

  if (!created) {
    throw new Error("Seed insert did not return an id");
  }
  return created.id;
}

async function findOrCreateProduct(
  businessId: string,
  categoryId: string,
  seed: SeedBusiness["categories"][number]["products"][number],
) {
  const existing = await db
    .select({ id: products.id })
    .from(products)
    .where(
      and(eq(products.businessId, businessId), eq(products.slug, seed.slug)),
    )
    .limit(1);

  if (existing[0]) return existing[0].id;

  const [created] = await db
    .insert(products)
    .values({
      businessId,
      categoryId,
      slug: seed.slug,
      name: seed.name,
      description: seed.description,
      unit: seed.unit,
      brand: seed.brand,
      price: seed.price,
      originalPrice: seed.originalPrice,
      images: [],
      attributes: seed.attributes ?? {},
      requiresPrescription: seed.requiresPrescription ?? false,
      isVeg: seed.isVeg ?? true,
      isBestseller: true,
      stock: seed.stock,
      isActive: true,
    })
    .returning({ id: products.id });

  if (!created) {
    throw new Error("Seed insert did not return an id");
  }
  return created.id;
}

async function seed() {
  const zoneIds = new Set<string>();
  for (const zone of serviceZoneSeeds) {
    zoneIds.add(await findOrCreateZone(zone));
  }

  let businessCount = 0;
  let categoryCount = 0;
  let productCount = 0;

  for (const business of businessSeeds) {
    const businessId = await findOrCreateBusiness(business);
    businessCount += 1;

    for (const category of business.categories) {
      const categoryId = await findOrCreateCategory(businessId, category);
      categoryCount += 1;

      for (const product of category.products) {
        await findOrCreateProduct(businessId, categoryId, product);
        productCount += 1;
      }
    }
  }

  console.info(
    `[Seed] ready: ${zoneIds.size} service zones, ${businessCount} businesses, ${categoryCount} categories, ${productCount} products`,
  );
}

seed()
  .catch((error) => {
    console.error("[Seed] failed", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await queryClient.end({ timeout: 5 });
  });
