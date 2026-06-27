"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Button, Table, Form, Pagination, Alert } from "react-bootstrap";
import { FaTrash, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import { getQuotes, updateQuote, deleteQuote } from "@/services/api";

interface QuoteAdmin {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  motorcycle?: { name: string };
  status: string;
  createdAt: string;
}

const statusOptions = ["pending", "processing", "sent", "accepted", "rejected"];

export default function AdminQuotesPage() {
  const [items, setItems] = useState<QuoteAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number | undefined> = { page, limit: 10 };
      if (status) params.status = status;
      if (search) params.search = search;
      const data = await getQuotes(params);
      setItems(data.data || []);
      setTotalPages(data.meta?.totalPages || 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page, status, search]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateQuote(id, { status: newStatus });
      toast.success("Statut mis à jour");
      fetch();
    } catch {
      toast.error("Erreur");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Supprimer ce devis ?")) return;
    try {
      await deleteQuote(id);
      toast.success("Devis supprimé");
      fetch();
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  return (
    <div>
      <h2 className="mb-4">Devis</h2>
      <div className="d-flex gap-2 mb-3">
        <div className="position-relative" style={{ width: 250 }}>
          <Form.Control type="search" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <FaSearch className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted" />
        </div>
        <Form.Select style={{ width: 200 }} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Tous les statuts</option>
          {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
        </Form.Select>
      </div>
      {loading ? <Alert variant="info">Chargement...</Alert> : items.length === 0 ? <Alert variant="warning">Aucun devis</Alert> : (
        <>
          <Table responsive hover className="bg-white shadow-sm rounded">
            <thead><tr><th>Nom</th><th>Email</th><th>Téléphone</th><th>Moto</th><th>Statut</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  <td>{item.firstName} {item.lastName}</td>
                  <td>{item.email}</td>
                  <td>{item.phone}</td>
                  <td>{item.motorcycle?.name || "-"}</td>
                  <td>
                    <Form.Select size="sm" value={item.status} onChange={(e) => handleStatusChange(item._id, e.target.value)}>
                      {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                    </Form.Select>
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
