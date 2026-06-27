"use client";

import React from "react";
import Link from "next/link";
import { Container, Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
  FaWhatsapp,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaMotorcycle,
  FaArrowRight,
} from "react-icons/fa";
/* import { useLocale } from "@/hooks/useLocale"; */
import { CONTACT, SOCIAL_LINKS } from "@/lib/constants";
import { useLocale } from "@/hooks/useLocale";

export default function Footer() {
  const { t } = useLocale();

  return (
    <footer className="footer pt-5 pb-3">
      <Container>
        <Row className="g-4">
          <Col lg={4} md={6}>
            <Link href="/" className="d-flex align-items-center gap-2 fw-bold fs-4 mb-3 text-white text-decoration-none">
              <div
                className="d-flex align-items-center justify-content-center rounded"
                style={{ width: 40, height: 40, backgroundColor: "var(--primary)", color: "var(--dark)" }}
              >
                <FaMotorcycle size={22} />
              </div>
              Ivoire Motos
            </Link>
            <p className="text-secondary mb-3">
              {t("footerDescription")}
            </p>
            <div className="d-flex gap-2 mb-3">
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-light btn-sm rounded-circle"
                style={{ width: 38, height: 38, padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
              <a
                href={SOCIAL_LINKS.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-light btn-sm rounded-circle"
                style={{ width: 38, height: 38, padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-light btn-sm rounded-circle"
                style={{ width: 38, height: 38, padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href={SOCIAL_LINKS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-light btn-sm rounded-circle"
                style={{ width: 38, height: 38, padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
                aria-label="YouTube"
              >
                <FaYoutube />
              </a>
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-light btn-sm rounded-circle"
                style={{ width: 38, height: 38, padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
                aria-label="LinkedIn"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </Col>

          <Col lg={2} md={6}>
            <h5 className="footer-title">{t("quickLinks")}</h5>
            <ul className="list-unstyled d-flex flex-column gap-2">
              <li><Link href="/">{t("home")}</Link></li>
              <li><Link href="/catalog/">{t("motorcycles")}</Link></li>
              <li><Link href="/promotions/">{t("promotions")}</Link></li>
              <li><Link href="/services/">{t("services")}</Link></li>
              <li><Link href="/about/">{t("about")}</Link></li>
              <li><Link href="/contact/">{t("contact")}</Link></li>
            </ul>
          </Col>

          <Col lg={3} md={6}>
            <h5 className="footer-title">{t("customerService")}</h5>
            <ul className="list-unstyled d-flex flex-column gap-2">
              <li><Link href="/faq/">{t("faq")}</Link></li>
              <li><Link href="/shipping/">{t("shipping")}</Link></li>
              <li><Link href="/returns/">{t("returns")}</Link></li>
              <li><Link href="/warranty/">{t("warranty")}</Link></li>
              <li><Link href="/financing/">{t("financing")}</Link></li>
              <li><Link href="/privacy/">{t("privacy")}</Link></li>
            </ul>
          </Col>

          <Col lg={3} md={6}>
            <h5 className="footer-title">{t("contactUs")}</h5>
            <ul className="list-unstyled d-flex flex-column gap-2">
              <li className="d-flex align-items-start gap-2">
                <FaMapMarkerAlt className="mt-1 text-primary" />
                <span>{CONTACT.address}</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <FaPhone className="text-primary" />
                <a href={`tel:${CONTACT.phone}`}>{CONTACT.phone}</a>
              </li>
              <li className="d-flex align-items-center gap-2">
                <FaEnvelope className="text-primary" />
                <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
              </li>
              <li className="d-flex align-items-center gap-2">
                <FaWhatsapp className="text-primary" />
                <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </li>
            </ul>

            <h5 className="footer-title mt-4">{t("newsletter")}</h5>
            <Form>
              <InputGroup>
                <Form.Control
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  style={{ backgroundColor: "var(--gray-800)", color: "var(--light)", borderColor: "var(--gray-700)" }}
                />
                <Button variant="primary">
                  <FaArrowRight />
                </Button>
              </InputGroup>
            </Form>
          </Col>
        </Row>

        <hr className="my-4" style={{ borderColor: "var(--gray-700)" }} />

        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 small">
          <p className="mb-0">
            © {new Date().getFullYear()} Ivoire Motos. {t("allRightsReserved")}
          </p>
          <div className="d-flex gap-3">
            <Link href="/terms/">{t("terms")}</Link>
            <Link href="/privacy/">{t("privacy")}</Link>
            <Link href="/cookies/">{t("cookies")}</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
