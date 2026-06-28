"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Nav, Button, Badge } from "react-bootstrap";
import { signOut } from "next-auth/react";
import {
  FaMotorcycle, FaUsers, FaShoppingCart, FaStore,
  FaComments, FaFileInvoice, FaCalendarAlt, FaCog,
  FaChartLine, FaUserCircle,
} from "react-icons/fa";

const ROLE_LABELS: Record<string, string> = {
  admin:     "Administrateur",
  sales:     "Commercial",
  warehouse: "Magasinier",
  customer:  "Client",
};

const ROLE_BADGE: Record<string, string> = {
  admin:     "danger",
  sales:     "primary",
  warehouse: "warning",
  customer:  "secondary",
};

const ALL_MENU_ITEMS = [
  // Tableau de bord : chaque rôle a sa propre page d'accueil
  { href: "/admin",                icon: <FaChartLine />,    label: "Tableau de bord", exact: true,  roles: ["admin"] },
  { href: "/admin/quotes",         icon: <FaChartLine />,    label: "Tableau de bord", exact: true,  roles: ["sales"] },
  { href: "/admin/orders",         icon: <FaChartLine />,    label: "Tableau de bord", exact: true,  roles: ["warehouse"] },
  // Sections
  { href: "/admin/motos",          icon: <FaMotorcycle />,   label: "Motos",           roles: ["admin", "sales", "warehouse"] },
  { href: "/admin/brands",         icon: <FaCog />,          label: "Marques",         roles: ["admin"] },
  { href: "/admin/categories",     icon: <FaCog />,          label: "Catégories",      roles: ["admin"] },
  { href: "/admin/orders",         icon: <FaShoppingCart />, label: "Commandes",        roles: ["admin", "sales", "warehouse"] },
  { href: "/admin/quotes",         icon: <FaFileInvoice />,  label: "Devis",           roles: ["admin", "sales"] },
  { href: "/admin/test-rides",     icon: <FaCalendarAlt />,  label: "Essais moto",     roles: ["admin", "sales"] },
  { href: "/admin/users",          icon: <FaUsers />,        label: "Utilisateurs",    roles: ["admin"] },
  { href: "/admin/stores",         icon: <FaStore />,        label: "Magasins",        roles: ["admin", "warehouse"] },
  { href: "/admin/reviews",        icon: <FaComments />,     label: "Avis clients",    roles: ["admin"] },
];

interface Props {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export default function AdminSidebar({ firstName, lastName, email, role }: Props) {
  const pathname = usePathname();

  // Filtrer par rôle puis dédupliquer par href+label (évite les doublons de clé)
  const seen = new Set<string>();
  const menuItems = ALL_MENU_ITEMS.filter((item) => {
    if (item.roles && !item.roles.includes(role)) return false;
    const key = `${item.href}::${item.label}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return (
    <div className="admin-sidebar p-3 rounded">
      {/* Infos utilisateur */}
      <div className="text-center mb-3 pb-3 border-bottom border-secondary">
        <div
          className="mx-auto mb-2 rounded-circle d-flex align-items-center justify-content-center bg-white text-dark fw-bold"
          style={{ width: 44, height: 44, fontSize: 16 }}
        >
          {firstName?.[0]}{lastName?.[0]}
        </div>
        <div className="text-white small fw-semibold">{firstName} {lastName}</div>
        <Badge bg={ROLE_BADGE[role] || "secondary"} className="mt-1">
          {ROLE_LABELS[role] || role}
        </Badge>
      </div>

      {/* Navigation */}
      <Nav className="flex-column">
        {menuItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={`${item.href}::${item.label}`}
              href={item.href}
              className={`nav-link d-flex align-items-center gap-2 ${isActive ? "active" : ""}`}
            >
              {item.icon} <span>{item.label}</span>
            </Link>
          );
        })}
      </Nav>

      {/* Pied de sidebar */}
      <hr className="border-secondary mt-3" />
      <div className="d-flex align-items-center gap-2 text-white-50 small mb-2 text-truncate">
        <FaUserCircle className="flex-shrink-0" /> {email}
      </div>
      <Button
        variant="outline-light"
        size="sm"
        className="w-100"
        onClick={() => signOut({ callbackUrl: "/login" })}
      >
        Déconnexion
      </Button>
    </div>
  );
}
