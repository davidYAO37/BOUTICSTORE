"use client";

import React, { useState } from "react";
import { Container, Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import { FaEnvelope, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { useLocale } from "@/hooks/useLocale";
import { toast } from "react-toastify";

export default function NewsletterSection() {
  const { locale } = useLocale();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success(locale === "fr" ? "Inscription réussie !" : "Successfully subscribed!");
    setEmail("");
  };

  return (
    <section className="py-5" style={{ backgroundColor: "var(--primary)" }}>
      <Container>
        <Row className="align-items-center g-4">
          <Col lg={6}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="fw-bold mb-2" style={{ color: "var(--dark)" }}>
                {locale === "fr" ? "Inscrivez-vous à notre newsletter" : "Subscribe to our newsletter"}
              </h3>
              <p className="mb-0" style={{ color: "var(--dark)" }}>
                {locale === "fr" ? "Recevez nos offres exclusives et nos dernières nouveautés." : "Receive our exclusive offers and latest news."}
              </p>
            </motion.div>
          </Col>
          <Col lg={6}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Form onSubmit={handleSubmit}>
                <InputGroup size="lg">
                  <InputGroup.Text className="bg-white border-0">
                    <FaEnvelope />
                  </InputGroup.Text>
                  <Form.Control
                    type="email"
                    placeholder={locale === "fr" ? "Votre adresse email" : "Your email address"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-0"
                    required
                  />
                  <Button variant="dark" type="submit" className="d-flex align-items-center gap-2">
                    {locale === "fr" ? "S'inscrire" : "Subscribe"} <FaArrowRight />
                  </Button>
                </InputGroup>
              </Form>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
