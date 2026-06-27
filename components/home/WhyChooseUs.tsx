"use client";

import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FaShieldAlt, FaTools, FaMoneyBillWave, FaShippingFast, FaHeadset, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import { useLocale } from "@/hooks/useLocale";
import SectionTitle from "@/components/common/SectionTitle";

export default function WhyChooseUs() {
  const { locale } = useLocale();

  const features = [
    {
      icon: <FaShieldAlt size={36} />,
      title: { fr: "Garantie officielle", en: "Official warranty" },
      description: { fr: "Toutes nos motos bénéficient d'une garantie constructeur complète.", en: "All our motorcycles benefit from a full manufacturer warranty." },
    },
    {
      icon: <FaTools size={36} />,
      title: { fr: "Service d'experts", en: "Expert service" },
      description: { fr: "Notre atelier est équipé pour l'entretien et la réparation de toutes marques.", en: "Our workshop is equipped for the maintenance and repair of all brands." },
    },
    {
      icon: <FaMoneyBillWave size={36} />,
      title: { fr: "Financement facilité", en: "Easy financing" },
      description: { fr: "Solutions de financement adaptées à votre budget et à vos besoins.", en: "Financing solutions tailored to your budget and needs." },
    },
    {
      icon: <FaShippingFast size={36} />,
      title: { fr: "Livraison rapide", en: "Fast delivery" },
      description: { fr: "Livraison à domicile ou en magasin dans les meilleurs délais.", en: "Home or store delivery in the shortest possible time." },
    },
    {
      icon: <FaHeadset size={36} />,
      title: { fr: "Conseil personnalisé", en: "Personalized advice" },
      description: { fr: "Nos conseillers vous accompagnent dans le choix de votre moto idéale.", en: "Our advisors help you choose your ideal motorcycle." },
    },
    {
      icon: <FaCheckCircle size={36} />,
      title: { fr: "Pièces d'origine", en: "Original parts" },
      description: { fr: "Nous proposons uniquement des pièces détachées d'origine et de qualité.", en: "We only offer original and quality spare parts." },
    },
  ];

  return (
    <section className="py-5" style={{ backgroundColor: "var(--gray-100)" }}>
      <Container>
        <SectionTitle
          title={locale === "fr" ? "Pourquoi nous choisir" : "Why choose us"}
          subtitle={locale === "fr" ? "Le concessionnaire moto de référence en Côte d'Ivoire" : "The reference motorcycle dealership in Ivory Coast"}
          centered
        />
        <Row className="g-4">
          {features.map((feature, index) => (
            <Col key={index} md={6} lg={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-100 border-0 p-4 text-center">
                  <div
                    className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
                    style={{ width: 80, height: 80, backgroundColor: "var(--primary-light)", color: "var(--dark)" }}
                  >
                    {feature.icon}
                  </div>
                  <Card.Body>
                    <Card.Title as="h5">{feature.title[locale]}</Card.Title>
                    <Card.Text className="text-muted">{feature.description[locale]}</Card.Text>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}
