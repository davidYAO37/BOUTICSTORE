"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, Badge, Button } from "react-bootstrap";
import { FaHeart, FaShoppingCart, FaBalanceScale, FaEye } from "react-icons/fa";
import { motion } from "framer-motion";
import { useFavorites } from "@/hooks/useFavorites";
import { useCart } from "@/hooks/useCart";
import { useLocale } from "@/hooks/useLocale";
import { formatPrice, truncateText, getAvailabilityLabel, getAvailabilityColor } from "@/lib/utils";
import { toast } from "react-toastify";

interface MotorcycleCardProps {
  moto: {
    _id: string;
    slug: string;
    name: string;
    reference: string;
    thumbnail: string;
    price: number;
    oldPrice?: number | null;
    currency: string;
    availability: string;
    stock: number;
    brand?: { name: string; slug: string };
    category?: { name: { fr: string; en: string }; slug: string };
    isPromotion?: boolean;
    isNew?: boolean;
    isPopular?: boolean;
    displacement?: number;
    year?: number;
  };
}

export default function MotorcycleCard({ moto }: MotorcycleCardProps) {
  const { locale } = useLocale();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addItem } = useCart();

  const favorite = isFavorite(moto._id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      motorcycleId: moto._id,
      name: moto.name,
      price: moto.price,
      quantity: 1,
      thumbnail: moto.thumbnail,
      slug: moto.slug,
    });
    toast.success("Ajouté au panier");
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(moto._id);
    toast.info(favorite ? "Retiré des favoris" : "Ajouté aux favoris");
  };

  const badgePromotion = moto.isPromotion && (
    <Badge bg="danger" className="badge-promotion">
      Promo
    </Badge>
  );

  const badgeNew = moto.isNew && (
    <Badge bg="success" className="badge-new">
      Nouveau
    </Badge>
  );;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Card className="product-card h-100 border-0 shadow-sm">
        <Link href={`/motos/${moto.slug}/`} className="position-relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
          <Image
            src={moto.thumbnail}
            alt={moto.name}
            fill
            className="object-fit-cover"
            sizes="(max-width: 576px) 100vw, (max-width: 992px) 50vw, 25vw"
          />
          {badgePromotion}
          {badgeNew}
          <button
            className={`btn-favorite ${favorite ? "active" : ""}`}
            onClick={handleFavorite}
            aria-label={favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            <FaHeart color={favorite ? "#dc3545" : "currentColor"} />
          </button>
        </Link>
        <Card.Body className="d-flex flex-column">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div>
              {moto.brand && (
                <small className="text-muted d-block">{moto.brand.name}</small>
              )}
              <Link href={`/motos/${moto.slug}/`} className="text-decoration-none">
                <Card.Title as="h5" className="mb-1" style={{ color: "var(--body-color)" }}>
                  {truncateText(moto.name, 45)}
                </Card.Title>
              </Link>
              {moto.category && (
                <small className="text-muted">{moto.category.name[locale]}</small>
              )}
            </div>
          </div>

          <div className="mb-2">
            <span className="fw-bold fs-5" style={{ color: "var(--primary-dark)" }}>
              {formatPrice(moto.price, moto.currency)}
            </span>
            {moto.oldPrice && moto.oldPrice > 0 && (
              <span className="text-muted text-decoration-line-through ms-2 small">
                {formatPrice(moto.oldPrice, moto.currency)}
              </span>
            )}
          </div>

          <div className="d-flex flex-wrap gap-2 mb-3 small text-muted">
            {moto.displacement && <span>{moto.displacement} cm³</span>}
            {moto.year && <span>{moto.year}</span>}
            <Badge bg={getAvailabilityColor(moto.availability)} className="text-capitalize">
              {getAvailabilityLabel(moto.availability)}
            </Badge>
          </div>

          <div className="mt-auto d-flex gap-2">
            <Button
              variant="primary"
              className="flex-grow-1 d-flex align-items-center justify-content-center gap-2"
              onClick={handleAddToCart}
              disabled={moto.availability !== "in_stock"}
            >
              <FaShoppingCart /> <span className="d-none d-sm-inline">Ajouter</span>
            </Button>
            <Link
              href={`/motos/${moto.slug}/`}
              className="btn btn-outline-secondary d-flex align-items-center justify-content-center"
              aria-label="Voir détails"
            >
              <FaEye />
            </Link>
            <Button
              variant="outline-secondary"
              className="d-flex align-items-center justify-content-center"
              aria-label="Comparer"
            >
              <FaBalanceScale />
            </Button>
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  );
}
