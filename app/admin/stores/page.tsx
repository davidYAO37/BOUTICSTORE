"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Button, Table, Badge, Form, Pagination, InputGroup,
  Row, Col, Card, Spinner, Modal,
} from "react-bootstrap";
import {
  FaPlus, FaEdit, FaTrash, FaSearch, FaStore,
  FaPhone, FaMapMarkerAlt, FaEye, FaToggleOn, FaToggleOff,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { getStores, deleteStore, updateStore } from "@/services/api";

interface StoreAdmin {
  _id: string;
  name: { fr: string; en: string };
  city: string;
  phone: string;
  address?: string;
  email?: string;
  openingHours?: string;
  isActive?: boolean;
}

export default function AdminStoresPage() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role || "admin";
  const isWarehouse = role === "warehouse";

  const [items, setItems]           = useState<StoreAdmin[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [detail, setDetail]         = useState<StoreAdmin | null>(null);
  const [toggling, setToggling]     = useState<string | null>(null);

  const loadStores = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getStores({ page, limit: 15, search, admin: true });
      setItems(data.data || []);
      setTotalPages(data.meta?.totalPages || 1);
    } catch {
      toast.error("Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { loadStores(); }, [loadStores]);

  const handleToggleActive = async (item: StoreAdmin) => {
    setToggling(item._id);
    try {
      await updateStore(item._id, { isActive: !item.isActive });
      toast.success(`Magasin ${!item.isActive ? "activé" : "désactivé"}`);
      loadStores();
    } catch {
      toast.error("Erreur de mise à jour");
    } finally {
      setToggling(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Supprimer ce magasin définitivement ?")) return;
    try {
      await deleteStore(id);
      toast.success("Magasin supprimé");
      loadStores();
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  const activeCount   = items.filter((s) => s.isActive).length;
  const inactiveCount = items.filter((s) => !s.isActive).length;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 d-flex align-items-center gap-2">
          <FaStore /> Gestion des magasins
        </h2>
        {!isWarehouse && (
          <Link href="/admin/stores/new" className="btn btn-primary d-flex align-items-center gap-2">
            <FaPlus /> Ajouter un magasin
          </Link>
        )}
      </div>

      {/* Stats */}
      <Row className="g-3 mb-4">
        <Col xs={6} md={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center gap-3 py-3">
              <div className="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white"
                style={{ width: 44, height: 44, flexShrink: 0 }}><FaStore /></div>
              <div>
                <div className="text-muted small">Total magasins</div>
                <div className="h5 fw-bold mb-0">{items.length}</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center gap-3 py-3">
              <div className="rounded-circle d-flex align-items-center justify-content-center bg-success text-white"
                style={{ width: 44, height: 44, flexShrink: 0 }}><FaToggleOn /></div>
              <div>
                <div className="text-muted small">Actifs</div>
                <div className="h5 fw-bold mb-0">{activeCount}</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center gap-3 py-3">
              <div className="rounded-circle d-flex align-items-center justify-content-center bg-danger text-white"
                style={{ width: 44, height: 44, flexShrink: 0 }}><FaToggleOff /></div>
              <div>
                <div className="text-muted small">Inactifs</div>
                <div className="h5 fw-bold mb-0">{inactiveCount}</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filtre */}
      <div className="d-flex gap-2 mb-3">
        <InputGroup style={{ maxWidth: 320 }}>
          <InputGroup.Text><FaSearch /></InputGroup.Text>
          <Form.Control type="search" placeholder="Nom, ville..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </InputGroup>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-5 text-muted">Aucun magasin trouvé</div>
      ) : (
        <>
          <Table responsive hover className="bg-white shadow-sm rounded align-middle">
            <thead className="table-light">
              <tr>
                <th>Nom</th>
                <th>Ville</th>
                <th>Téléphone</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  <td>
                    <div className="fw-semibold">{item.name?.fr || "—"}</div>
                    {item.name?.en && item.name.en !== item.name.fr && (
                      <small className="text-muted">{item.name.en}</small>
                    )}
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-1">
                      <FaMapMarkerAlt className="text-muted" size={12} />
                      {item.city || "—"}
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-1">
                      <FaPhone className="text-muted" size={12} />
                      {item.phone || "—"}
                    </div>
                  </td>
                  <td>
                    {toggling === item._id ? (
                      <Spinner size="sm" />
                    ) : (
                      <div
                        style={{ cursor: "pointer" }}
                        onClick={() => handleToggleActive(item)}
                        title={item.isActive ? "Cliquer pour désactiver" : "Cliquer pour activer"}
                      >
                        {item.isActive
                          ? <Badge bg="success" className="d-flex align-items-center gap-1 w-fit"><FaToggleOn /> Actif</Badge>
                          : <Badge bg="danger" className="d-flex align-items-center gap-1 w-fit"><FaToggleOff /> Inactif</Badge>
                        }
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <Button variant="outline-primary" size="sm" title="Voir détails"
                        onClick={() => setDetail(item)}>
                        <FaEye />
                      </Button>
                      {!isWarehouse && (
                        <Link href={`/admin/stores/${item._id}`}
                          className="btn btn-sm btn-outline-secondary" title="Modifier">
                          <FaEdit />
                        </Link>
                      )}
                      {!isWarehouse && (
                        <Button variant="outline-danger" size="sm" title="Supprimer"
                          onClick={() => handleDelete(item._id)}>
                          <FaTrash />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
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

      {/* Modal détail magasin */}
      <Modal show={!!detail} onHide={() => setDetail(null)}>
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center gap-2">
            <FaStore /> {detail?.name?.fr}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {detail && (
            <dl className="row mb-0">
              <dt className="col-4">Nom (FR)</dt>
              <dd className="col-8">{detail.name?.fr || "—"}</dd>
              <dt className="col-4">Nom (EN)</dt>
              <dd className="col-8">{detail.name?.en || "—"}</dd>
              <dt className="col-4">Ville</dt>
              <dd className="col-8">{detail.city || "—"}</dd>
              <dt className="col-4">Adresse</dt>
              <dd className="col-8">{detail.address || "—"}</dd>
              <dt className="col-4">Téléphone</dt>
              <dd className="col-8">{detail.phone || "—"}</dd>
              <dt className="col-4">Email</dt>
              <dd className="col-8">{detail.email || "—"}</dd>
              <dt className="col-4">Horaires</dt>
              <dd className="col-8">{detail.openingHours || "—"}</dd>
              <dt className="col-4">Statut</dt>
              <dd className="col-8">
                <Badge bg={detail.isActive ? "success" : "danger"}>
                  {detail.isActive ? "Actif" : "Inactif"}
                </Badge>
              </dd>
            </dl>
          )}
        </Modal.Body>
        <Modal.Footer>
          {!isWarehouse && detail && (
            <Link href={`/admin/stores/${detail._id}`} className="btn btn-primary btn-sm">
              <FaEdit className="me-1" /> Modifier
            </Link>
          )}
          <Button variant="secondary" size="sm" onClick={() => setDetail(null)}>Fermer</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
