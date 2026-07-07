export type Category = {
  id: string;
  name: string;
  slug: string;
};

export const categories: Category[] = [
  { id: "vegetables", name: "Vegetables", slug: "vegetables" },
  { id: "fruits", name: "Fruits", slug: "fruits" },
  { id: "dairy", name: "Dairy", slug: "dairy" },
  { id: "bakery", name: "Bakery", slug: "bakery" },
  { id: "snacks", name: "Snacks", slug: "snacks" },
  { id: "beverages", name: "Beverages", slug: "beverages" },
  { id: "frozen", name: "Frozen", slug: "frozen" },
  { id: "household", name: "Household", slug: "household" },
];
