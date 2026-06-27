export const dynamic = "force-dynamic";

import { Metadata } from "next";
import HeroSlider from "@/components/home/HeroSlider";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedSection from "@/components/home/FeaturedSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import PartnersSection from "@/components/home/PartnersSection";
import ReviewsSection from "@/components/home/ReviewsSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import connectToDatabase from "@/lib/mongodb";
import { Motorcycle, Category } from "@/models";

export const metadata: Metadata = {
  title: "Accueil",
  description: "Ivoire Motos - Votre concessionnaire de motos premium en Côte d'Ivoire. Découvrez notre large choix de motos, tricycles, pièces détachées et services.",
};

const sampleCategories = [
  { _id: "1", slug: "moto", name: { fr: "Motos", en: "Motorcycles" }, image: "", icon: "🏍️" },
  { _id: "2", slug: "tricycle", name: { fr: "Tricycles", en: "Tricycles" }, image: "", icon: "🛺" },
  { _id: "3", slug: "piece", name: { fr: "Pièces", en: "Parts" }, image: "", icon: "🔧" },
  { _id: "4", slug: "accessoire", name: { fr: "Accessoires", en: "Accessories" }, image: "", icon: "🪖" },
  { _id: "5", slug: "equipement", name: { fr: "Équipements", en: "Equipment" }, image: "", icon: "🧤" },
  { _id: "6", slug: "service", name: { fr: "Services", en: "Services" }, image: "", icon: "🔩" },
];


async function fetchHomeData() {
  try {
    await connectToDatabase();
    const [categories, popular, newArrivals, promotions] = await Promise.all([
      Category.find({ isActive: true }).limit(20).lean(),
      Motorcycle.find({ isActive: true, isPopular: true }).populate("brand", "name slug").populate("category", "name slug").limit(8).lean(),
      Motorcycle.find({ isActive: true, isNew: true }).populate("brand", "name slug").populate("category", "name slug").limit(8).lean(),
      Motorcycle.find({ isActive: true, isPromotion: true }).populate("brand", "name slug").populate("category", "name slug").limit(8).lean(),
    ]);

    return {
      categories: categories.length ? JSON.parse(JSON.stringify(categories)) : sampleCategories,
      popular: JSON.parse(JSON.stringify(popular)),
      newArrivals: JSON.parse(JSON.stringify(newArrivals)),
      promotions: JSON.parse(JSON.stringify(promotions)),
    };
  } catch (error) {
    console.error("Erreur de chargement des données d'accueil:", error);
    return { categories: sampleCategories, popular: [], newArrivals: [], promotions: [] };
  }
}

export default async function HomePage() {
  const { categories, popular, newArrivals, promotions } = await fetchHomeData();

  return (
    <>
      <HeroSlider />
      <CategoriesSection categories={categories} />
      <FeaturedSection
        title="Motos populaires"
        subtitle="Les modèles les plus appréciés de nos clients"
        motos={popular}
        linkHref="/catalog/?sort=popularity"
        linkLabel="Voir tout"
      />
      <FeaturedSection
        title="Dernières nouveautés"
        subtitle="Découvrez les nouveaux modèles disponibles"
        motos={newArrivals}
        linkHref="/catalog/?isNew=true"
        linkLabel="Voir tout"
        dark
      />
      <WhyChooseUs />
      <FeaturedSection
        title="Produits en promotion"
        subtitle="Profitez de nos meilleures offres du moment"
        motos={promotions}
        linkHref="/promotions/"
        linkLabel="Toutes les promotions"
      />
      <PartnersSection />
      <ReviewsSection />
      <NewsletterSection />
    </>
  );
}

