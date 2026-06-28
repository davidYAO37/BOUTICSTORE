"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Container, Row, Col, Card, Button, Form, InputGroup, Table } from "react-bootstrap";
import { FaTrash, FaShoppingBag, FaArrowLeft, FaMinus, FaPlus } from "react-icons/fa";
import { useCart } from "@/hooks/useCart";
import { useLocale } from "@/hooks/useLocale";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { locale } = useLocale();
  const { items, totalPrice, updateQuantity, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <Container className="py-5 text-center">
        <div className="mb-4">
          <FaShoppingBag size={64} className="text-muted" />
        </div>
        <h2>{locale === "fr" ? "Votre panier est vide" : "Your cart is empty"}</h2>
        <p className="text-muted mb-4">
          {locale === "fr" ? "Découvrez nos motos et ajoutez-les à votre panier" : "Discover our motorcycles and add them to your cart"}
        </p>
        <Link href="/catalog/" className="btn btn-primary d-inline-flex align-items-center gap-2">
          <FaArrowLeft /> {locale === "fr" ? "Continuer les achats" : "Continue shopping"}
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="mb-4">{locale === "fr" ? "Votre panier" : "Your cart"}</h2>
      <Row className="g-4">
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <Table responsive className="align-middle">
                <thead>
                  <tr>
                    <th>{locale === "fr" ? "Produit" : "Product"}</th>
                    <th>{locale === "fr" ? "Prix" : "Price"}</th>
                    <th>{locale === "fr" ? "Quantité" : "Quantity"}</th>
                    <th>{locale === "fr" ? "Total" : "Total"}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.motorcycleId + (item.color || "")}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <div className="position-relative rounded overflow-hidden" style={{ width: 80, height: 60, backgroundColor: "var(--gray-100)" }}>
                            <Image src={item.thumbnail || "/images/placeholder.jpg"} alt={item.name} fill className="object-fit-cover" />
                          </div>
                          <div>
                            <Link href={`/motos/${item.slug}/`} className="fw-bold text-decoration-none">
                              {item.name}
                            </Link>
                            {item.color && <p className="mb-0 small text-muted">{item.color}</p>}
                          </div>
                        </div>
                      </td>
                      <td>{formatPrice(item.price, "FCFA")}</td>
                      <td>
                        <InputGroup size="sm" style={{ maxWidth: 120 }}>
                          <Button variant="outline-secondary" onClick={() => updateQuantity(item.motorcycleId, item.quantity - 1, item.color)}>
                            <FaMinus />
                          </Button>
                          <Form.Control className="text-center" value={item.quantity} readOnly />
                          <Button variant="outline-secondary" onClick={() => updateQuantity(item.motorcycleId, item.quantity + 1, item.color)}>
                            <FaPlus />
                          </Button>
                        </InputGroup>
                      </td>
                      <td className="fw-bold">{formatPrice(item.price * item.quantity, "FCFA")}</td>
                      <td>
                        <Button variant="link" className="text-danger" onClick={() => removeItem(item.motorcycleId, item.color)}>
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="border-0 shadow-sm sticky-top" style={{ top: 100 }}>
            <Card.Body>
              <h4 className="mb-3">{locale === "fr" ? "Récapitulatif" : "Summary"}</h4>
              <div className="d-flex justify-content-between mb-2">
                <span>{locale === "fr" ? "Sous-total" : "Subtotal"}</span>
                <strong>{formatPrice(totalPrice, "FCFA")}</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>{locale === "fr" ? "Livraison" : "Shipping"}</span>
                <span>{locale === "fr" ? "À calculer" : "To calculate"}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <span className="h5">{locale === "fr" ? "Total" : "Total"}</span>
                <span className="h5" style={{ color: "var(--primary-dark)" }}>{formatPrice(totalPrice, "FCFA")}</span>
              </div>
              <Button variant="primary" size="lg" className="w-100 mb-2">
                {locale === "fr" ? "Commander" : "Checkout"}
              </Button>
              <Button variant="outline-secondary" size="sm" className="w-100 mb-2" onClick={clearCart}>
                {locale === "fr" ? "Vider le panier" : "Clear cart"}
              </Button>
              <Link href="/catalog/" className="btn btn-link w-100 d-inline-flex align-items-center justify-content-center gap-2">
                <FaArrowLeft /> {locale === "fr" ? "Continuer les achats" : "Continue shopping"}
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
