import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, Row, Col } from "react-bootstrap";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductTabs from "@/components/product/ProductTabs";
import StoreMap from "@/components/product/StoreMap";
import SimilarProducts from "@/components/product/SimilarProducts";
import connectToDatabase from "@/lib/mongodb";
import { Motorcycle, Store } from "@/models";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

async function fetchProductData(slug: string) {
  try {
    await connectToDatabase();
    const [moto, stores] = await Promise.all([
      Motorcycle.findOne({ slug, isActive: true })
        .populate("brand", "name slug logo")
        .populate("category", "name slug")
        .lean(),
      Store.find({ isActive: true }).lean(),
    ]);
    return {
      moto: moto ? JSON.parse(JSON.stringify(moto)) : null,
      stores: JSON.parse(JSON.stringify(stores)),
    };
  } catch (error) {
    console.error("Erreur produit:", error);
    return { moto: null, stores: [] };
  }
}

async function fetchSimilarMotos(currentSlug: string) {
  try {
    await connectToDatabase();
    const results = await Motorcycle.find({ isActive: true, slug: { $ne: currentSlug } })
      .populate("brand", "name slug")
      .populate("category", "name slug")
      .limit(8)
      .lean();
    return JSON.parse(JSON.stringify(results));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { moto } = await fetchProductData(slug);
  if (!moto) return { title: "Produit non trouvé" };
  return {
    title: moto.metaTitle?.fr || moto.name,
    description: moto.metaDescription?.fr || moto.shortDescription?.fr || "",
    openGraph: {
      images: [{ url: moto.thumbnail, width: 1200, height: 630, alt: moto.name }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const { moto, stores } = await fetchProductData(slug);
  if (!moto) notFound();

  const similar = await fetchSimilarMotos(slug);

  const currentUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/motos/${moto.slug}/`;

  return (
    <>
      <Container className="py-4">
        <Row className="g-5">
          <Col lg={7}>
            <ProductGallery images={moto.images || [moto.thumbnail]} productName={moto.name} />
          </Col>
          <Col lg={5}>
            <ProductInfo moto={moto} currentUrl={currentUrl} />
          </Col>
        </Row>
      </Container>

      <Container>
        <ProductTabs
          description={moto.description}
          specifications={moto.specifications || []}
          features={moto.features || []}
          warranty={moto.warranty}
          reviews={[]}
        />
      </Container>

      <StoreMap stores={stores} />

      <SimilarProducts title="Produits similaires" motos={similar} />
    </>
  );
}
