export const APP_NAME = "Ivoire Motos";
export const APP_TAGLINE = "Votre concessionnaire de motos premium en Côte d'Ivoire";
export const DEFAULT_LOCALE = "fr";
export const SUPPORTED_LOCALES = ["fr", "en"] as const;

export const NAV_LINKS: Array<{ href: string; label: { fr: string; en: string }; query?: Record<string, string> }> = [
  { href: "/", label: { fr: "Accueil", en: "Home" } },
  { href: "/catalog/", label: { fr: "Motos", en: "Motorcycles" }, query: { type: "moto" } },
  { href: "/catalog/", label: { fr: "Tricycles", en: "Tricycles" }, query: { type: "tricycle" } },
  { href: "/catalog/", label: { fr: "Pièces", en: "Parts" }, query: { type: "piece" } },
  { href: "/services/", label: { fr: "Services", en: "Services" } },
  { href: "/promotions/", label: { fr: "Promotions", en: "Promotions" } },
  { href: "/about/", label: { fr: "À propos", en: "About" } },
  { href: "/contact/", label: { fr: "Contact", en: "Contact" } },
];

export const CONTACT = {
  phone: "+225 05 85 94 10 43",
  whatsapp: "2250585941043",
  email: "ivoiremotos2025@gmail.com",
  address: "Abidjan, Côte d'Ivoire",
  hours: "Lun - Sam : 08h00 - 18h00",
};

export const SOCIAL_LINKS = {
  facebook: "https://facebook.com/motosboutic",
  twitter: "https://twitter.com/motosboutic",
  instagram: "https://instagram.com/motosboutic",
  youtube: "https://youtube.com/motosboutic",
  linkedin: "https://linkedin.com/company/motosboutic",
};

export const DEFAULT_STORE_COORDINATES = {
  lat: 5.3488876,
  lng: -4.1048586,
};

export const GOOGLE_MAPS_URL = "https://www.google.com/maps/place/5%C2%B020'56.0%22N+4%C2%B006'17.5%22W/@5.3488876,-4.1074335,826m/data=!3m2!1e3!4b1!4m4!3m3!8m2!3d5.3488876!4d-4.1048586?hl=fr&entry=ttu&g_ep=EgoyMDI2MDYyNC4wIKXMDSoASAFQAw%3D%3D";

export const FINANCING_OPTIONS = [
  { months: 12, downPaymentPercent: 30, interestRate: 0 },
  { months: 24, downPaymentPercent: 30, interestRate: 5 },
  { months: 36, downPaymentPercent: 30, interestRate: 7 },
];

export const TRANSMISSION_OPTIONS = ["Manuelle", "Automatique", "Semi-automatique", "CVT"];

export const DISPLACEMENT_RANGES = [
  { label: "Moins de 125 cm³", min: 0, max: 125 },
  { label: "125 - 250 cm³", min: 125, max: 250 },
  { label: "250 - 500 cm³", min: 250, max: 500 },
  { label: "Plus de 500 cm³", min: 500, max: 99999 },
];

export const PRICE_RANGES = [
  { label: "Moins de 500 000 FCFA", min: 0, max: 500000 },
  { label: "500 000 - 1 000 000 FCFA", min: 500000, max: 1000000 },
  { label: "1 000 000 - 2 000 000 FCFA", min: 1000000, max: 2000000 },
  { label: "Plus de 2 000 000 FCFA", min: 2000000, max: 999999999 },
];

export const YEARS = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
