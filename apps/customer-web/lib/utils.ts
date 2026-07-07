type ClassValue = string | number | boolean | undefined | null | ClassValue[] | Record<string, boolean | undefined | null>;

function clsx(...inputs: ClassValue[]): string {
  const classes: string[] = [];
  
  for (const input of inputs) {
    if (!input) continue;
    
    if (typeof input === "string" || typeof input === "number") {
      classes.push(String(input));
    } else if (Array.isArray(input)) {
      classes.push(clsx(...input));
    } else if (typeof input === "object") {
      for (const [key, value] of Object.entries(input)) {
        if (value) classes.push(key);
      }
    }
  }
  
  return classes.join(" ");
}

function twMerge(classes: string): string {
  // Simple tailwind merge - handles common conflicts
  const classList = classes.split(" ").filter(Boolean);
  const seen = new Map<string, string>();
  
  for (const cls of classList) {
    // Handle responsive prefixes
    const match = cls.match(/^((?:sm|md|lg|xl|2xl):)?(.+)$/);
    if (!match) continue;
    
    const [, prefix, utility] = match;
    const key = prefix ? `${prefix}:${utility.split("-")[0]}` : utility.split("-")[0];
    
    // Keep last occurrence
    seen.set(key, cls);
  }
  
  return Array.from(seen.values()).join(" ");
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}