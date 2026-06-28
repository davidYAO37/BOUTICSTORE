"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Button, Table, Badge, Form, Pagination, InputGroup,
  Row, Col, Card, Spinner,
} from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaMotorcycle, FaBoxOpen, FaExclamationTriangle } from "react-icons/fa";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { getMotorcycles, deleteMotorcycle, updateMotorcycle } from "@/services/api";
import { formatPrice } from "@/lib/utils";

interface MotoAdmin {
  _id: string; name: string; reference: string;
  price: number; currency: string; stock: number;
  availability: string; isActive: boolean;
  brand?: { name: string }; category?: { name: { fr: string } };
}

const AVAILABILITY: Record<string, { label: string; color: string }> = {
  in_stock:    { label: "En stock",      color: "success" },
  out_of_stock:{ label: "Rupture",       color: "danger"  },
  pre_order:   { label: "Précommande",   color: "info"    },
  coming_soon: { label: "Bientôt dispo", color: "warning" },
};

export default function AdminMotosPage() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role || "admin";
  const isWarehouse = role === "warehouse";

  const [motos, setMotos]           = useState<MotoAdmin[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [availFilter, setAvailFilter] = useState("");
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editStock, setEditStock]   = useState<Record<string, number>>({});
  const [savingStock, setSavingStock] = useState<string | null>(null);

  const loadMotos = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number | boolean> = { page, limit: 15, admin: true };
      if (search)      params.search       = search;
      if (availFilter) params.availability = availFilter;
      const data = await getMotorcycles(params);
      setMotos(data.data || []);
      setTotalPages(data.meta?.totalPages || 1);
    } catch {
      toast.error("Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, [page, search, availFilter]);

  useEffect(() => { loadMotos(); }, [loadMotos]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Supprimer cette moto ?")) return;
    try {
      await deleteMotorcycle(id);
      toast.success("Moto supprimée");
      loadMotos();
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleSaveStock = async (id: string) => {
    const newStock = editStock[id];
    if (newStock === undefined) return;
    setSavingStock(id);
    try {
      const avail = newStock === 0 ? "out_of_stock" : "in_stock";
      await updateMotorcycle(id, { stock: newStock, availability: avail });
      toast.success("Stock mis à jour");
      setEditStock((prev) => { const n = { ...prev }; delete n[id]; return n; });
      loadMotos();
    } catch {
      toast.error("Erreur de mise à jour");
    } finally {
      setSavingStock(null);
    }
  };

  // Stats stock
  const inStock    = motos.filter((m) => m.availability === "in_stock").length;
  const outOfStock = motos.filter((m) => m.availability === "out_of_stock").length;
  const lowStock   = motos.filter((m) => m.stock > 0 && m.stock <= 3).length;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 d-flex align-items-center gap-2"><FaMotorcycle /> Stock motos</h2>
        {!isWarehouse && (
          <Link href="/admin/motos/new" className="btn btn-primary d-flex align-items-center gap-2">
            <FaPlus /> Ajouter une moto
          </Link>
        )}
      </div>

      {/* Stats stock */}
      <Row className="g-3 mb-4">
        <Col xs={6} md={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center gap-3 py-3">
              <div className="rounded-circle d-flex align-items-center justify-content-center bg-success text-white"
                style={{ width: 44, height: 44, flexShrink: 0 }}><FaBoxOpen /></div>
              <div><div className="text-muted small">En stock</div><div className="h5 fw-bold mb-0">{inStock}</div></div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center gap-3 py-3">
              <div className="rounded-circle d-flex align-items-center justify-content-center bg-danger text-white"
                style={{ width: 44, height: 44, flexShrink: 0 }}><FaBoxOpen /></div>
              <div><div className="text-muted small">Rupture de stock</div><div className="h5 fw-bold mb-0">{outOfStock}</div></div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center gap-3 py-3">
              <div className="rounded-circle d-flex align-items-center justify-content-center bg-warning text-white"
                style={{ width: 44, height: 44, flexShrink: 0 }}><FaExclamationTriangle /></div>
              <div><div className="text-muted small">Stock faible (≤3)</div><div className="h5 fw-bold mb-0">{lowStock}</div></div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filtres */}
      <div className="d-flex gap-2 mb-3 flex-wrap">
        <InputGroup style={{ maxWidth: 300 }}>
          <InputGroup.Text><FaSearch /></InputGroup.Text>
          <Form.Control type="search" placeholder="Nom, référence..."
            value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </InputGroup>
        <Form.Select style={{ width: 200 }} value={availFilter}
          onChange={(e) => { setAvailFilter(e.target.value); setPage(1); }}>
          <option value="">Toutes disponibilités</option>
          {Object.entries(AVAILABILITY).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </Form.Select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" /></div>
      ) : motos.length === 0 ? (
        <div className="text-center py-5 text-muted">Aucune moto trouvée</div>
      ) : (
        <>
          <Table responsive hover className="bg-white shadow-sm rounded align-middle">
            <thead className="table-light">
              <tr>
                <th>Moto</th>
                <th>Référence</th>
                <th>Marque / Catégorie</th>
                <th>Prix</th>
                <th>Stock</th>
                <th>Disponibilité</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {motos.map((moto) => {
                const avail = AVAILABILITY[moto.availability] || { label: moto.availability, color: "secondary" };
                const stockVal = editStock[moto._id] !== undefined ? editStock[moto._id] : moto.stock;
                const isEditing = editStock[moto._id] !== undefined;
                return (
                  <tr key={moto._id}>
                    <td>
                      <div className="fw-semibold">{moto.name}</div>
                      {!moto.isActive && <Badge bg="secondary" className="ms-1">Inactif</Badge>}
                    </td>
                    <td className="text-muted small">{moto.reference}</td>
                    <td>
                      <div>{moto.brand?.name || "—"}</div>
                      <small className="text-muted">{moto.category?.name?.fr || "—"}</small>
                    </td>
                    <td className="fw-semibold">{formatPrice(moto.price, moto.currency)}</td>
                    <td style={{ width: 160 }}>
                      <div className="d-flex align-items-center gap-1">
                        <Form.Control
                          type="number" min={0} size="sm"
                          value={stockVal}
                          onChange={(e) => setEditStock((prev) => ({ ...prev, [moto._id]: Number(e.target.value) }))}
                          style={{ width: 70 }}
                        />
                        {isEditing && (
                          savingStock === moto._id ? <Spinner size="sm" /> : (
                            <Button size="sm" variant="success" onClick={() => handleSaveStock(moto._id)}>✓</Button>
                          )
                        )}
                      </div>
                    </td>
                    <td><Badge bg={avail.color}>{avail.label}</Badge></td>
                    <td>
                      <div className="d-flex gap-1">
                        {!isWarehouse && (
                          <Link href={`/admin/motos/${moto._id}`} className="btn btn-sm btn-outline-primary">
                            <FaEdit />
                          </Link>
                        )}
                        {!isWarehouse && (
                          <Button variant="outline-danger" size="sm" onClick={() => handleDelete(moto._id)}>
                            <FaTrash />
                          </Button>
                        )}
                        {isWarehouse && (
                          <span className="text-muted small">Modifier le stock ci-contre</span>
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
    </div>
  );
}
