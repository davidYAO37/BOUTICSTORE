"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Button, Table, Form, Pagination, Alert } from "react-bootstrap";
import { FaTrash, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import { getReviews, updateReview, deleteReview } from "@/services/api";

interface ReviewAdmin {
  _id: string;
  user?: { firstName: string; lastName: string };
  motorcycle?: { name: string };
  rating: number;
  comment: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminReviewsPage() {
  const [items, setItems] = useState<ReviewAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number | boolean | undefined> = { page, limit: 10, admin: true };
      if (search) params.search = search;
      const data = await getReviews(params);
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

  const toggleActive = async (item: ReviewAdmin) => {
    try {
      await updateReview(item._id, { isActive: !item.isActive });
      toast.success("Avis mis à jour");
      fetch();
    } catch {
      toast.error("Erreur");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Supprimer cet avis ?")) return;
    try {
      await deleteReview(id);
      toast.success("Avis supprimé");
      fetch();
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  return (
    <div>
      <h2 className="mb-4">Avis</h2>
      <div className="d-flex mb-3">
        <div className="position-relative" style={{ width: 300 }}>
          <Form.Control type="search" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <FaSearch className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted" />
        </div>
      </div>
      {loading ? <Alert variant="info">Chargement...</Alert> : items.length === 0 ? <Alert variant="warning">Aucun avis</Alert> : (
        <>
          <Table responsive hover className="bg-white shadow-sm rounded">
            <thead><tr><th>Utilisateur</th><th>Moto</th><th>Note</th><th>Commentaire</th><th>Actif</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  <td>{item.user?.firstName} {item.user?.lastName}</td>
                  <td>{item.motorcycle?.name || "-"}</td>
                  <td>{item.rating}/5</td>
                  <td>{item.comment.slice(0, 60)}...</td>
                  <td>
                    <Form.Check
                      type="switch"
                      checked={item.isActive}
                      onChange={() => toggleActive(item)}
                    />
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
