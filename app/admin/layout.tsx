"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container, Row, Col, Nav, Button } from "react-bootstrap";
import { signOut } from "next-auth/react";
import {
  FaMotorcycle,
  FaUsers,
  FaShoppingCart,
  FaStore,
  FaComments,
  FaFileInvoice,
  FaCalendarAlt,
  FaCog,
} from "react-icons/fa";

const menuItems = [
  { href: "/admin/motos", icon: <FaMotorcycle />, label: "Motos" },
  { href: "/admin/brands", icon: <FaCog />, label: "Marques" },
  { href: "/admin/categories", icon: <FaCog />, label: "Catégories" },
  { href: "/admin/orders", icon: <FaShoppingCart />, label: "Commandes" },
  { href: "/admin/quotes", icon: <FaFileInvoice />, label: "Devis" },
  { href: "/admin/test-rides", icon: <FaCalendarAlt />, label: "Essais" },
  { href: "/admin/users", icon: <FaUsers />, label: "Utilisateurs" },
  { href: "/admin/stores", icon: <FaStore />, label: "Magasins" },
  { href: "/admin/reviews", icon: <FaComments />, label: "Avis" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <Container fluid className="py-4">
      <Row>
        <Col lg={2} className="d-none d-lg-block">
          <div className="admin-sidebar p-3 rounded">
            <h5 className="text-white mb-3">Administration</h5>
            <Nav className="flex-column">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link d-flex align-items-center gap-2 ${pathname.startsWith(item.href) ? "active" : ""}`}
                >
                  {item.icon} <span>{item.label}</span>
                </Link>
              ))}
            </Nav>
            <Button
              variant="outline-light"
              size="sm"
              className="w-100 mt-4"
              onClick={() => signOut({ callbackUrl: "/login/" })}
            >
              Déconnexion
            </Button>
          </div>
        </Col>
        <Col lg={10}>{children}</Col>
      </Row>
    </Container>
  );
}
