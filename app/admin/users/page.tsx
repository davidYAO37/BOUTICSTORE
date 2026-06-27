"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Button, Table, Form, Pagination, Alert } from "react-bootstrap";
import { FaTrash, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import { getUsers, updateUser, deleteUser } from "@/services/api";

interface UserAdmin {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

const roles = ["admin", "sales", "warehouse", "customer"];

export default function AdminUsersPage() {
  const [items, setItems] = useState<UserAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number | undefined> = { page, limit: 10 };
      if (search) params.search = search;
      const data = await getUsers(params);
      setItems(data.data || []);
      setTotalPages(data.meta?.totalPages || 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const handleRoleChange = async (id: string, role: string) => {
    try {
      await updateUser(id, { role });
      toast.success("Rôle mis à jour");
      fetch();
    } catch {
      toast.error("Erreur");
    }
  };

  const toggleActive = async (item: UserAdmin) => {
    try {
      await updateUser(item._id, { isActive: !item.isActive });
      toast.success("Utilisateur mis à jour");
      fetch();
    } catch {
      toast.error("Erreur");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;
    try {
      await deleteUser(id);
      toast.success("Utilisateur supprimé");
      fetch();
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  return (
    <div>
      <h2 className="mb-4">Utilisateurs</h2>
      <div className="d-flex mb-3">
        <div className="position-relative" style={{ width: 300 }}>
          <Form.Control type="search" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <FaSearch className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted" />
        </div>
      </div>
      {loading ? <Alert variant="info">Chargement...</Alert> : items.length === 0 ? <Alert variant="warning">Aucun utilisateur</Alert> : (
        <>
          <Table responsive hover className="bg-white shadow-sm rounded">
            <thead><tr><th>Nom</th><th>Email</th><th>Rôle</th><th>Actif</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  <td>{item.firstName} {item.lastName}</td>
                  <td>{item.email}</td>
                  <td>
                    <Form.Select size="sm" value={item.role} onChange={(e) => handleRoleChange(item._id, e.target.value)}>
                      {roles.map((r) => <option key={r} value={r}>{r}</option>)}
                    </Form.Select>
                  </td>
                  <td>
                    <Form.Check type="switch" checked={item.isActive} onChange={() => toggleActive(item)} />
                  </td>
                  <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td><Button variant="outline-danger" size="sm" onClick={() => handleDelete(item._id)}><FaTrash /></Button></td>
                </tr>
              ))}
            </tbody>
          </Table>
          {totalPages > 1 && (
            <Pagination>
              <Pagination.Prev onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} />
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => <Pagination.Item key={p} active={p === page} onClick={() => setPage(p)}>{p}</Pagination.Item>)}
              <Pagination.Next onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} />
            </Pagination>
          )}
        </>
      )}
    </div>
  );
}
