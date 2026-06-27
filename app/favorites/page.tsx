"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FaHeart, FaShoppingCart, FaTrash, FaArrowLeft } from "react-icons/fa";
import { useFavorites } from "@/hooks/useFavorites";
import { useCart } from "@/hooks/useCart";
import { useLocale } from "@/hooks/useLocale";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { getMotorcycles } from "@/services/api";

export default function FavoritesPage() {
  const { locale } = useLocale();
  const { favorites, toggleFavorite } = useFavorites();
  const { addItem } = useCart();
  const [favoriteMotos, setFavoriteMotos] = useState([]);

  useEffect(() => {
    async function loadFavorites() {
      if (!favorites.length) return;
      try {
        const data = await getMotorcycles({ limit: 100 });
        const all = data?.data || [];
        setFavoriteMotos(all.filter((m: { _id: string }) => favorites.includes(m._id)));
      } catch (error) {
        console.error(error);
      }
    }
    loadFavorites();
  }, [favorites]);

  if (favorites.length === 0) {
    return (
      <Container className="py-5 text-center">
        <FaHeart size={64} className="text-muted mb-4" />
        <h2>{locale === "fr" ? "Vos favoris sont vides" : "Your favorites are empty"}</h2>
        <p className="text-muted mb-4">{locale === "fr" ? "Ajoutez des motos à vos favoris pour les retrouver ici" : "Add motorcycles to your favorites to find them here"}</p>
        <Link href="/catalog/" passHref legacyBehavior>
          <Button variant="primary">
            <FaArrowLeft className="me-2" /> {locale === "fr" ? "Découvrir les motos" : "Discover motorcycles"}
          </Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="mb-4">{locale === "fr" ? "Vos favoris" : "Your favorites"}</h2>
      <Row className="g-4">
        {favoriteMotos.map((moto: any) => (
          <Col key={moto._id} md={6} lg={4}>
            <Card className="h-100 border-0 shadow-sm">
              <Link href={`/motos/${moto.slug}/`} className="position-relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
                <Image src={moto.thumbnail} alt={moto.name} fill className="object-fit-cover" />
              </Link>
              <Card.Body>
                <Card.Title>{moto.name}</Card.Title>
                <Card.Text className="fw-bold" style={{ color: "var(--primary-dark)" }}>
                  {formatPrice(moto.price, moto.currency)}
                </Card.Text>
                <div className="d-flex gap-2">
                  <Button
                    variant="primary"
                    className="flex-grow-1 d-flex align-items-center gap-2"
                    onClick={() => addItem({
                      motorcycleId: moto._id,
                      name: moto.name,
                      price: moto.price,
                      quantity: 1,
                      thumbnail: moto.thumbnail,
                      slug: moto.slug,
                    })}
                    disabled={moto.availability !== "in_stock"}
                  >
                    <FaShoppingCart /> {locale === "fr" ? "Ajouter" : "Add"}
                  </Button>
                  <Button variant="outline-danger" onClick={() => toggleFavorite(moto._id)}>
                    <FaTrash />
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
