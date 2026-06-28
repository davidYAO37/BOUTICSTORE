"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Button, Table, Form, Pagination, Alert, Modal,
  Row, Col, Badge, InputGroup, Card, Spinner,
} from "react-bootstrap";
import {
  FaTrash, FaSearch, FaUserPlus, FaEdit, FaEye,
  FaKey, FaDownload, FaUsers, FaUserShield, FaUserTie, FaUserCog,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { getUsers, updateUser, deleteUser, createUser } from "@/services/api";

// ── Types ─────────────────────────────────────────────────────────────────────
interface UserAdmin {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  isActive: boolean;
  emailVerified?: boolean;
  createdAt: string;
}

// ── Constantes ────────────────────────────────────────────────────────────────
const ROLES: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  admin:     { label: "Administrateur", color: "danger",    icon: <FaUserShield /> },
  sales:     { label: "Commercial",     color: "primary",   icon: <FaUserTie /> },
  warehouse: { label: "Magasinier",     color: "warning",   icon: <FaUserCog /> },
  customer:  { label: "Client",         color: "secondary", icon: <FaUsers /> },
};

const ROLE_STATS_ICONS: Record<string, React.ReactNode> = {
  admin: <FaUserShield size={22} />, sales: <FaUserTie size={22} />,
  warehouse: <FaUserCog size={22} />, customer: <FaUsers size={22} />,
};

const ROLE_FILTER_OPTIONS = [
  { value: "", label: "Tous les rôles" },
  ...Object.entries(ROLES).map(([v, r]) => ({ value: v, label: r.label })),
];

const emptyForm = { firstName: "", lastName: "", email: "", phone: "", password: "", role: "customer", isActive: true };
const emptyPwdForm = { password: "", confirm: "" };

// ── Composant ─────────────────────────────────────────────────────────────────
export default function AdminUsersPage() {
  const router = useRouter();

  // Liste
  const [items, setItems]         = useState<UserAdmin[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage]           = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]         = useState(0);

  // Stats
  const [stats, setStats] = useState<Record<string, number>>({});

  // Modal Créer / Modifier
  const [showModal, setShowModal]   = useState(false);
  const [editUser, setEditUser]     = useState<UserAdmin | null>(null);
  const [form, setForm]             = useState(emptyForm);
  const [saving, setSaving]         = useState(false);

  // Modal Mot de passe
  const [showPwd, setShowPwd]       = useState(false);
  const [pwdUser, setPwdUser]       = useState<UserAdmin | null>(null);
  const [pwdForm, setPwdForm]       = useState(emptyPwdForm);
  const [savingPwd, setSavingPwd]   = useState(false);

  // ── Chargement ───────────────────────────────────────────────────────────────
  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number | undefined> = { page, limit: 15 };
      if (search)       params.search   = search;
      if (roleFilter)   params.role     = roleFilter;
      if (statusFilter) params.isActive = statusFilter;
      const data = await getUsers(params);
      setItems(data.data || []);
      setTotalPages(data.meta?.totalPages || 1);
      setTotal(data.meta?.total || 0);
    } catch {
      toast.error("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter, statusFilter]);

  const loadStats = useCallback(async () => {
    try {
      const counts: Record<string, number> = {};
      await Promise.all(
        Object.keys(ROLES).map(async (r) => {
          const d = await getUsers({ role: r, limit: 1 });
          counts[r] = d.meta?.total || 0;
        })
      );
      setStats(counts);
    } catch { /* silencieux */ }
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);
  useEffect(() => { loadStats(); }, [loadStats]);

  // ── CRUD ─────────────────────────────────────────────────────────────────────
  const openCreate = () => { setEditUser(null); setForm(emptyForm); setShowModal(true); };

  const openEdit = (user: UserAdmin) => {
    setEditUser(user);
    setForm({ firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone || "", password: "", role: user.role, isActive: user.isActive });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.firstName || !form.lastName || !form.email) {
      toast.error("Prénom, nom et email sont obligatoires"); return;
    }
    if (!editUser && !form.password) {
      toast.error("Le mot de passe est obligatoire"); return;
    }
    setSaving(true);
    try {
      if (editUser) {
        await updateUser(editUser._id, { role: form.role, isActive: form.isActive, phone: form.phone });
        toast.success("Utilisateur mis à jour");
      } else {
        await createUser({ firstName: form.firstName, lastName: form.lastName, email: form.email, phone: form.phone, password: form.password, role: form.role, isActive: form.isActive });
        toast.success("Utilisateur créé");
        loadStats();
      }
      setShowModal(false);
      loadUsers();
    } catch {
      toast.error("Erreur lors de l'enregistrement");
    } finally { setSaving(false); }
  };

  const handleRoleChange = async (id: string, role: string) => {
    try {
      await updateUser(id, { role });
      toast.success("Rôle mis à jour");
      loadUsers(); loadStats();
    } catch { toast.error("Erreur"); }
  };

  const toggleActive = async (item: UserAdmin) => {
    try {
      await updateUser(item._id, { isActive: !item.isActive });
      toast.success(item.isActive ? "Compte désactivé" : "Compte activé");
      loadUsers();
    } catch { toast.error("Erreur"); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Supprimer définitivement ${name} ?`)) return;
    try {
      await deleteUser(id);
      toast.success("Utilisateur supprimé");
      loadUsers(); loadStats();
    } catch { toast.error("Erreur lors de la suppression"); }
  };

  // ── Réinitialisation mot de passe ────────────────────────────────────────────
  const openPwd = (user: UserAdmin) => { setPwdUser(user); setPwdForm(emptyPwdForm); setShowPwd(true); };

  const handleResetPwd = async () => {
    if (!pwdForm.password || pwdForm.password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères"); return;
    }
    if (pwdForm.password !== pwdForm.confirm) {
      toast.error("Les mots de passe ne correspondent pas"); return;
    }
    setSavingPwd(true);
    try {
      await updateUser(pwdUser!._id, { password: pwdForm.password });
      toast.success("Mot de passe réinitialisé");
      setShowPwd(false);
    } catch { toast.error("Erreur"); }
    finally { setSavingPwd(false); }
  };

  // ── Export CSV ───────────────────────────────────────────────────────────────
  const exportCSV = async () => {
    try {
      const data = await getUsers({ limit: 9999 });
      const rows: UserAdmin[] = data.data || [];
      const header = "Prénom,Nom,Email,Téléphone,Rôle,Statut,Inscription";
      const lines = rows.map((u) =>
        [u.firstName, u.lastName, u.email, u.phone || "", ROLES[u.role]?.label || u.role,
          u.isActive ? "Actif" : "Inactif",
          new Date(u.createdAt).toLocaleDateString("fr-FR")
        ].join(",")
      );
      const csv = [header, ...lines].join("\n");
      const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = "utilisateurs.csv"; a.click();
      URL.revokeObjectURL(url);
    } catch { toast.error("Erreur lors de l'export"); }
  };

  // ── Rendu ─────────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* En-tête */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="mb-0">Gestion des utilisateurs</h2>
          <small className="text-muted">{total} utilisateur{total > 1 ? "s" : ""} au total</small>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" size="sm" className="d-flex align-items-center gap-1" onClick={exportCSV}>
            <FaDownload /> Exporter CSV
          </Button>
          <Button variant="primary" className="d-flex align-items-center gap-2" onClick={openCreate}>
            <FaUserPlus /> Nouvel utilisateur
          </Button>
        </div>
      </div>

      {/* Cartes statistiques par rôle */}
      <Row className="g-3 mb-4">
        {Object.entries(ROLES).map(([key, r]) => (
          <Col xs={6} md={3} key={key}>
            <Card
              className={`border-0 shadow-sm h-100 ${roleFilter === key ? "border border-2" : ""}`}
              style={{ cursor: "pointer", borderColor: roleFilter === key ? `var(--bs-${r.color})` : undefined }}
              onClick={() => { setRoleFilter(roleFilter === key ? "" : key); setPage(1); }}
            >
              <Card.Body className="d-flex align-items-center gap-3 py-3">
                <div className={`text-${r.color}`}>{ROLE_STATS_ICONS[key]}</div>
                <div>
                  <div className="fw-bold fs-5">{stats[key] ?? "—"}</div>
                  <div className="text-muted small">{r.label}{r.label.endsWith("s") ? "" : "s"}</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Filtres */}
      <div className="d-flex gap-2 mb-3 flex-wrap">
        <InputGroup style={{ maxWidth: 340 }}>
          <InputGroup.Text><FaSearch /></InputGroup.Text>
          <Form.Control
            type="search"
            placeholder="Rechercher par nom ou email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </InputGroup>
        <Form.Select style={{ maxWidth: 180 }} value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}>
          {ROLE_FILTER_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </Form.Select>
        <Form.Select style={{ maxWidth: 160 }} value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
          <option value="">Tous les statuts</option>
          <option value="true">Actifs</option>
          <option value="false">Inactifs</option>
        </Form.Select>
      </div>

      {/* Tableau */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 text-muted">Chargement...</p>
        </div>
      ) : items.length === 0 ? (
        <Alert variant="warning">Aucun utilisateur trouvé</Alert>
      ) : (
        <>
          <Table responsive hover className="bg-white shadow-sm rounded align-middle">
            <thead className="table-light">
              <tr>
                <th>Utilisateur</th>
                <th>Contact</th>
                <th>Rôle</th>
                <th>Statut</th>
                <th>Inscription</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const role = ROLES[item.role] || { label: item.role, color: "secondary", icon: null };
                return (
                  <tr key={item._id}>
                    {/* Utilisateur */}
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className={`rounded-circle d-flex align-items-center justify-content-center text-white fw-bold bg-${role.color}`}
                          style={{ width: 36, height: 36, fontSize: 13, flexShrink: 0 }}
                        >
                          {item.firstName[0]}{item.lastName[0]}
                        </div>
                        <div>
                          <div className="fw-semibold">{item.firstName} {item.lastName}</div>
                          {item.emailVerified && <small className="text-success">✓ Email vérifié</small>}
                        </div>
                      </div>
                    </td>
                    {/* Contact */}
                    <td>
                      <div className="text-muted small">{item.email}</div>
                      {item.phone && <div className="text-muted small">{item.phone}</div>}
                    </td>
                    {/* Rôle */}
                    <td>
                      <div className="d-flex flex-column gap-1">
                        <Badge bg={role.color}>{role.label}</Badge>
                        <Form.Select size="sm" value={item.role} style={{ minWidth: 130 }} onChange={(e) => handleRoleChange(item._id, e.target.value)}>
                          {Object.entries(ROLES).map(([val, r]) => (
                            <option key={val} value={val}>{r.label}</option>
                          ))}
                        </Form.Select>
                      </div>
                    </td>
                    {/* Statut */}
                    <td>
                      <Badge
                        bg={item.isActive ? "success" : "secondary"}
                        style={{ cursor: "pointer" }}
                        onClick={() => toggleActive(item)}
                        title="Cliquer pour basculer"
                      >
                        {item.isActive ? "✓ Actif" : "✗ Inactif"}
                      </Badge>
                    </td>
                    {/* Date */}
                    <td className="text-muted small">
                      {new Date(item.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    {/* Actions */}
                    <td>
                      <div className="d-flex gap-1 justify-content-center">
                        <Button variant="outline-secondary" size="sm" onClick={() => router.push(`/admin/users/${item._id}`)} title="Voir le profil">
                          <FaEye />
                        </Button>
                        <Button variant="outline-primary" size="sm" onClick={() => openEdit(item)} title="Modifier">
                          <FaEdit />
                        </Button>
                        <Button variant="outline-warning" size="sm" onClick={() => openPwd(item)} title="Réinitialiser le mot de passe">
                          <FaKey />
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(item._id, `${item.firstName} ${item.lastName}`)} title="Supprimer">
                          <FaTrash />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>

          {totalPages > 1 && (
            <Pagination className="mt-3">
              <Pagination.First onClick={() => setPage(1)} disabled={page === 1} />
              <Pagination.Prev onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} />
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Pagination.Item key={p} active={p === page} onClick={() => setPage(p)}>{p}</Pagination.Item>
              ))}
              <Pagination.Next onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} />
              <Pagination.Last onClick={() => setPage(totalPages)} disabled={page === totalPages} />
            </Pagination>
          )}
        </>
      )}

      {/* ── Modal Créer / Modifier ───────────────────────────────────────────── */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editUser ? `Modifier — ${editUser.firstName} ${editUser.lastName}` : "Nouvel utilisateur"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Prénom *</Form.Label>
                <Form.Control value={form.firstName} disabled={!!editUser} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Nom *</Form.Label>
                <Form.Control value={form.lastName} disabled={!!editUser} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
              </Form.Group>
            </Col>
            <Col md={8}>
              <Form.Group>
                <Form.Label>Email *</Form.Label>
                <Form.Control type="email" value={form.email} disabled={!!editUser} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                {editUser && <Form.Text className="text-muted">L&apos;email ne peut pas être modifié</Form.Text>}
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Téléphone</Form.Label>
                <Form.Control value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+225 07 XX XX XX" />
              </Form.Group>
            </Col>
            {!editUser && (
              <Col xs={12}>
                <Form.Group>
                  <Form.Label>Mot de passe *</Form.Label>
                  <Form.Control type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Minimum 6 caractères" />
                </Form.Group>
              </Col>
            )}
            <Col md={6}>
              <Form.Group>
                <Form.Label>Rôle</Form.Label>
                <Form.Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  {Object.entries(ROLES).map(([val, r]) => <option key={val} value={val}>{r.label}</option>)}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Statut du compte</Form.Label>
                <Form.Select value={form.isActive ? "1" : "0"} onChange={(e) => setForm({ ...form, isActive: e.target.value === "1" })}>
                  <option value="1">✓ Actif</option>
                  <option value="0">✗ Inactif (bloqué)</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Annuler</Button>
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? "Enregistrement..." : editUser ? "Mettre à jour" : "Créer l'utilisateur"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ── Modal Réinitialiser le mot de passe ─────────────────────────────── */}
      <Modal show={showPwd} onHide={() => setShowPwd(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaKey className="me-2 text-warning" />
            Réinitialiser le mot de passe
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {pwdUser && (
            <p className="text-muted mb-3">
              Compte : <strong>{pwdUser.firstName} {pwdUser.lastName}</strong> ({pwdUser.email})
            </p>
          )}
          <Row className="g-3">
            <Col xs={12}>
              <Form.Group>
                <Form.Label>Nouveau mot de passe *</Form.Label>
                <Form.Control type="password" value={pwdForm.password} onChange={(e) => setPwdForm({ ...pwdForm, password: e.target.value })} placeholder="Minimum 6 caractères" />
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Group>
                <Form.Label>Confirmer le mot de passe *</Form.Label>
                <Form.Control
                  type="password"
                  value={pwdForm.confirm}
                  onChange={(e) => setPwdForm({ ...pwdForm, confirm: e.target.value })}
                  isInvalid={!!pwdForm.confirm && pwdForm.password !== pwdForm.confirm}
                />
                <Form.Control.Feedback type="invalid">Les mots de passe ne correspondent pas</Form.Control.Feedback>
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
