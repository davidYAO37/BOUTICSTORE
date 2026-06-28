"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Button, Table, Form, Pagination, Badge, InputGroup,
  Row, Col, Card, Spinner, Modal,
} from "react-bootstrap";
import {
  FaTrash, FaSearch, FaFileInvoice, FaClock,
  FaCheckCircle, FaTimesCircle, FaPaperPlane, FaEye, FaCog,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { getQuotes, updateQuote, deleteQuote } from "@/services/api";

interface QuoteAdmin {
  _id: string;
  firstName: string; lastName: string;
  email: string; phone: string;
  motorcycle?: { name: string };
  message?: string;
  status: string; createdAt: string;
}

const STATUS: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending:    { label: "En attente", color: "warning",   icon: <FaClock /> },
  processing: { label: "En cours",   color: "info",      icon: <FaCog /> },
  sent:       { label: "Envoyé",     color: "primary",   icon: <FaPaperPlane /> },
  accepted:   { label: "Accepté",    color: "success",   icon: <FaCheckCircle /> },
  rejected:   { label: "Refusé",     color: "danger",    icon: <FaTimesCircle /> },
};
const STATUS_KEYS = Object.keys(STATUS);

// Workflow commercial : transitions autorisées
const SALES_NEXT: Record<string, string[]> = {
  pending:    ["processing"],
  processing: ["sent"],
  sent:       ["accepted", "rejected"],
  accepted:   [],
  rejected:   [],
};

export default function AdminQuotesPage() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role || "admin";
  const isSales = role === "sales";

  const [items, setItems]               = useState<QuoteAdmin[]>([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage]                 = useState(1);
  const [totalPages, setTotalPages]     = useState(1);
  const [updating, setUpdating]         = useState<string | null>(null);
  const [detail, setDetail]             = useState<QuoteAdmin | null>(null);
  const [stats, setStats]               = useState<Record<string, number>>({});

  const loadQuotes = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, limit: 15 };
      if (statusFilter) params.status = statusFilter;
      if (search)       params.search = search;
      const data = await getQuotes(params);
      setItems(data.data || []);
      setTotalPages(data.meta?.totalPages || 1);
    } catch {
      toast.error("Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  const loadStats = useCallback(async () => {
    try {
      const all = await getQuotes({ limit: 1000 });
      const counts: Record<string, number> = {};
      (all.data || []).forEach((q: QuoteAdmin) => {
        counts[q.status] = (counts[q.status] || 0) + 1;
      });
      setStats(counts);
    } catch { /* silencieux */ }
  }, []);

  useEffect(() => { loadQuotes(); }, [loadQuotes]);
  useEffect(() => { loadStats(); }, [loadStats]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdating(id);
    try {
      await updateQuote(id, { status: newStatus });
      toast.success(`Devis → ${STATUS[newStatus]?.label}`);
      loadQuotes(); loadStats();
    } catch {
      toast.error("Erreur de mise à jour");
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Supprimer ce devis ?")) return;
    try {
      await deleteQuote(id);
      toast.success("Devis supprimé");
      loadQuotes(); loadStats();
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  const statCards = [
    { key: "pending",    label: "En attente", color: "warning" },
    { key: "processing", label: "En cours",   color: "info" },
    { key: "sent",       label: "Envoyés",    color: "primary" },
    { key: "accepted",   label: "Acceptés",   color: "success" },
  ];

  return (
    <div>
      <h2 className="mb-4 d-flex align-items-center gap-2">
        <FaFileInvoice /> Gestion des devis
      </h2>

      {/* Stats */}
      <Row className="g-3 mb-4">
        {statCards.map(({ key, label, color }) => (
          <Col key={key} xs={6} lg={3}>
            <Card
              className="border-0 shadow-sm h-100"
              style={{ cursor: "pointer", outline: statusFilter === key ? `2px solid var(--bs-${color})` : "none" }}
              onClick={() => { setStatusFilter(statusFilter === key ? "" : key); setPage(1); }}
            >
              <Card.Body className="d-flex align-items-center gap-3 py-3">
                <div className="rounded-circle d-flex align-items-center justify-content-center text-white flex-shrink-0"
                  style={{ width: 44, height: 44, backgroundColor: `var(--bs-${color})` }}>
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
          <Form.Control type="search" placeholder="Nom, email..."
            value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </InputGroup>
        <Form.Select style={{ width: 200 }} value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
          <option value="">Tous les statuts</option>
          {STATUS_KEYS.map((s) => <option key={s} value={s}>{STATUS[s].label}</option>)}
        </Form.Select>
        {statusFilter && (
          <Button variant="outline-secondary" size="sm"
            onClick={() => { setStatusFilter(""); setPage(1); }}>
            Réinitialiser
          </Button>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-5 text-muted">Aucun devis trouvé</div>
      ) : (
        <>
          <Table responsive hover className="bg-white shadow-sm rounded align-middle">
            <thead className="table-light">
              <tr>
                <th>Client</th>
                <th>Téléphone</th>
                <th>Moto demandée</th>
                <th>Statut</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const s = STATUS[item.status] || { label: item.status, color: "secondary", icon: null };
                const nextStatuses = isSales
                  ? (SALES_NEXT[item.status] || [])
                  : STATUS_KEYS.filter((k) => k !== item.status);

                return (
                  <tr key={item._id}>
                    <td>
                      <div className="fw-semibold">{item.firstName} {item.lastName}</div>
                      <small className="text-muted">{item.email}</small>
                    </td>
                    <td>{item.phone}</td>
                    <td>{item.motorcycle?.name || "—"}</td>
                    <td>
                      <div className="d-flex flex-column gap-1">
                        <Badge bg={s.color} className="d-flex align-items-center gap-1 w-fit">
                          {s.icon} {s.label}
                        </Badge>
                        {nextStatuses.length > 0 && (
                          updating === item._id ? <Spinner size="sm" /> : (
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
                        {!isSales && (
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

      {/* Modal détail */}
      <Modal show={!!detail} onHide={() => setDetail(null)}>
        <Modal.Header closeButton>
          <Modal.Title><FaFileInvoice className="me-2" />Détail du devis</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {detail && (
            <dl className="row mb-0">
              <dt className="col-4">Client</dt>
              <dd className="col-8">{detail.firstName} {detail.lastName}</dd>
              <dt className="col-4">Email</dt>
              <dd className="col-8">{detail.email}</dd>
              <dt className="col-4">Téléphone</dt>
              <dd className="col-8">{detail.phone}</dd>
              <dt className="col-4">Moto</dt>
              <dd className="col-8">{detail.motorcycle?.name || "—"}</dd>
              <dt className="col-4">Statut</dt>
              <dd className="col-8">
                <Badge bg={STATUS[detail.status]?.color || "secondary"}>
                  {STATUS[detail.status]?.label || detail.status}
                </Badge>
              </dd>
              <dt className="col-4">Date</dt>
              <dd className="col-8">{new Date(detail.createdAt).toLocaleString("fr-FR")}</dd>
              {detail.message && <>
                <dt className="col-4">Message</dt>
                <dd className="col-8 fst-italic text-muted">{detail.message}</dd>
              </>}
            </dl>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={() => setDetail(null)}>Fermer</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
