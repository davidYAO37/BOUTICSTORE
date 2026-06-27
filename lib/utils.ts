import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(price: number, currency: string = "FCFA"): string {
  return new Intl.NumberFormat("fr-FR").format(price) + " " + currency;
}

export function formatCompactPrice(price: number, currency: string = "FCFA"): string {
  return new Intl.NumberFormat("fr-FR", { notation: "compact" }).format(price) + " " + currency;
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

export function getAvailabilityLabel(availability: string): string {
  const labels: Record<string, string> = {
    in_stock: "En stock",
    out_of_stock: "Rupture de stock",
    pre_order: "Précommande",
    coming_soon: "Bientôt disponible",
  };
  return labels[availability] || availability;
}

export function getAvailabilityColor(availability: string): string {
  const colors: Record<string, string> = {
    in_stock: "success",
    out_of_stock: "danger",
    pre_order: "warning",
    coming_soon: "info",
  };
  return colors[availability] || "secondary";
}

export function debounce<T extends (...args: unknown[]) => unknown>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function getEstimatedTime(distanceKm: number, speedKmH: number = 40): number {
  return Math.ceil(distanceKm / speedKmH * 60);
}

export function shareUrl(platform: "whatsapp" | "facebook" | "twitter" | "email", url: string, title: string): string {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  switch (platform) {
    case "whatsapp":
      return `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case "twitter":
      return `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
    case "email":
      return `mailto:?subject=${encodedTitle}&body=${encodedUrl}`;
    default:
      return url;
  }
}

export function generateReference(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `MOTO-${year}${month}${day}-${random}`;
}

export function calculateFinancing(price: number, months: number, downPaymentPercent: number = 0, interestRate: number = 0): {
  months: number;
  downPayment: number;
  financedAmount: number;
  monthlyPayment: number;
  total: number;
  interestRate: number;
} {
  const downPayment = Math.round(price * (downPaymentPercent / 100));
  const financedAmount = price - downPayment;
  const totalInterest = financedAmount * (interestRate / 100) * (months / 12);
  const total = financedAmount + totalInterest;
  const monthlyPayment = Math.round(total / months);
  return {
    months,
    downPayment,
    financedAmount,
    monthlyPayment,
    total,
    interestRate,
  };
}

export function getAverageRating(reviews: { rating: number }[]): number {
  if (!reviews.length) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}
