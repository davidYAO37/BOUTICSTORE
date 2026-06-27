import { Metadata } from "next";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FaAward, FaUsers, FaHandshake, FaHistory } from "react-icons/fa";

export const metadata: Metadata = {
  title: "À propos",
  description: "Découvrez Ivoire Motos, le concessionnaire moto de référence en Côte d'Ivoire. Notre histoire, nos valeurs et notre engagement.",
};

export default function AboutPage() {
  return (
    <Container className="py-5">
      <h1 className="section-title text-center mb-4">À propos de Ivoire Motos</h1>
      <p className="text-center text-muted mb-5 max-w-3xl mx-auto">
        Depuis plus de 10 ans, Ivoire Motos accompagne les passionnés de deux-roues en Côte d'Ivoire avec une offre complète de motos, services et pièces détachées.
      </p>

      <Row className="g-4 mb-5">
        <Col md={6} lg={3}>
          <Card className="border-0 shadow-sm h-100 text-center p-4">
            <div className="text-primary mb-3"><FaHistory size={40} /></div>
            <h5>10 ans d'expérience</h5>
            <p className="text-muted mb-0">Un savoir-faire reconnu dans la distribution de motos.</p>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="border-0 shadow-sm h-100 text-center p-4">
            <div className="text-primary mb-3"><FaUsers size={40} /></div>
            <h5>Équipe passionnée</h5>
            <p className="text-muted mb-0">Des conseillers et techniciens à votre écoute.</p>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="border-0 shadow-sm h-100 text-center p-4">
            <div className="text-primary mb-3"><FaAward size={40} /></div>
            <h5>Qualité garantie</h5>
            <p className="text-muted mb-0">Des produits certifiés et une garantie constructeur.</p>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="border-0 shadow-sm h-100 text-center p-4">
            <div className="text-primary mb-3"><FaHandshake size={40} /></div>
            <h5>Service client</h5>
            <p className="text-muted mb-0">Un accompagnement personnalisé avant, pendant et après l'achat.</p>
          </Card>
        </Col>
      </Row>

      <Row className="g-5 align-items-center">
        <Col lg={6}>
          <h3>Notre mission</h3>
          <p>
            Rendre accessible l'achat et l'entretien de motos de qualité en Côte d'Ivoire. Nous sélectionnons rigoureusement nos partenaires et nos produits pour vous offrir les meilleures solutions de mobilité.
          </p>
          <h3 className="mt-4">Nos valeurs</h3>
          <ul>
            <li><strong>Intégrité</strong> : transparence sur les prix et les services.</li>
            <li><strong>Excellence</strong> : exigence dans la qualité de nos produits.</li>
            <li><strong>Proximité</strong> : une relation de confiance avec nos clients.</li>
            <li><strong>Innovation</strong> : des solutions modernes et adaptées.</li>
          </ul>
        </Col>
        <Col lg={6}>
          <div className="rounded overflow-hidden shadow-sm" style={{ aspectRatio: "4/3", backgroundColor: "var(--gray-200)" }}>
            <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted">
              Image showroom
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
