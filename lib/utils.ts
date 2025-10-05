import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 50 to $50.00
// 54.5 to $54.50
export function formatPrice(price: number | string) {
  if (typeof price === "string") {
    price = parseFloat(price);
  }
  return `$${price.toFixed(2)}`;
}
