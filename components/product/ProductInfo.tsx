"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button, Badge, Form, InputGroup, Row, Col } from "react-bootstrap";
import {
  FaShoppingCart,
  FaBolt,
  FaFileInvoice,
  FaCalendarAlt,
  FaHeart,
  FaBalanceScale,
  FaCheckCircle,
  FaTruck,
  FaShieldAlt,
  FaWhatsapp,
  FaFilePdf,
} from "react-icons/fa";
import { useLocale } from "@/hooks/useLocale";
import { useCart } from "@/hooks/useCart";
import { useFavorites } from "@/hooks/useFavorites";
import { formatPrice, getAvailabilityLabel, getAvailabilityColor } from "@/lib/utils";
import { CONTACT } from "@/lib/constants";
import { generateProductPDF } from "@/lib/pdf-generator";
import ShareButtons from "./ShareButtons";
import FinancingCalculator from "./FinancingCalculator";
import QuoteModal from "./QuoteModal";
import TestRideModal from "./TestRideModal";
import { toast } from "react-toastify";

interface ProductInfoProps {
  moto: {
    _id: string;
    slug: string;
    name: string;
    reference: string;
    price: number;
    oldPrice?: number | null;
    currency: string;
    availability: string;
    stock: number;
    warranty: string;
    color: string[];
    displacement: number;
    year: number;
    transmission: string;
    thumbnail?: string;
    brand?: { name: string; slug: string };
    category?: { name: { fr: string; en: string }; slug: string };
    description?: { fr: string; en: string };
    specifications?: Array<{ label: string; value: string; unit?: string; category?: string }>;
    datasheet?: string;
  };
  currentUrl: string;
}

export default function ProductInfo({ moto, currentUrl }: ProductInfoProps) {
  const { locale } = useLocale();
  const { addItem } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [selectedColor, setSelectedColor] = useState(moto.color[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [showQuote, setShowQuote] = useState(false);
  const [showTestRide, setShowTestRide] = useState(false);

  const favorite = isFavorite(moto._id);

  const handleAddToCart = () => {
    addItem({
      motorcycleId: moto._id,
      name: moto.name,
      price: moto.price,
      quantity,
      color: selectedColor,
      thumbnail: "",
      slug: moto.slug,
    });
    toast.success("Ajouté au panier");
  };

  const handleBuyNow = () => {
    handleAddToCart();
    window.location.href = "/cart/";
  };

  const handleFavorite = () => {
    toggleFavorite(moto._id);
    toast.info(favorite ? "Retiré des favoris" : "Ajouté aux favoris");
  };

  const handleDownloadPDF = async () => {
    try {
      await generateProductPDF(
        {
          name: moto.name,
          reference: moto.reference,
          brand: moto.brand,
          thumbnail: moto.thumbnail || "",
          specifications: moto.specifications,
        },
        locale
      );
      toast.success("Fiche technique téléchargée");
    } catch {
      toast.error("Erreur lors du téléchargement du PDF");
    }
  };

  return (
    <div className="product-info">
      {moto.brand && (
        <Link href={`/catalog/?brand=${moto.brand.slug}`} className="text-muted text-decoration-none">
          {moto.brand.name}
        </Link>
      )}
      <h1 className="h2 fw-bold mb-2">{moto.name}</h1>
      <div className="d-flex flex-wrap gap-2 mb-3 small text-muted">
        <span>Réf: {moto.reference}</span>
        <span>{moto.displacement} cm³</span>
        <span>{moto.year}</span>
        <span>{moto.transmission}</span>
      </div>

      <div className="d-flex align-items-center gap-3 mb-3">
        <span className="display-6 fw-bold" style={{ color: "var(--primary-dark)" }}>
          {formatPrice(moto.price, moto.currency)}
        </span>
        {moto.oldPrice && moto.oldPrice > 0 && (
          <span className="text-muted text-decoration-line-through fs-4">
            {formatPrice(moto.oldPrice, moto.currency)}
          </span>
        )}
      </div>

      <div className="d-flex flex-wrap gap-2 mb-3">
        <Badge bg={getAvailabilityColor(moto.availability)} className="fs-6">
          {getAvailabilityLabel(moto.availability)}
        </Badge>
        <Badge bg="light" text="dark" className="fs-6">
          <FaTruck className="me-1" /> Livraison disponible
        </Badge>
        <Badge bg="light" text="dark" className="fs-6">
          <FaShieldAlt className="me-1" /> Garantie {moto.warranty}
        </Badge>
      </div>

      <p className="text-muted mb-3">
        {moto.stock > 0 ? `${moto.stock} unités disponibles` : "Stock épuisé"}
      </p>

      {moto.color.length > 0 && (
        <div className="mb-3">
          <Form.Label className="fw-bold">Couleur : {selectedColor}</Form.Label>
          <div className="d-flex gap-2">
            {moto.color.map((color) => (
              <button
                key={color}
                className={`rounded-circle border ${selectedColor === color ? "border-3 border-primary" : "border-1"}`}
                style={{
                  width: 36,
                  height: 36,
                  backgroundColor: color.toLowerCase(),
                  cursor: "pointer",
                }}
                onClick={() => setSelectedColor(color)}
                aria-label={color}
                title={color}
              />
            ))}
          </div>
        </div>
      )}

      <div className="mb-3">
        <Form.Label className="fw-bold">Quantité</Form.Label>
        <InputGroup style={{ maxWidth: 150 }}>
          <Button variant="outline-secondary" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
            -
          </Button>
          <Form.Control
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value || "1", 10)))}
            className="text-center"
          />
          <Button variant="outline-secondary" onClick={() => setQuantity(quantity + 1)}>
            +
          </Button>
        </InputGroup>
      </div>

      <div className="d-flex flex-wrap gap-2 mb-3">
        <Button
          variant="primary"
          size="lg"
          className="d-flex align-items-center gap-2"
          onClick={handleAddToCart}
          disabled={moto.availability !== "in_stock"}
        >
          <FaShoppingCart /> Ajouter au panier
        </Button>
        <Button
          variant="dark"
          size="lg"
          className="d-flex align-items-center gap-2"
          onClick={handleBuyNow}
          disabled={moto.availability !== "in_stock"}
        >
          <FaBolt /> Acheter maintenant
        </Button>
      </div>

      <div className="d-flex flex-wrap gap-2 mb-4">
        <Button variant="outline-primary" className="d-flex align-items-center gap-2" onClick={() => setShowQuote(true)}>
          <FaFileInvoice /> Demander un devis
        </Button>
        <Button variant="outline-primary" className="d-flex align-items-center gap-2" onClick={() => setShowTestRide(true)}>
          <FaCalendarAlt /> Essayer cette moto
        </Button>
        <Button variant="outline-secondary" className="d-flex align-items-center gap-2" onClick={handleDownloadPDF}>
          <FaFilePdf /> Fiche technique PDF
        </Button>
        {moto.datasheet && (
          <a
            href={moto.datasheet}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-success d-flex align-items-center gap-2"
          >
            <FaFilePdf /> Télécharger PDF joint
          </a>
        )}
        <Button
          variant={favorite ? "danger" : "outline-secondary"}
          className="d-flex align-items-center gap-2"
          onClick={handleFavorite}
        >
          <FaHeart /> {favorite ? "Favori" : "Favoris"}
        </Button>
        <Button variant="outline-secondary" className="d-flex align-items-center gap-2">
          <FaBalanceScale /> Comparer
        </Button>
      </div>

      <div className="mb-4">
        <ShareButtons url={currentUrl} title={moto.name} />
      </div>

      <div className="d-flex flex-wrap gap-3 mb-4 small text-muted">
        <span className="d-flex align-items-center gap-1">
          <FaCheckCircle className="text-success" /> Paiement sécurisé
        </span>
        <span className="d-flex align-items-center gap-1">
          <FaCheckCircle className="text-success" /> Garantie constructeur
        </span>
        <span className="d-flex align-items-center gap-1">
          <FaCheckCircle className="text-success" /> SAV agréé
        </span>
      </div>

      <a
        href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(`Bonjour, je suis intéressé par la ${moto.name} (${formatPrice(moto.price, moto.currency)})`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-success d-flex align-items-center gap-2 w-100 mb-4"
      >
        <FaWhatsapp /> Discuter sur WhatsApp
      </a>

      <Row className="mt-4">
        <Col lg={12}>
          <FinancingCalculator price={moto.price} />
        </Col>
      </Row>

      <QuoteModal
        show={showQuote}
        onHide={() => setShowQuote(false)}
        motorcycleId={moto._id}
        motorcycleName={moto.name}
      />
      <TestRideModal
        show={showTestRide}
        onHide={() => setShowTestRide(false)}
        motorcycleId={moto._id}
        motorcycleName={moto.name}
      />
    </div>
  );
}
