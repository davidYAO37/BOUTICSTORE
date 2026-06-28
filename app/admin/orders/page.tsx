"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Button, Table, Form, Pagination, Badge, InputGroup,
  Row, Col, Card, Spinner, Modal,
} from "react-bootstrap";
import {
  FaTrash, FaSearch, FaShoppingCart, FaClock,
  FaCog, FaShippingFast, FaCheckCircle, FaTimesCircle, FaEye,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { getOrders, updateOrder, deleteOrder } from "@/services/api";
import { formatPrice } from "@/lib/utils";

interface OrderItem { motorcycle?: { name: string }; quantity: number; price: number; }
interface OrderAdmin {
  _id: string;
  user?: { firstName: string; lastName: string; email: string };
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
  shippingAddress?: { street?: string; city?: string; country?: string };
}

const STATUS: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending:    { label: "En attente",     color: "warning",   icon: <FaClock /> },
  confirmed:  { label: "Confirmée",      color: "info",      icon: <FaCheckCircle /> },
  paid:       { label: "Payée",          color: "primary",   icon: <FaCheckCircle /> },
  processing: { label: "En préparation", color: "secondary", icon: <FaCog /> },
  shipped:    { label: "Expédiée",       color: "info",      icon: <FaShippingFast /> },
  delivered:  { label: "Livrée",         color: "success",   icon: <FaCheckCircle /> },
  cancelled:  { label: "Annulée",        color: "danger",    icon: <FaTimesCircle /> },
};
const STATUS_KEYS = Object.keys(STATUS);

// Workflow magasinier : transitions autorisées
const WAREHOUSE_NEXT: Record<string, string[]> = {
  pending:    ["processing", "cancelled"],
  confirmed:  ["processing", "cancelled"],
  paid:       ["processing"],
  processing: ["shipped"],
  shipped:    ["delivered"],
  delivered:  [],
  cancelled:  [],
};

export default function AdminOrdersPage() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role || "admin";
  const isWarehouse = role === "warehouse";

  const [items, setItems]           = useState<OrderAdmin[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updating, setUpdating]     = useState<string | null>(null);
  const [detail, setDetail]         = useState<OrderAdmin | null>(null);

  // Stats locales
  const [stats, setStats] = useState<Record<string, number>>({});

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, limit: 15 };
      if (statusFilter) params.status = statusFilter;
      if (search)       params.search = search;
      const data = await getOrders(params);
      setItems(data.data || []);
      setTotalPages(data.meta?.totalPages || 1);
    } catch {
      toast.error("Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  // Charger stats globales (sans filtre)
  const loadStats = useCallback(async () => {
    try {
      const all = await getOrders({ limit: 1000 });
      const counts: Record<string, number> = {};
      (all.data || []).forEach((o: OrderAdmin) => {
        counts[o.status] = (counts[o.status] || 0) + 1;
      });
      setStats(counts);
    } catch { /* silencieux */ }
  }, []);

  useEffect(() => { loadOrders(); }, [loadOrders]);
  useEffect(() => { loadStats(); }, [loadStats]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdating(id);
    try {
      await updateOrder(id, { status: newStatus });
      toast.success(`Commande → ${STATUS[newStatus]?.label}`);
      loadOrders();
      loadStats();
    } catch {
      toast.error("Erreur de mise à jour");
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Supprimer cette commande ?")) return;
    try {
      await deleteOrder(id);
      toast.success("Commande supprimée");
      loadOrders();
      loadStats();
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  // Cartes de stats
  const statCards = [
    { key: "pending",    label: "En attente",     color: "warning" },
    { key: "processing", label: "En préparation", color: "secondary" },
    { key: "shipped",    label: "Expédiées",      color: "info" },
    { key: "delivered",  label: "Livrées",        color: "success" },
  ];

  return (
    <div>
      <h2 className="mb-4 d-flex align-items-center gap-2">
        <FaShoppingCart /> Gestion des commandes
      </h2>

      {/* Stats */}
      <Row className="g-3 mb-4">
        {statCards.map(({ key, label, color }) => (
          <Col key={key} xs={6} lg={3}>
            <Card
              className={`border-0 shadow-sm h-100 cursor-pointer ${statusFilter === key ? "border border-" + color : ""}`}
              style={{ cursor: "pointer" }}
              onClick={() => { setStatusFilter(statusFilter === key ? "" : key); setPage(1); }}
            >
              <Card.Body className="d-flex align-items-center gap-3 py-3">
                <div className={`rounded-circle d-flex align-items-center justify-content-center text-white`}
                  style={{ width: 44, height: 44, backgroundColor: `var(--bs-${color})`, flexShrink: 0 }}>
                  {STATUS[key]?.icon}
                </div>
                <div>
                  <div className="text-muted small">{label}</div>
                  <div className="fw-bold h5 mb-0">{stats[key] || 0}</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Filtres */}
      <div className="d-flex gap-2 mb-3 flex-wrap">
        <InputGroup style={{ maxWidth: 300 }}>
          <InputGroup.Text><FaSearch /></InputGroup.Text>
          <Form.Control
            type="search" placeholder="Client, email..."
            value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </InputGroup>
        <Form.Select style={{ width: 200 }} value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
          <option value="">Tous les statuts</option>
          {STATUS_KEYS.map((s) => <option key={s} value={s}>{STATUS[s].label}</option>)}
        </Form.Select>
        {statusFilter && (
          <Button variant="outline-secondary" size="sm" onClick={() => { setStatusFilter(""); setPage(1); }}>
            Réinitialiser
          </Button>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-5 text-muted">Aucune commande trouvée</div>
      ) : (
        <>
          <Table responsive hover className="bg-white shadow-sm rounded align-middle">
            <thead className="table-light">
              <tr>
                <th>Client</th>
                <th>Articles</th>
                <th>Total</th>
                <th>Statut</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const s = STATUS[item.status] || { label: item.status, color: "secondary", icon: null };
                const nextStatuses = isWarehouse
                  ? (WAREHOUSE_NEXT[item.status] || [])
                  : STATUS_KEYS.filter((k) => k !== item.status);

                return (
                  <tr key={item._id}>
                    <td>
                      <div className="fw-semibold">
                        {item.user ? `${item.user.firstName} ${item.user.lastName}` : "Anonyme"}
                      </div>
                      <small className="text-muted">{item.user?.email}</small>
                    </td>
                    <td>
                      {item.items.slice(0, 2).map((i, idx) => (
                        <div key={idx} className="small">
                          {i.motorcycle?.name || "—"} × {i.quantity}
                        </div>
                      ))}
                      {item.items.length > 2 && <small className="text-muted">+{item.items.length - 2} autre(s)</small>}
                    </td>
                    <td className="fw-bold">{formatPrice(item.total, "XOF")}</td>
                    <td>
                      <div className="d-flex flex-column gap-1">
                        <Badge bg={s.color} className="d-flex align-items-center gap-1 w-fit">
                          {s.icon} {s.label}
                        </Badge>
                        {nextStatuses.length > 0 && (
                          updating === item._id ? (
                            <Spinner size="sm" />
                          ) : (
                            <Form.Select size="sm" value={item.status}
                              onChange={(e) => handleStatusChange(item._id, e.target.value)}>
                              <option value={item.status}>Changer...</option>
                              {nextStatuses.map((st) => (
                                <option key={st} value={st}>{STATUS[st].label}</option>
                              ))}
                            </Form.Select>
                          )
                        )}
                      </div>
                    </td>
                    <td className="text-muted small">
                      {new Date(item.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button variant="outline-primary" size="sm" title="Détail"
                          onClick={() => setDetail(item)}>
                          <FaEye />
                        </Button>
                        {!isWarehouse && (
                          <Button variant="outline-danger" size="sm" title="Supprimer"
                            onClick={() => handleDelete(item._id)}>
                            <FaTrash />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>

          {totalPages > 1 && (
            <Pagination className="mt-3">
              <Pagination.Prev onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} />
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Pagination.Item key={p} active={p === page} onClick={() => setPage(p)}>{p}</Pagination.Item>
              ))}
              <Pagination.Next onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} />
            </Pagination>
          )}
        </>
      )}

      {/* Modal détail commande */}
      <Modal show={!!detail} onHide={() => setDetail(null)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Détail de la commande</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {detail && (
            <>
              <Row className="mb-3">
                <Col>
                  <strong>Client :</strong> {detail.user ? `${detail.user.firstName} ${detail.user.lastName}` : "Anonyme"}<br />
                  <strong>Email :</strong> {detail.user?.email || "—"}<br />
                  <strong>Date :</strong> {new Date(detail.createdAt).toLocaleString("fr-FR")}
                </Col>
                <Col className="text-end">
                  <Badge bg={STATUS[detail.status]?.color || "secondary"} style={{ fontSize: 14 }}>
                    {STATUS[detail.status]?.label || detail.status}
                  </Badge>
                </Col>
              </Row>
              {detail.shippingAddress && (
                <p className="text-muted small">
                  <strong>Livraison :</strong> {detail.shippingAddress.street}, {detail.shippingAddress.city}, {detail.shippingAddress.country}
                </p>
              )}
              <Table size="sm" bordered>
                <thead className="table-light">
                  <tr><th>Moto</th><th>Qté</th><th>Prix unitaire</th><th>Sous-total</th></tr>
                </thead>
                <tbody>
                  {detail.items.map((i, idx) => (
                    <tr key={idx}>
                      <td>{i.motorcycle?.name || "—"}</td>
                      <td>{i.quantity}</td>
                      <td>{formatPrice(i.price, "XOF")}</td>
                      <td>{formatPrice(i.price * i.quantity, "XOF")}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr><td colSpan={3} className="text-end fw-bold">Total</td>
                    <td className="fw-bold">{formatPrice(detail.total, "XOF")}</td></tr>
                </tfoot>
              </Table>
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}
