"use client";

import React from "react";
import Link from "next/link";
import { Row, Col, Card } from "react-bootstrap";
import {
  FaMotorcycle,
  FaUsers,
  FaShoppingCart,
  FaStore,
  FaComments,
  FaFileInvoice,
  FaCalendarAlt,
  FaChartLine,
  FaCog,
} from "react-icons/fa";

const menuItems = [
  { href: "/admin/motos", icon: <FaMotorcycle />, label: "Motos", count: 124 },
  { href: "/admin/brands", icon: <FaCog />, label: "Marques", count: 12 },
  { href: "/admin/categories", icon: <FaCog />, label: "Catégories", count: 8 },
  { href: "/admin/orders", icon: <FaShoppingCart />, label: "Commandes", count: 45 },
  { href: "/admin/quotes", icon: <FaFileInvoice />, label: "Devis", count: 23 },
  { href: "/admin/test-rides", icon: <FaCalendarAlt />, label: "Essais", count: 18 },
  { href: "/admin/users", icon: <FaUsers />, label: "Utilisateurs", count: 89 },
  { href: "/admin/stores", icon: <FaStore />, label: "Magasins", count: 3 },
  { href: "/admin/reviews", icon: <FaComments />, label: "Avis", count: 156 },
];

const stats = [
  { label: "Ventes du mois", value: "8 450 000 FCFA", icon: <FaChartLine />, color: "primary" },
  { label: "Commandes en cours", value: "12", icon: <FaShoppingCart />, color: "warning" },
  { label: "Motos en stock", value: "124", icon: <FaMotorcycle />, color: "success" },
  { label: "Devis en attente", value: "23", icon: <FaFileInvoice />, color: "info" },
];

export default function AdminPage() {
  return (
    <>
      <h2 className="mb-4">Tableau de bord</h2>
      <Row className="g-4 mb-4">
        {stats.map((stat) => (
          <Col key={stat.label} md={6} xl={3}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="d-flex align-items-center gap-3">
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle text-white"
                  style={{ width: 60, height: 60, backgroundColor: `var(--${stat.color})` }}
                >
                  {stat.icon}
                </div>
                <div>
                  <h6 className="text-muted mb-1">{stat.label}</h6>
                  <h4 className="mb-0 fw-bold">{stat.value}</h4>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-4">
        {menuItems.map((item) => (
          <Col key={item.href} md={6} lg={4} xl={3}>
            <Link href={item.href} className="text-decoration-none">
              <Card className="border-0 shadow-sm h-100 hover-shadow">
                <Card.Body className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle"
                      style={{ width: 50, height: 50, backgroundColor: "var(--primary-light)", color: "var(--dark)" }}
                    >
                      {item.icon}
                    </div>
                    <h5 className="mb-0" style={{ color: "var(--body-color)" }}>{item.label}</h5>
                  </div>
                  <span className="h4 mb-0" style={{ color: "var(--primary-dark)" }}>{item.count}</span>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </>
  );
}
