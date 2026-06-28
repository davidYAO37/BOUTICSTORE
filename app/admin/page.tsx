import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/mongodb";
import { Order, Quote, Motorcycle, User, TestRide, Store } from "@/models";
import {
  FaMotorcycle, FaUsers, FaShoppingCart, FaStore,
  FaComments, FaFileInvoice, FaCalendarAlt, FaChartLine,
  FaCog, FaCheckCircle, FaClock, FaWarehouse,
} from "react-icons/fa";

// ── Helpers ───────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color, href }: {
  label: string; value: string | number; icon: React.ReactNode;
  color: string; href?: string;
}) {
  const inner = (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body d-flex align-items-center gap-3">
        <div
          className="d-flex align-items-center justify-content-center rounded-circle text-white flex-shrink-0"
          style={{ width: 56, height: 56, backgroundColor: `var(--bs-${color})` }}
        >
          {icon}
        </div>
        <div>
          <div className="text-muted small">{label}</div>
          <div className="h4 mb-0 fw-bold">{value}</div>
        </div>
      </div>
    </div>
  );
  return href ? <Link href={href} className="text-decoration-none">{inner}</Link> : inner;
}

function ShortcutCard({ href, icon, label, count, color }: {
  href: string; icon: React.ReactNode; label: string; count: number; color: string;
}) {
  return (
    <Link href={href} className="text-decoration-none">
      <div className="card border-0 shadow-sm h-100">
        <div className="card-body d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3">
            <div
              className="d-flex align-items-center justify-content-center rounded-circle"
              style={{ width: 46, height: 46, background: `var(--bs-${color}-bg, #f8f9fa)`, color: `var(--bs-${color})` }}
            >
              {icon}
            </div>
            <span className="fw-semibold">{label}</span>
          </div>
          <span className={`badge rounded-pill bg-${color}`}>{count}</span>
        </div>
      </div>
    </Link>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const role = session.user.role;
  if (role === "customer") redirect("/");

  await connectToDatabase();

  // ── ADMIN ─────────────────────────────────────────────────────────────────
  if (role === "admin") {
    const [
      totalMotos, totalUsers, totalOrders, totalQuotes,
      pendingOrders, pendingQuotes, pendingRides,
      totalStores, totalReviews,
    ] = await Promise.all([
      Motorcycle.countDocuments({ isActive: true }),
      User.countDocuments(),
      Order.countDocuments(),
      Quote.countDocuments(),
      Order.countDocuments({ status: "pending" }),
      Quote.countDocuments({ status: "pending" }),
      TestRide.countDocuments({ status: "pending" }),
      Store.countDocuments(),
      (await import("@/models")).Review?.countDocuments() ?? 0,
    ]);

    return (
      <>
        <div className="d-flex align-items-center gap-2 mb-4">
          <FaChartLine size={22} />
          <h2 className="mb-0">Tableau de bord — Administrateur</h2>
        </div>

        {/* Stats principales */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-lg-3"><StatCard label="Motos en catalogue" value={totalMotos} icon={<FaMotorcycle />} color="danger" href="/admin/motos" /></div>
          <div className="col-6 col-lg-3"><StatCard label="Utilisateurs" value={totalUsers} icon={<FaUsers />} color="primary" href="/admin/users" /></div>
          <div className="col-6 col-lg-3"><StatCard label="Commandes totales" value={totalOrders} icon={<FaShoppingCart />} color="success" href="/admin/orders" /></div>
          <div className="col-6 col-lg-3"><StatCard label="Devis totaux" value={totalQuotes} icon={<FaFileInvoice />} color="info" href="/admin/quotes" /></div>
        </div>

        {/* En attente */}
        <h5 className="mb-3 text-muted">
          <FaClock className="me-2" />En attente de traitement
        </h5>
        <div className="row g-3 mb-4">
          <div className="col-12 col-md-4"><StatCard label="Commandes en attente" value={pendingOrders} icon={<FaShoppingCart />} color="warning" href="/admin/orders" /></div>
          <div className="col-12 col-md-4"><StatCard label="Devis en attente" value={pendingQuotes} icon={<FaFileInvoice />} color="warning" href="/admin/quotes" /></div>
          <div className="col-12 col-md-4"><StatCard label="Essais en attente" value={pendingRides} icon={<FaCalendarAlt />} color="warning" href="/admin/test-rides" /></div>
        </div>

        {/* Raccourcis */}
        <h5 className="mb-3 text-muted"><FaCog className="me-2" />Gestion</h5>
        <div className="row g-3">
          <div className="col-6 col-md-4 col-lg-3"><ShortcutCard href="/admin/stores" icon={<FaStore />} label="Magasins" count={totalStores} color="secondary" /></div>
          <div className="col-6 col-md-4 col-lg-3"><ShortcutCard href="/admin/reviews" icon={<FaComments />} label="Avis clients" count={totalReviews} color="secondary" /></div>
          <div className="col-6 col-md-4 col-lg-3"><ShortcutCard href="/admin/brands" icon={<FaCog />} label="Marques" count={0} color="secondary" /></div>
          <div className="col-6 col-md-4 col-lg-3"><ShortcutCard href="/admin/categories" icon={<FaCog />} label="Catégories" count={0} color="secondary" /></div>
        </div>
      </>
    );
  }

  // ── COMMERCIAL (sales) ────────────────────────────────────────────────────
  if (role === "sales") {
    const [
      pendingQuotes, confirmedQuotes, totalQuotes,
      pendingRides, totalRides,
      pendingOrders, totalMotos,
    ] = await Promise.all([
      Quote.countDocuments({ status: "pending" }),
      Quote.countDocuments({ status: "confirmed" }),
      Quote.countDocuments(),
      TestRide.countDocuments({ status: "pending" }),
      TestRide.countDocuments(),
      Order.countDocuments({ status: "pending" }),
      Motorcycle.countDocuments({ isActive: true }),
    ]);

    return (
      <>
        <div className="d-flex align-items-center gap-2 mb-4">
          <FaFileInvoice size={22} />
          <h2 className="mb-0">Tableau de bord — Commercial</h2>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-6 col-lg-3"><StatCard label="Devis en attente" value={pendingQuotes} icon={<FaClock />} color="warning" href="/admin/quotes" /></div>
          <div className="col-6 col-lg-3"><StatCard label="Devis confirmés" value={confirmedQuotes} icon={<FaCheckCircle />} color="success" href="/admin/quotes" /></div>
          <div className="col-6 col-lg-3"><StatCard label="Total devis" value={totalQuotes} icon={<FaFileInvoice />} color="primary" href="/admin/quotes" /></div>
          <div className="col-6 col-lg-3"><StatCard label="Motos disponibles" value={totalMotos} icon={<FaMotorcycle />} color="info" href="/admin/motos" /></div>
        </div>

        <h5 className="mb-3 text-muted"><FaCalendarAlt className="me-2" />Essais moto</h5>
        <div className="row g-3 mb-4">
          <div className="col-12 col-md-4"><StatCard label="Essais en attente" value={pendingRides} icon={<FaClock />} color="warning" href="/admin/test-rides" /></div>
          <div className="col-12 col-md-4"><StatCard label="Total essais" value={totalRides} icon={<FaCalendarAlt />} color="primary" href="/admin/test-rides" /></div>
          <div className="col-12 col-md-4"><StatCard label="Commandes en attente" value={pendingOrders} icon={<FaShoppingCart />} color="danger" href="/admin/orders" /></div>
        </div>

        <h5 className="mb-3 text-muted">Accès rapide</h5>
        <div className="row g-3">
          <div className="col-12 col-md-4"><ShortcutCard href="/admin/quotes" icon={<FaFileInvoice />} label="Gérer les devis" count={pendingQuotes} color="warning" /></div>
          <div className="col-12 col-md-4"><ShortcutCard href="/admin/test-rides" icon={<FaCalendarAlt />} label="Gérer les essais" count={pendingRides} color="warning" /></div>
          <div className="col-12 col-md-4"><ShortcutCard href="/admin/motos" icon={<FaMotorcycle />} label="Catalogue motos" count={totalMotos} color="primary" /></div>
        </div>
      </>
    );
  }

  // ── MAGASINIER (warehouse) ────────────────────────────────────────────────
  if (role === "warehouse") {
    const [
      pendingOrders, processingOrders, shippedOrders, totalOrders,
      totalMotos, totalStores,
    ] = await Promise.all([
      Order.countDocuments({ status: "pending" }),
      Order.countDocuments({ status: "processing" }),
      Order.countDocuments({ status: "shipped" }),
      Order.countDocuments(),
      Motorcycle.countDocuments({ isActive: true }),
      Store.countDocuments(),
    ]);

    return (
      <>
        <div className="d-flex align-items-center gap-2 mb-4">
          <FaWarehouse size={22} />
          <h2 className="mb-0">Tableau de bord — Magasinier</h2>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-6 col-lg-3"><StatCard label="Commandes en attente" value={pendingOrders} icon={<FaClock />} color="warning" href="/admin/orders" /></div>
          <div className="col-6 col-lg-3"><StatCard label="En traitement" value={processingOrders} icon={<FaCheckCircle />} color="primary" href="/admin/orders" /></div>
          <div className="col-6 col-lg-3"><StatCard label="Expédiées" value={shippedOrders} icon={<FaShoppingCart />} color="success" href="/admin/orders" /></div>
          <div className="col-6 col-lg-3"><StatCard label="Total commandes" value={totalOrders} icon={<FaShoppingCart />} color="info" href="/admin/orders" /></div>
        </div>

        <h5 className="mb-3 text-muted"><FaMotorcycle className="me-2" />Stock</h5>
        <div className="row g-3 mb-4">
          <div className="col-12 col-md-6"><StatCard label="Motos en catalogue" value={totalMotos} icon={<FaMotorcycle />} color="danger" href="/admin/motos" /></div>
          <div className="col-12 col-md-6"><StatCard label="Points de vente" value={totalStores} icon={<FaStore />} color="secondary" href="/admin/stores" /></div>
        </div>

        <h5 className="mb-3 text-muted">Accès rapide</h5>
        <div className="row g-3">
          <div className="col-12 col-md-4"><ShortcutCard href="/admin/orders" icon={<FaShoppingCart />} label="Traiter commandes" count={pendingOrders} color="warning" /></div>
          <div className="col-12 col-md-4"><ShortcutCard href="/admin/motos" icon={<FaMotorcycle />} label="Gérer le stock" count={totalMotos} color="primary" /></div>
          <div className="col-12 col-md-4"><ShortcutCard href="/admin/stores" icon={<FaStore />} label="Magasins" count={totalStores} color="secondary" /></div>
        </div>
      </>
    );
  }

  // Fallback (ne devrait pas arriver grâce au layout)
  redirect("/login");
}
