"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/lib/constants";
import { Locale } from "@/types";

type TranslationKey =
  | "search"
  | "searchPlaceholder"
  | "cart"
  | "favorites"
  | "menu"
  | "myAccount"
  | "admin"
  | "login"
  | "darkMode"
  | "lightMode"
  | "call"
  | "close"
  | "home"
  | "motorcycles"
  | "promotions"
  | "services"
  | "about"
  | "contact"
  | "footerDescription"
  | "quickLinks"
  | "customerService"
  | "contactUs"
  | "faq"
  | "shipping"
  | "returns"
  | "warranty"
  | "financing"
  | "privacy"
  | "newsletter"
  | "emailPlaceholder"
  | "allRightsReserved"
  | "terms"
  | "cookies"
  | "addToCart"
  | "buyNow"
  | "requestQuote"
  | "bookTestRide"
  | "compare"
  | "share"
  | "inStock"
  | "outOfStock"
  | "preOrder"
  | "comingSoon"
  | "filterBy"
  | "sortBy"
  | "priceAsc"
  | "priceDesc"
  | "popularity"
  | "newest"
  | "learnMore"
  | "seeMore"
  | "viewDetails"
  | "noResults"
  | "loading"
  | "error"
  | "retry"
  | "save"
  | "cancel"
  | "delete"
  | "edit"
  | "create"
  | "update"
  | "submit"
  | "send"
  | "downloadPDF"
  | "printQuote"
  | "directions"
  | "googleMaps"
  | "distance"
  | "estimatedTime"
  | "nearestStore"
  | "cashPayment"
  | "monthlyPayment"
  | "total"
  | "downPayment"
  | "interestRate"
  | "description"
  | "specifications"
  | "reviews"
  | "delivery"
  | "similarProducts"
  | "recentlyViewed"
  | "whyChooseUs"
  | "partners"
  | "categories"
  | "popularMotorcycles"
  | "latestArrivals"
  | "promotionalProducts"
  | "customerReviews"
  | "readMore"
  | "readLess";

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
}

const translations: Record<Locale, Record<TranslationKey, string>> = {
  fr: {
    search: "Rechercher",
    searchPlaceholder: "Rechercher une moto, une marque...",
    cart: "Panier",
    favorites: "Favoris",
    menu: "Menu",
    myAccount: "Mon compte",
    admin: "Administration",
    login: "Connexion",
    darkMode: "Mode sombre",
    lightMode: "Mode clair",
    call: "Appeler",
    close: "Fermer",
    home: "Accueil",
    motorcycles: "Motos",
    promotions: "Promotions",
    services: "Services",
    about: "À propos",
    contact: "Contact",
    footerDescription: "Votre concessionnaire de motos premium en Côte d'Ivoire. Large choix de motos, tricycles, pièces détachées et services après-vente.",
    quickLinks: "Liens rapides",
    customerService: "Service client",
    contactUs: "Contactez-nous",
    faq: "Questions fréquentes",
    shipping: "Livraison",
    returns: "Retours",
    warranty: "Garantie",
    financing: "Financement",
    privacy: "Politique de confidentialité",
    newsletter: "Newsletter",
    emailPlaceholder: "Votre email",
    allRightsReserved: "Tous droits réservés.",
    terms: "Conditions d'utilisation",
    cookies: "Cookies",
    addToCart: "Ajouter au panier",
    buyNow: "Acheter maintenant",
    requestQuote: "Demander un devis",
    bookTestRide: "Essayer cette moto",
    compare: "Comparer",
    share: "Partager",
    inStock: "En stock",
    outOfStock: "Rupture de stock",
    preOrder: "Précommande",
    comingSoon: "Bientôt disponible",
    filterBy: "Filtrer par",
    sortBy: "Trier par",
    priceAsc: "Prix croissant",
    priceDesc: "Prix décroissant",
    popularity: "Popularité",
    newest: "Nouveautés",
    learnMore: "En savoir plus",
    seeMore: "Voir plus",
    viewDetails: "Voir détails",
    noResults: "Aucun résultat",
    loading: "Chargement...",
    error: "Une erreur est survenue",
    retry: "Réessayer",
    save: "Enregistrer",
    cancel: "Annuler",
    delete: "Supprimer",
    edit: "Modifier",
    create: "Créer",
    update: "Mettre à jour",
    submit: "Soumettre",
    send: "Envoyer",
    downloadPDF: "Télécharger la fiche technique",
    printQuote: "Imprimer le devis",
    directions: "Itinéraire",
    googleMaps: "Google Maps",
    distance: "Distance",
    estimatedTime: "Temps estimé",
    nearestStore: "Magasin le plus proche",
    cashPayment: "Paiement comptant",
    monthlyPayment: "Mensualité",
    total: "Total",
    downPayment: "Apport",
    interestRate: "Taux d'intérêt",
    description: "Description",
    specifications: "Caractéristiques",
    reviews: "Avis clients",
    delivery: "Livraison",
    similarProducts: "Produits similaires",
    recentlyViewed: "Récemment consultés",
    whyChooseUs: "Pourquoi nous choisir",
    partners: "Nos partenaires",
    categories: "Catégories",
    popularMotorcycles: "Motos populaires",
    latestArrivals: "Dernières nouveautés",
    promotionalProducts: "Produits en promotion",
    customerReviews: "Avis clients",
    readMore: "Lire plus",
    readLess: "Lire moins",
  },
  en: {
    search: "Search",
    searchPlaceholder: "Search for a motorcycle, brand...",
    cart: "Cart",
    favorites: "Favorites",
    menu: "Menu",
    myAccount: "My account",
    admin: "Administration",
    login: "Login",
    darkMode: "Dark mode",
    lightMode: "Light mode",
    call: "Call",
    close: "Close",
    home: "Home",
    motorcycles: "Motorcycles",
    promotions: "Promotions",
    services: "Services",
    about: "About",
    contact: "Contact",
    footerDescription: "Your premium motorcycle dealership in Ivory Coast. Wide selection of motorcycles, tricycles, spare parts and after-sales service.",
    quickLinks: "Quick links",
    customerService: "Customer service",
    contactUs: "Contact us",
    faq: "FAQ",
    shipping: "Shipping",
    returns: "Returns",
    warranty: "Warranty",
    financing: "Financing",
    privacy: "Privacy policy",
    newsletter: "Newsletter",
    emailPlaceholder: "Your email",
    allRightsReserved: "All rights reserved.",
    terms: "Terms of use",
    cookies: "Cookies",
    addToCart: "Add to cart",
    buyNow: "Buy now",
    requestQuote: "Request a quote",
    bookTestRide: "Book a test ride",
    compare: "Compare",
    share: "Share",
    inStock: "In stock",
    outOfStock: "Out of stock",
    preOrder: "Pre-order",
    comingSoon: "Coming soon",
    filterBy: "Filter by",
    sortBy: "Sort by",
    priceAsc: "Price ascending",
    priceDesc: "Price descending",
    popularity: "Popularity",
    newest: "Newest",
    learnMore: "Learn more",
    seeMore: "See more",
    viewDetails: "View details",
    noResults: "No results",
    loading: "Loading...",
    error: "An error occurred",
    retry: "Retry",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    create: "Create",
    update: "Update",
    submit: "Submit",
    send: "Send",
    downloadPDF: "Download technical sheet",
    printQuote: "Print quote",
    directions: "Directions",
    googleMaps: "Google Maps",
    distance: "Distance",
    estimatedTime: "Estimated time",
    nearestStore: "Nearest store",
    cashPayment: "Cash payment",
    monthlyPayment: "Monthly payment",
    total: "Total",
    downPayment: "Down payment",
    interestRate: "Interest rate",
    description: "Description",
    specifications: "Specifications",
    reviews: "Customer reviews",
    delivery: "Delivery",
    similarProducts: "Similar products",
    recentlyViewed: "Recently viewed",
    whyChooseUs: "Why choose us",
    partners: "Our partners",
    categories: "Categories",
    popularMotorcycles: "Popular motorcycles",
    latestArrivals: "Latest arrivals",
    promotionalProducts: "Promotional products",
    customerReviews: "Customer reviews",
    readMore: "Read more",
    readLess: "Read less",
  },
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale doit être utilisé dans un LocaleProvider");
  }
  return context;
}

interface LocaleProviderProps {
  children: ReactNode;
}

export function LocaleProvider({ children }: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE as Locale);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLocale = localStorage.getItem("locale") as Locale | null;
    if (savedLocale && SUPPORTED_LOCALES.includes(savedLocale as Locale)) {
      setLocaleState(savedLocale);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
  };

  const t = (key: TranslationKey): string => {
    return translations[locale][key] || translations[DEFAULT_LOCALE as Locale][key] || key;
  };

  if (!mounted) {
    return (
      <LocaleContext.Provider value={{ locale: DEFAULT_LOCALE as Locale, setLocale, t }}>
        {children}
      </LocaleContext.Provider>
    );
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}
