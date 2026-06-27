"use client";

import React from "react";
import { Tabs, Tab, Table, Row, Col, Card, Badge } from "react-bootstrap";
import {
  FaTachometerAlt,
  FaCog,
  FaWeightHanging,
  FaRuler,
  FaShieldAlt,
  FaTruck,
  FaTools,
  FaStar,
  FaRegStar,
} from "react-icons/fa";
import { useLocale } from "@/hooks/useLocale";

interface ProductTabsProps {
  description: { fr: string; en: string };
  specifications: Array<{ label: string; value: string; unit?: string; category?: string }>;
  features: Array<{ fr: string; en: string }>;
  warranty: string;
  reviews: Array<{ user: { firstName: string; lastName: string }; rating: number; title: string; comment: string; createdAt: string }>;
}

const categoryIcons: Record<string, React.ReactNode> = {
  Moteur: <FaTachometerAlt />,
  Transmission: <FaCog />,
  Châssis: <FaWeightHanging />,
  Freinage: <FaTools />,
  Dimensions: <FaRuler />,
};

export default function ProductTabs({ description, specifications, features, warranty, reviews }: ProductTabsProps) {
  const { locale } = useLocale();

  const groupedSpecs = specifications.reduce((acc, spec) => {
    const category = spec.category || "Autres";
    if (!acc[category]) acc[category] = [];
    acc[category].push(spec);
    return acc;
  }, {} as Record<string, typeof specifications>);

  return (
    <div className="product-tabs my-5">
      <Tabs defaultActiveKey="description" className="mb-4" fill>
        <Tab eventKey="description" title={locale === "fr" ? "Description" : "Description"}>
          <Card className="border-0 shadow-sm p-4">
            <h4>{locale === "fr" ? "Description du produit" : "Product description"}</h4>
            <p>{description[locale]}</p>
            <h5 className="mt-4">{locale === "fr" ? "Points forts" : "Key features"}</h5>
            <ul className="list-unstyled">
              {features.map((feature, index) => (
                <li key={index} className="d-flex align-items-center gap-2 mb-2">
                  <Badge bg="primary" className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 24, height: 24 }}>
                    ✓
                  </Badge>
                  {feature[locale]}
                </li>
              ))}
            </ul>

            {specifications.length > 0 && (
              <>
                <h5 className="mt-4 mb-3">{locale === "fr" ? "Spécifications techniques" : "Technical specifications"}</h5>
                <Table responsive bordered hover className="rounded overflow-hidden">
                  <thead>
                    <tr style={{ backgroundColor: "var(--primary)", color: "#fff" }}>
                      <th style={{ width: "38%" }}>{locale === "fr" ? "Spécification" : "Specification"}</th>
                      <th>{locale === "fr" ? "Détail" : "Detail"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {specifications.map((spec, index) => (
                      <tr key={index}>
                        <td className="fw-semibold text-dark">{spec.label}</td>
                        <td className="text-secondary">{spec.value}{spec.unit ? ` ${spec.unit}` : ""}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            )}
          </Card>
        </Tab>

        <Tab eventKey="specifications" title={locale === "fr" ? "Caractéristiques" : "Specifications"}>
          <Card className="border-0 shadow-sm p-4">
            <h4 className="mb-3">{locale === "fr" ? "Fiche technique" : "Technical sheet"}</h4>
            <Table responsive striped hover className="rounded overflow-hidden">
              <tbody>
                {specifications.map((spec, index) => (
                  <tr key={index}>
                    <td className="fw-bold" style={{ width: "40%" }}>{spec.label}</td>
                    <td>
                      {spec.value} {spec.unit || ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <h5 className="mt-4 mb-3">{locale === "fr" ? "Vue d'ensemble" : "Overview"}</h5>
            <Row className="g-3">
              {Object.entries(groupedSpecs).map(([category, specs]) => (
                <Col key={category} md={6} lg={4}>
                  <Card className="h-100 border-0 shadow-sm">
                    <Card.Body>
                      <div className="d-flex align-items-center gap-2 mb-3 text-primary">
                        {categoryIcons[category] || <FaTachometerAlt />}
                        <h6 className="mb-0 fw-bold">{category}</h6>
                      </div>
                      <ul className="list-unstyled mb-0">
                        {specs.map((spec, index) => (
                          <li key={index} className="d-flex justify-content-between mb-1 small">
                            <span className="text-muted">{spec.label}</span>
                            <span className="fw-bold">{spec.value} {spec.unit || ""}</span>
                          </li>
                        ))}
                      </ul>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Tab>

        <Tab eventKey="reviews" title={`${locale === "fr" ? "Avis" : "Reviews"} (${reviews.length})`}>
          <Card className="border-0 shadow-sm p-4">
            {reviews.length === 0 ? (
              <p className="text-muted">{locale === "fr" ? "Aucun avis pour le moment" : "No reviews yet"}</p>
            ) : (
              reviews.map((review, index) => (
                <div key={index} className="border-bottom pb-3 mb-3">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 className="mb-1">
                        {review.user.firstName} {review.user.lastName}
                      </h6>
                      <div className="d-flex gap-1 text-warning mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          i < review.rating ? <FaStar key={i} /> : <FaRegStar key={i} />
                        ))}
                      </div>
                    </div>
                    <small className="text-muted">
                      {new Date(review.createdAt).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US")}
                    </small>
                  </div>
                  <h6>{review.title}</h6>
                  <p className="mb-0">{review.comment}</p>
                </div>
              ))
            )}
          </Card>
        </Tab>

        <Tab eventKey="warranty" title={locale === "fr" ? "Garantie" : "Warranty"}>
          <Card className="border-0 shadow-sm p-4">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div
                className="d-flex align-items-center justify-content-center rounded-circle"
                style={{ width: 60, height: 60, backgroundColor: "var(--primary-light)", color: "var(--dark)" }}
              >
                <FaShieldAlt size={28} />
              </div>
              <div>
                <h4 className="mb-1">{locale === "fr" ? "Garantie" : "Warranty"} {warranty}</h4>
                <p className="mb-0 text-muted">{locale === "fr" ? "Garantie constructeur incluse" : "Manufacturer warranty included"}</p>
              </div>
            </div>
            <p>
              {locale === "fr"
                ? "Tous nos véhicules neufs bénéficient d'une garantie constructeur. Cette garantie couvre les défauts de fabrication et les vices cachés selon les conditions du constructeur."
                : "All our new vehicles benefit from a manufacturer warranty. This warranty covers manufacturing defects and hidden defects according to the manufacturer's conditions."}
            </p>
          </Card>
        </Tab>

        <Tab eventKey="delivery" title={locale === "fr" ? "Livraison" : "Delivery"}>
          <Card className="border-0 shadow-sm p-4">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div
                className="d-flex align-items-center justify-content-center rounded-circle"
                style={{ width: 60, height: 60, backgroundColor: "var(--primary-light)", color: "var(--dark)" }}
              >
                <FaTruck size={28} />
              </div>
              <div>
                <h4 className="mb-1">{locale === "fr" ? "Livraison & Retrait" : "Delivery & Pickup"}</h4>
                <p className="mb-0 text-muted">{locale === "fr" ? "Plusieurs options disponibles" : "Several options available"}</p>
              </div>
            </div>
            <ul className="list-unstyled">
              <li className="mb-2">✓ {locale === "fr" ? "Retrait gratuit en magasin" : "Free in-store pickup"}</li>
              <li className="mb-2">✓ {locale === "fr" ? "Livraison à domicile dans tout le pays" : "Home delivery nationwide"}</li>
              <li className="mb-2">✓ {locale === "fr" ? "Mise en route et explications incluses" : "Startup and explanations included"}</li>
              <li className="mb-2">✓ {locale === "fr" ? "Délai de livraison selon la localisation" : "Delivery time according to location"}</li>
            </ul>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}
