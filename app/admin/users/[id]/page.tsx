"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Button, Card, Row, Col, Badge, Alert, Tabs, Tab,
  Table, Form, Modal, Spinner,
} from "react-bootstrap";
import {
  FaArrowLeft, FaEdit, FaTrash, FaUser, FaEnvelope,
  FaPhone, FaCalendarAlt, FaShieldAlt, FaShoppingCart,
  FaFileInvoice, FaMotorcycle, FaHeart, FaKey,
  FaUserShield, FaUserTie, FaUserCog, FaUsers,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { updateUser, deleteUser, getOrders, getQuotes, getTestRides } from "@/services/api";
import { formatPrice } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────
interface UserDetail {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  isActive: boolean;
  emailVerified: boolean;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  addresses?: Array<{ label: string; street: string; city: string; country: string }>;
  favorites?: Array<{ _id: string; name: string; thumbnail?: string }>;
}

interface OrderRow {
  _id: string;
  total: number;
  status: string;
  createdAt: string;
  items: Array<{ motorcycle?: { name: string }; quantity: number; price: number }>;
}
interface QuoteRow {
  _id: string;
  motorcycle?: { name: string };
  status: string;
  createdAt: string;
}
interface TestRideRow {
  _id: string;
  motorcycle?: { name: string };
  preferredDate: string;
  status: string;
  createdAt: string;
}

// ── Constantes ────────────────────────────────────────────────────────────────
const ROLES: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  admin:     { label: "Administrateur", color: "danger",    icon: <FaUserShield /> },
  sales:     { label: "Commercial",     color: "primary",   icon: <FaUserTie /> },
  warehouse: { label: "Magasinier",     color: "warning",   icon: <FaUserCog /> },
  customer:  { label: "Client",         color: "secondary", icon: <FaUsers /> },
};

const ORDER_STATUS: Record<string, { label: string; color: string }> = {
  pending:    { label: "En attente",      color: "warning" },
  confirmed:  { label: "Confirmée",       color: "info" },
  paid:       { label: "Payée",           color: "primary" },
  processing: { label: "En préparation",  color: "secondary" },
  shipped:    { label: "Expédiée",        color: "info" },
  delivered:  { label: "Livrée",          color: "success" },
  cancelled:  { label: "Annulée",         color: "danger" },
};

const QUOTE_STATUS: Record<string, { label: string; color: string }> = {
  pending:    { label: "En attente",  color: "warning" },
  processing: { label: "En cours",   color: "info" },
  sent:       { label: "Envoyé",     color: "primary" },
  accepted:   { label: "Accepté",    color: "success" },
  rejected:   { label: "Refusé",     color: "danger" },
};

const RIDE_STATUS: Record<string, { label: string; color: string }> = {
  pending:   { label: "En attente", color: "warning" },
  confirmed: { label: "Confirmé",  color: "success" },
  cancelled: { label: "Annulé",    color: "danger" },
  completed: { label: "Effectué",  color: "primary" },
};

// ── Composant ─────────────────────────────────────────────────────────────────
export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [user, setUser]       = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders]   = useState<OrderRow[]>([]);
  const [quotes, setQuotes]   = useState<QuoteRow[]>([]);
  const [testRides, setTestRides] = useState<TestRideRow[]>([]);

  // Modal Modifier
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState({ role: "", isActive: true, phone: "" });
  const [saving, setSaving]     = useState(false);

  // Modal Mot de passe
  const [showPwd, setShowPwd]     = useState(false);
  const [pwdForm, setPwdForm]     = useState({ password: "", confirm: "" });
  const [savingPwd, setSavingPwd] = useState(false);

  // ── Chargement ──────────────────────────────────────────────────────────────
  const loadUser = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch(`/api/users/${id}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Erreur");
      setUser(json.data);
    } catch {
      toast.error("Impossible de charger l'utilisateur");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const loadActivity = useCallback(async () => {
    try {
      const [o, q, r] = await Promise.all([
        getOrders({ user: id, limit: 100 }),
        getQuotes({ user: id, limit: 100 }),
        getTestRides({ user: id, limit: 100 }),
      ]);
      setOrders(o.data || []);
      setQuotes(q.data || []);
      setTestRides(r.data || []);
    } catch { /* silencieux */ }
  }, [id]);

  useEffect(() => { loadUser(); loadActivity(); }, [loadUser, loadActivity]);

  // ── Actions ─────────────────────────────────────────────────────────────────
  const openEdit = () => {
    if (!user) return;
    setEditForm({ role: user.role, isActive: user.isActive, phone: user.phone || "" });
    setShowEdit(true);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateUser(user._id, { role: editForm.role, isActive: editForm.isActive, phone: editForm.phone });
      toast.success("Profil mis à jour");
      setShowEdit(false);
      loadUser();
    } catch {
      toast.error("Erreur lors de la mise à jour");
    } finally { setSaving(false); }
  };

  const handleResetPwd = async () => {
    if (!user) return;
    if (!pwdForm.password || pwdForm.password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères"); return;
    }
    if (pwdForm.password !== pwdForm.confirm) {
      toast.error("Les mots de passe ne correspondent pas"); return;
    }
    setSavingPwd(true);
    try {
      await updateUser(user._id, { password: pwdForm.password });
      toast.success("Mot de passe réinitialisé");
      setShowPwd(false);
      setPwdForm({ password: "", confirm: "" });
    } catch {
      toast.error("Erreur");
    } finally { setSavingPwd(false); }
  };

  const handleDelete = async () => {
    if (!user) return;
    if (!window.confirm(`Supprimer définitivement ${user.firstName} ${user.lastName} ?`)) return;
    try {
      await deleteUser(user._id);
      toast.success("Utilisateur supprimé");
      router.push("/admin/users");
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  const toggleActive = async () => {
    if (!user) return;
    try {
      await updateUser(user._id, { isActive: !user.isActive });
      toast.success(user.isActive ? "Compte désactivé" : "Compte activé");
      loadUser();
    } catch { toast.error("Erreur"); }
  };

  // ── Rendu ────────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="text-center py-5">
      <Spinner animation="border" variant="primary" />
      <p className="mt-3 text-muted">Chargement du profil...</p>
    </div>
  );

  if (!user) return <Alert variant="danger">Utilisateur introuvable</Alert>;

  const role = ROLES[user.role] || { label: user.role, color: "secondary", icon: <FaUser /> };

  return (
    <div>
      {/* En-tête */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div className="d-flex align-items-center gap-3">
          <Button variant="outline-secondary" size="sm" onClick={() => router.push("/admin/users")}>
            <FaArrowLeft /> Retour
          </Button>
          <div>
            <h2 className="mb-0">{user.firstName} {user.lastName}</h2>
            <small className="text-muted">{user.email}</small>
          </div>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <Button variant={user.isActive ? "outline-warning" : "outline-success"} size="sm" onClick={toggleActive}>
            {user.isActive ? "Désactiver le compte" : "Activer le compte"}
          </Button>
          <Button variant="outline-warning" size="sm" onClick={() => { setPwdForm({ password: "", confirm: "" }); setShowPwd(true); }}>
            <FaKey /> Mot de passe
          </Button>
          <Button variant="outline-primary" size="sm" onClick={openEdit}>
            <FaEdit /> Modifier
          </Button>
          <Button variant="outline-danger" size="sm" onClick={handleDelete}>
            <FaTrash /> Supprimer
          </Button>
        </div>
      </div>

      <Row className="g-4">
        {/* ── Colonne gauche — Profil ── */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center pb-3">
              <div
                className={`mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center text-white fw-bold bg-${role.color}`}
                style={{ width: 80, height: 80, fontSize: 30 }}
              >
                {user.firstName[0]}{user.lastName[0]}
              </div>
              <h5 className="mb-1">{user.firstName} {user.lastName}</h5>
              <div className="d-flex justify-content-center gap-1 flex-wrap">
                <Badge bg={user.isActive ? "success" : "secondary"}>
                  {user.isActive ? "✓ Actif" : "✗ Inactif"}
                </Badge>
                <Badge bg={role.color}>{role.label}</Badge>
                {user.emailVerified && <Badge bg="info">Email vérifié</Badge>}
              </div>
            </Card.Body>
            <hr className="my-0" />
            <Card.Body>
              <ul className="list-unstyled mb-0 small">
                <li className="d-flex align-items-start gap-2 mb-2">
                  <FaEnvelope className="text-muted mt-1 flex-shrink-0" />
                  <span className="text-break">{user.email}</span>
                </li>
                {user.phone ? (
                  <li className="d-flex align-items-center gap-2 mb-2">
                    <FaPhone className="text-muted flex-shrink-0" />
                    <span>{user.phone}</span>
                  </li>
                ) : (
                  <li className="d-flex align-items-center gap-2 mb-2 text-muted">
                    <FaPhone className="flex-shrink-0" />
                    <em>Téléphone non renseigné</em>
                  </li>
                )}
                <li className="d-flex align-items-center gap-2 mb-2">
                  <FaShieldAlt className="text-muted flex-shrink-0" />
                  Rôle : <strong className="ms-1">{role.label}</strong>
                </li>
                <li className="d-flex align-items-center gap-2 mb-2">
                  <FaUser className="text-muted flex-shrink-0" />
                  ID : <code className="small ms-1">{user._id.slice(-8)}</code>
                </li>
                <li className="d-flex align-items-center gap-2">
                  <FaCalendarAlt className="text-muted flex-shrink-0" />
                  <span>
                    Inscrit le {new Date(user.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}
                  </span>
                </li>
              </ul>
            </Card.Body>
          </Card>

          {/* Statistiques rapides */}
          <Row className="g-3 mt-1">
            {[
              { label: "Commandes", value: orders.length,       icon: <FaShoppingCart />, color: "primary" },
              { label: "Devis",     value: quotes.length,       icon: <FaFileInvoice />,  color: "warning" },
              { label: "Essais",    value: testRides.length,    icon: <FaMotorcycle />,   color: "info" },
              { label: "Favoris",   value: user.favorites?.length || 0, icon: <FaHeart />, color: "danger" },
            ].map((s) => (
              <Col xs={6} key={s.label}>
                <Card className="border-0 shadow-sm text-center py-3">
                  <div className={`text-${s.color} mb-1`} style={{ fontSize: 22 }}>{s.icon}</div>
                  <div className="fw-bold fs-5">{s.value}</div>
                  <div className="text-muted small">{s.label}</div>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Adresses */}
          {(user.addresses?.length ?? 0) > 0 && (
            <Card className="border-0 shadow-sm mt-3">
              <Card.Header className="bg-transparent fw-semibold">
                Adresses enregistrées
              </Card.Header>
              <Card.Body className="small">
                {user.addresses!.map((a, i) => (
                  <div key={i} className={`pb-2 ${i < user.addresses!.length - 1 ? "mb-2 border-bottom" : ""}`}>
                    <strong>{a.label}</strong><br />
                    {a.street}<br />
                    {a.city} — <span className="text-muted">{a.country}</span>
                  </div>
                ))}
              </Card.Body>
            </Card>
          )}
        </Col>

        {/* ── Colonne droite — Activité ── */}
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <Tabs defaultActiveKey="orders" className="mb-3">

                {/* Commandes */}
                <Tab eventKey="orders" title={<span><FaShoppingCart className="me-1" />Commandes ({orders.length})</span>}>
                  {orders.length === 0 ? (
                    <Alert variant="light" className="text-muted text-center py-4">Aucune commande enregistrée</Alert>
                  ) : (
                    <Table responsive hover size="sm" className="align-middle mb-0">
                      <thead className="table-light">
                        <tr><th>Motos commandées</th><th>Total</th><th>Statut</th><th>Date</th></tr>
                      </thead>
                      <tbody>
                        {orders.map((o) => {
                          const s = ORDER_STATUS[o.status] || { label: o.status, color: "secondary" };
                          return (
                            <tr key={o._id}>
                              <td>{o.items.map((i) => i.motorcycle?.name || "—").join(", ")}</td>
                              <td className="fw-semibold">{formatPrice(o.total, "XOF")}</td>
                              <td><Badge bg={s.color}>{s.label}</Badge></td>
                              <td className="text-muted small">{new Date(o.createdAt).toLocaleDateString("fr-FR")}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  )}
                </Tab>

                {/* Devis */}
                <Tab eventKey="quotes" title={<span><FaFileInvoice className="me-1" />Devis ({quotes.length})</span>}>
                  {quotes.length === 0 ? (
                    <Alert variant="light" className="text-muted text-center py-4">Aucun devis demandé</Alert>
                  ) : (
                    <Table responsive hover size="sm" className="align-middle mb-0">
                      <thead className="table-light">
                        <tr><th>Moto</th><th>Statut</th><th>Date</th></tr>
                      </thead>
                      <tbody>
                        {quotes.map((q) => {
                          const s = QUOTE_STATUS[q.status] || { label: q.status, color: "secondary" };
                          return (
                            <tr key={q._id}>
                              <td>{q.motorcycle?.name || "—"}</td>
                              <td><Badge bg={s.color}>{s.label}</Badge></td>
                              <td className="text-muted small">{new Date(q.createdAt).toLocaleDateString("fr-FR")}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  )}
                </Tab>

                {/* Essais */}
                <Tab eventKey="testrides" title={<span><FaMotorcycle className="me-1" />Essais ({testRides.length})</span>}>
                  {testRides.length === 0 ? (
                    <Alert variant="light" className="text-muted text-center py-4">Aucune demande d&apos;essai</Alert>
                  ) : (
                    <Table responsive hover size="sm" className="align-middle mb-0">
                      <thead className="table-light">
                        <tr><th>Moto</th><th>Date souhaitée</th><th>Statut</th></tr>
                      </thead>
                      <tbody>
                        {testRides.map((r) => {
                          const s = RIDE_STATUS[r.status] || { label: r.status, color: "secondary" };
                          return (
                            <tr key={r._id}>
                              <td>{r.motorcycle?.name || "—"}</td>
                              <td className="text-muted small">{new Date(r.preferredDate).toLocaleDateString("fr-FR")}</td>
                              <td><Badge bg={s.color}>{s.label}</Badge></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  )}
                </Tab>

                {/* Favoris */}
                <Tab eventKey="favorites" title={<span><FaHeart className="me-1" />Favoris ({user.favorites?.length || 0})</span>}>
                  {!user.favorites?.length ? (
                    <Alert variant="light" className="text-muted text-center py-4">Aucun favori enregistré</Alert>
                  ) : (
                    <div className="d-flex flex-wrap gap-3 pt-2">
                      {user.favorites.map((f) => (
                        <div key={f._id} className="border rounded p-2 text-center shadow-sm" style={{ width: 120 }}>
                          {f.thumbnail ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={f.thumbnail} alt={f.name} className="img-fluid rounded mb-1" style={{ height: 60, objectFit: "cover", width: "100%" }} />
                          ) : (
                            <div className="d-flex align-items-center justify-content-center bg-light rounded mb-1" style={{ height: 60 }}>
                              <FaMotorcycle className="text-muted" />
                            </div>
                          )}
                          <div className="small fw-semibold text-truncate">{f.name}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </Tab>

              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ── Modal Modifier ─────────────────────────────────────────────────────── */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title><FaEdit className="me-2" />Modifier — {user.firstName} {user.lastName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            <Col xs={12}>
              <Form.Group>
                <Form.Label>Téléphone</Form.Label>
                <Form.Control
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  placeholder="+225 07 XX XX XX"
                />
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Group>
                <Form.Label>Rôle</Form.Label>
                <Form.Select value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}>
                  {Object.entries(ROLES).map(([val, r]) => (
                    <option key={val} value={val}>{r.label}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Group>
                <Form.Label>Statut du compte</Form.Label>
                <Form.Select value={editForm.isActive ? "1" : "0"} onChange={(e) => setEditForm({ ...editForm, isActive: e.target.value === "1" })}>
                  <option value="1">✓ Actif</option>
                  <option value="0">✗ Inactif (bloqué)</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEdit(false)}>Annuler</Button>
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? "Enregistrement..." : "Mettre à jour"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ── Modal Réinitialiser mot de passe ────────────────────────────────────── */}
      <Modal show={showPwd} onHide={() => setShowPwd(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title><FaKey className="me-2 text-warning" />Réinitialiser le mot de passe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted small mb-3">
            Compte : <strong>{user.firstName} {user.lastName}</strong> ({user.email})
          </p>
          <Row className="g-3">
            <Col xs={12}>
              <Form.Group>
                <Form.Label>Nouveau mot de passe *</Form.Label>
                <Form.Control
                  type="password"
                  value={pwdForm.password}
                  onChange={(e) => setPwdForm({ ...pwdForm, password: e.target.value })}
                  placeholder="Minimum 6 caractères"
                />
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Group>
                <Form.Label>Confirmer *</Form.Label>
                <Form.Control
                  type="password"
                  value={pwdForm.confirm}
                  onChange={(e) => setPwdForm({ ...pwdForm, confirm: e.target.value })}
                  isInvalid={!!pwdForm.confirm && pwdForm.password !== pwdForm.confirm}
                  placeholder="Répéter le mot de passe"
                />
                <Form.Control.Feedback type="invalid">
                  Les mots de passe ne correspondent pas
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPwd(false)}>Annuler</Button>
          <Button variant="warning" onClick={handleResetPwd} disabled={savingPwd}>
            {savingPwd ? "Enregistrement..." : "Réinitialiser"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
