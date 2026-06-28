import { Metadata } from "next";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FaTools, FaOilCan, FaTachometerAlt, FaShieldAlt, FaMotorcycle, FaWrench, FaPhone } from "react-icons/fa";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services",
  description: "Découvrez tous les services proposés par Ivoire Motos : entretien, réparation, financement, livraison, SAV et plus.",
};

const services = [
  {
    icon: <FaTools size={40} />,
    title: "Atelier mécanique",
    description: "Entretien courant et réparations sur toutes les marques par des techniciens qualifiés.",
  },
  {
    icon: <FaOilCan size={40} />,
    title: "Vidange et entretien",
    description: "Vidange, révision, réglage carburateur, changement de filtres et plaquettes.",
  },
  {
    icon: <FaTachometerAlt size={40} />,
    title: "Diagnostic électronique",
    description: "Diagnostic précis des pannes et optimisation des performances de votre moto.",
  },
  {
    icon: <FaShieldAlt size={40} />,
    title: "Garantie SAV",
    description: "Service après-vente agréé avec pièces d'origine et garantie constructeur.",
  },
  {
    icon: <FaMotorcycle size={40} />,
    title: "Essai routier",
    description: "Testez la moto de votre choix avec un accompagnement personnalisé.",
  },
  {
    icon: <FaWrench size={40} />,
    title: "Pièces détachées",
    description: "Large stock de pièces d'origine et consommables pour votre moto.",
  },
];

export default function ServicesPage() {
  return (
    <Container className="py-5">
      <h1 className="section-title text-center mb-4">Nos services</h1>
      <p className="text-center text-muted mb-5">
        Une gamme complète de services pour vous accompagner dans l'achat, l'entretien et la réparation de votre moto.
      </p>
      <Row className="g-4">
        {services.map((service, index) => (
          <Col key={index} md={6} lg={4}>
            <Card className="border-0 shadow-sm h-100 p-4 text-center">
              <div className="text-primary mb-3">{service.icon}</div>
              <h5>{service.title}</h5>
              <p className="text-muted mb-4">{service.description}</p>
              <Link href="/contact/" className="btn btn-outline-primary mt-auto d-inline-flex align-items-center gap-2">
                <FaPhone /> Nous contacter
              </Link>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
