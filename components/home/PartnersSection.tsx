"use client";

import React from "react";
import Image from "next/image";
import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import { useLocale } from "@/hooks/useLocale";
import SectionTitle from "@/components/common/SectionTitle";

const partners = [
  { name: "Yamaha", logo: "/images/brands/yamaha.png" },
  { name: "Honda", logo: "/images/brands/honda.png" },
  { name: "Kawasaki", logo: "/images/brands/kawasaki.png" },
  { name: "Suzuki", logo: "/images/brands/suzuki.png" },
  { name: "KTM", logo: "/images/brands/ktm.png" },
  { name: "BMW Motorrad", logo: "/images/brands/bmw.png" },
];

export default function PartnersSection() {
  const { locale } = useLocale();

  return (
    <section className="py-5">
      <Container>
        <SectionTitle
          title={locale === "fr" ? "Nos partenaires" : "Our partners"}
          subtitle={locale === "fr" ? "Nous collaborons avec les meilleures marques du marché" : "We collaborate with the best brands on the market"}
          centered
        />
        <Row className="g-4 align-items-center justify-content-center">
          {partners.map((partner, index) => (
            <Col key={partner.name} xs={6} sm={4} md={3} lg={2}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="d-flex align-items-center justify-content-center p-3"
                style={{ filter: "grayscale(100%)", opacity: 0.7, transition: "all 0.3s" }}
                whileHover={{ filter: "grayscale(0%)", opacity: 1, scale: 1.05 }}
              >
                <div className="position-relative" style={{ width: 120, height: 60 }}>
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    className="object-fit-contain"
                  />
                </div>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}
