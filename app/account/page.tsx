"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Container, Row, Col, Card, Tab, Nav, Badge, Table,
  Button, Form, Spinner, Modal,
} from "react-bootstrap";
import {
  FaUser, FaShoppingCart, FaFileInvoice, FaCalendarAlt,
  FaHeart, FaEdit, FaSave, FaTimes, FaSignOutAlt,
  FaMotorcycle, FaMapMarkerAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { getOrders, getQuotes, getTestRides } from "@/services/api";
import { formatPrice } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────
interface OrderRow {
  _id: string; status: string; total: number; createdAt: string;
  items: Array<{ motorcycle?: { name: string }; quantity: number }>;
}
interface QuoteRow {
  _id: string; status: string; createdAt: string;
  motorcycle?: { name: string };
}
interface TestRideRow {
  _id: string; status: string; preferredDate: string; preferredTime?: string;
  motorcycle?: { name: string }; store?: { name: { fr: string }; city: string };
}

// ── Labels ────────────────────────────────────────────────────────────────────
const ORDER_STATUS: Record<string, { label: string; color: string }> = {
  pending:    { label: "En attente",     color: "warning" },
  confirmed:  { label: "Confirmée",      color: "info" },
  paid:       { label: "Payée",          color: "primary" },
  processing: { label: "En préparation", color: "secondary" },
  shipped:    { label: "Expédiée",       color: "info" },
  delivered:  { label: "Livrée",         color: "success" },
  cancelled:  { label: "Annulée",        color: "danger" },
};
const QUOTE_STATUS: Record<string, { label: string; color: string }> = {
  pending:    { label: "En attente", color: "warning" },
  processing: { label: "En cours",   color: "info" },
  sent:       { label: "Envoyé",     color: "primary" },
  accepted:   { label: "Accepté",    color: "success" },
  rejected:   { label: "Refusé",     color: "danger" },
};
const RIDE_STATUS: Record<string, { label: string; color: string }> = {
  pending:   { label: "En attente", color: "warning" },
  confirmed: { label: "Confirmé",   color: "success" },
  completed: { label: "Effectué",   color: "primary" },
  cancelled: { label: "Annulé",     color: "danger" },
};

// ── Composant principal ───────────────────────────────────────────────────────
export default function AccountPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [orders, setOrders]       = useState<OrderRow[]>([]);
  const [quotes, setQuotes]       = useState<QuoteRow[]>([]);
  const [testRides, setTestRides] = useState<TestRideRow[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Édition profil
  const [editing, setEditing]     = useState(false);
  const [saving, setSaving]       = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [phone, setPhone]         = useState("");

  // Modal déconnexion
  const [showLogout, setShowLogout] = useState(false);

  // Redirection si non connecté
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  // Pré-remplir les champs profil depuis la session
  useEffect(() => {
    if (session?.user) {
      setFirstName((session.user as any).firstName || "");
      setLastName((session.user as any).lastName || "");
      setPhone((session.user as any).phone || "");
    }
  }, [session]);

  // Charger les données client
  const loadData = useCallback(async () => {
    setLoadingData(true);
    try {
      const [o, q, r] = await Promise.all([
        getOrders({ limit: 50 }),
        getQuotes({ limit: 50 }),
        getTestRides({ limit: 50 }),
      ]);
      setOrders(o.data || []);
      setQuotes(q.data || []);
      setTestRides(r.data || []);
    } catch {
      /* silencieux */
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") loadData();
  }, [status, loadData]);

  const handleSaveProfile = async () => {
    if (!session?.user) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/users/${(session.user as any).id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, phone }),
      });
      if (!res.ok) throw new Error();
      await update({ firstName, lastName });
      toast.success("Profil mis à jour");
      setEditing(false);
    } catch {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading") {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!session?.user) return null;

  const user = session.user as any;
  const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || "?";

  return (
    <Container className="py-5">
      <Row className="g-4">
        {/* Sidebar profil */}
        <Col lg={3}>
          <Card className="border-0 shadow-sm text-center p-4 mb-3">
            <div
              className="mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
              style={{ width: 72, height: 72, fontSize: 26, backgroundColor: "var(--bs-primary)" }}
            >
              {initials}
            </div>
            <h5 className="mb-1">{user.firstName} {user.lastName}</h5>
            <div className="text-muted small mb-2">{user.email}</div>
            <Badge bg="secondary" className="mb-3">Client</Badge>
            <div className="d-grid gap-2">
              <Button variant="outline-primary" size="sm" onClick={() => setEditing(true)}>
                <FaEdit className="me-1" /> Modifier le profil
              </Button>
              <Button variant="outline-danger" size="sm" onClick={() => setShowLogout(true)}>
                <FaSignOutAlt className="me-1" /> Déconnexion
              </Button>
            </div>
          </Card>

          {/* Stats rapides */}
          <Card className="border-0 shadow-sm p-3">
            <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
              <span className="small text-muted"><FaShoppingCart className="me-1" />Commandes</span>
              <Badge bg="primary" pill>{orders.length}</Badge>
            </div>
            <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
              <span className="small text-muted"><FaFileInvoice className="me-1" />Devis</span>
              <Badge bg="info" pill>{quotes.length}</Badge>
            </div>
            <div className="d-flex justify-content-between align-items-center py-2">
              <span className="small text-muted"><FaCalendarAlt className="me-1" />Essais</span>
              <Badge bg="success" pill>{testRides.length}</Badge>
            </div>
          </Card>
        </Col>

        {/* Contenu principal */}
        <Col lg={9}>
          <Tab.Container defaultActiveKey="orders">
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-bottom px-4 pt-3 pb-0">
                <Nav variant="tabs" className="border-0">
                  <Nav.Item>
                    <Nav.Link eventKey="orders" className="d-flex align-items-center gap-2">
                      <FaShoppingCart /> Commandes
                      {orders.length > 0 && <Badge bg="primary" pill>{orders.length}</Badge>}
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="quotes" className="d-flex align-items-center gap-2">
                      <FaFileInvoice /> Devis
                      {quotes.length > 0 && <Badge bg="info" pill>{quotes.length}</Badge>}
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="rides" className="d-flex align-items-center gap-2">
                      <FaCalendarAlt /> Essais
                      {testRides.length > 0 && <Badge bg="success" pill>{testRides.length}</Badge>}
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="favorites" className="d-flex align-items-center gap-2">
                      <FaHeart /> Favoris
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Header>

              <Card.Body className="p-4">
                {loadingData ? (
                  <div className="text-center py-4"><Spinner animation="border" /></div>
                ) : (
                  <Tab.Content>
                    {/* ── COMMANDES ── */}
                    <Tab.Pane eventKey="orders">
                      {orders.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                          <FaShoppingCart size={40} className="mb-3" />
                          <p>Vous n'avez pas encore de commandes.</p>
                          <Link href="/catalog/" className="btn btn-primary btn-sm">
                            <FaMotorcycle className="me-1" /> Découvrir les motos
                          </Link>
                        </div>
                      ) : (
                        <Table responsive hover className="align-middle">
                          <thead className="table-light">
                            <tr><th>Motos</th><th>Total</th><th>Statut</th><th>Date</th></tr>
                          </thead>
                          <tbody>
                            {orders.map((o) => {
                              const s = ORDER_STATUS[o.status] || { label: o.status, color: "secondary" };
                              return (
                                <tr key={o._id}>
                                  <td>
                                    {o.items.slice(0, 2).map((i, idx) => (
                                      <div key={idx} className="small">{i.motorcycle?.name || "—"} × {i.quantity}</div>
                                    ))}
                                    {o.items.length > 2 && <small className="text-muted">+{o.items.length - 2} autre(s)</small>}
                                  </td>
                                  <td className="fw-semibold">{formatPrice(o.total, "XOF")}</td>
                                  <td><Badge bg={s.color}>{s.label}</Badge></td>
                                  <td className="text-muted small">{new Date(o.createdAt).toLocaleDateString("fr-FR")}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </Table>
                      )}
                    </Tab.Pane>

                    {/* ── DEVIS ── */}
                    <Tab.Pane eventKey="quotes">
                      {quotes.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                          <FaFileInvoice size={40} className="mb-3" />
                          <p>Vous n'avez pas encore de devis.</p>
                          <Link href="/catalog/" className="btn btn-primary btn-sm">
                            <FaMotorcycle className="me-1" /> Demander un devis
                          </Link>
                        </div>
                      ) : (
                        <Table responsive hover className="align-middle">
                          <thead className="table-light">
                            <tr><th>Moto demandée</th><th>Statut</th><th>Date</th></tr>
                          </thead>
                          <tbody>
                            {quotes.map((q) => {
                              const s = QUOTE_STATUS[q.status] || { label: q.status, color: "secondary" };
                              return (
                                <tr key={q._id}>
                                  <td className="fw-semibold">{q.motorcycle?.name || "—"}</td>
                                  <td><Badge bg={s.color}>{s.label}</Badge></td>
                                  <td className="text-muted small">{new Date(q.createdAt).toLocaleDateString("fr-FR")}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </Table>
                      )}
                    </Tab.Pane>

                    {/* ── ESSAIS ── */}
                    <Tab.Pane eventKey="rides">
                      {testRides.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                          <FaCalendarAlt size={40} className="mb-3" />
                          <p>Vous n'avez pas encore de demande d'essai.</p>
                          <Link href="/catalog/" className="btn btn-primary btn-sm">
                            <FaMotorcycle className="me-1" /> Réserver un essai
                          </Link>
                        </div>
                      ) : (
                        <Table responsive hover className="align-middle">
                          <thead className="table-light">
                            <tr><th>Moto</th><th>Magasin</th><th>Date souhaitée</th><th>Statut</th></tr>
                          </thead>
                          <tbody>
                            {testRides.map((r) => {
                              const s = RIDE_STATUS[r.status] || { label: r.status, color: "secondary" };
                              return (
                                <tr key={r._id}>
                                  <td className="fw-semibold">{r.motorcycle?.name || "—"}</td>
                                  <td>
                                    {r.store ? (
                                      <span className="d-flex align-items-center gap-1 small">
                                        <FaMapMarkerAlt className="text-muted" />
                                        {r.store.name?.fr || r.store.city}
                                      </span>
                                    ) : "—"}
                                  </td>
                                  <td className="small">
                                    <div>{new Date(r.preferredDate).toLocaleDateString("fr-FR")}</div>
                                    {r.preferredTime && <div className="text-muted">{r.preferredTime}</div>}
                                  </td>
                                  <td><Badge bg={s.color}>{s.label}</Badge></td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </Table>
                      )}
                    </Tab.Pane>

                    {/* ── FAVORIS ── */}
                    <Tab.Pane eventKey="favorites">
                      <div className="text-center py-5 text-muted">
                        <FaHeart size={40} className="mb-3" />
                        <p>Retrouvez vos motos favorites.</p>
                        <Link href="/favorites/" className="btn btn-outline-primary btn-sm">
                          Voir mes favoris
                        </Link>
                      </div>
                    </Tab.Pane>
                  </Tab.Content>
                )}
              </Card.Body>
            </Card>
          </Tab.Container>
        </Col>
      </Row>

      {/* Modal modifier profil */}
      <Modal show={editing} onHide={() => setEditing(false)}>
        <Modal.Header closeButton>
          <Modal.Title><FaUser className="me-2" />Modifier mon profil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="g-3">
              <Col xs={6}>
                <Form.Label>Prénom</Form.Label>
                <Form.Control value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </Col>
              <Col xs={6}>
                <Form.Label>Nom</Form.Label>
                <Form.Control value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </Col>
              <Col xs={12}>
                <Form.Label>Téléphone</Form.Label>
                <Form.Control value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+225 07 00 00 00 00" />
              </Col>
              <Col xs={12}>
                <Form.Label>Email</Form.Label>
                <Form.Control value={user.email || ""} disabled className="bg-light" />
                <Form.Text className="text-muted">L'email ne peut pas être modifié.</Form.Text>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditing(false)}>
            <FaTimes className="me-1" /> Annuler
          </Button>
          <Button variant="primary" onClick={handleSaveProfile} disabled={saving}>
            {saving ? <Spinner size="sm" /> : <><FaSave className="me-1" /> Enregistrer</>}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal déconnexion */}
      <Modal show={showLogout} onHide={() => setShowLogout(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Déconnexion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Êtes-vous sûr de vouloir vous déconnecter ?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLogout(false)}>Annuler</Button>
          <Button variant="danger" onClick={() => signOut({ callbackUrl: "/" })}>
            <FaSignOutAlt className="me-1" /> Se déconnecter
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
