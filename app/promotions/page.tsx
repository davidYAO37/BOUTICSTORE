"use client";

import React, { useEffect, useState } from "react";
import { Container, Row, Col, Alert } from "react-bootstrap";
import MotorcycleCard from "@/components/common/MotorcycleCard";
import SectionTitle from "@/components/common/SectionTitle";
import { useLocale } from "@/hooks/useLocale";
import { getMotorcycles } from "@/services/api";

export default function PromotionsPage() {
  const { locale } = useLocale();
  const [motos, setMotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getMotorcycles({ isPromotion: true, limit: 24 });
        setMotos(data?.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <Container className="py-5">
      <SectionTitle
        title={locale === "fr" ? "Promotions" : "Promotions"}
        subtitle={locale === "fr" ? "Profitez de nos meilleures offres du moment" : "Take advantage of our best current offers"}
        centered
      />

      {loading ? (
        <Row className="g-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Col key={i} md={6} lg={4}>
              <div className="skeleton" style={{ aspectRatio: "4/3" }} />
            </Col>
          ))}
        </Row>
      ) : motos.length === 0 ? (
        <Alert variant="info" className="text-center">
          {locale === "fr" ? "Aucune promotion en cours" : "No ongoing promotions"}
        </Alert>
      ) : (
        <Row className="g-4">
          {motos.map((moto: any) => (
            <Col key={moto._id} md={6} lg={4} xl={3}>
              <MotorcycleCard moto={moto} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
