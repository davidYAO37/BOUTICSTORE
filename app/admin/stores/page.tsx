"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Button, Table, Badge, Form, Pagination, Alert } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import { getStores, deleteStore } from "@/services/api";

interface StoreAdmin {
  _id: string;
  name: { fr: string; en: string };
  city: string;
  phone: string;
  isActive?: boolean;
}

export default function AdminStoresPage() {
  const [items, setItems] = useState<StoreAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getStores({ page, limit: 10, search, admin: true });
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

  const handleDelete = async (id: string) => {
    if (!window.confirm("Supprimer ce magasin ?")) return;
    try {
      await deleteStore(id);
      toast.success("Magasin supprimé");
      fetch();
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Magasins</h2>
        <Link href="/admin/stores/new" className="btn btn-primary d-flex align-items-center gap-2">
          <FaPlus /> Ajouter
        </Link>
      </div>
      <div className="d-flex mb-3">
        <div className="position-relative" style={{ width: 300 }}>
          <Form.Control type="search" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <FaSearch className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted" />
        </div>
      </div>
      {loading ? <Alert variant="info">Chargement...</Alert> : items.length === 0 ? <Alert variant="warning">Aucun magasin</Alert> : (
        <>
          <Table responsive hover className="bg-white shadow-sm rounded">
            <thead><tr><th>Nom</th><th>Ville</th><th>Téléphone</th><th>Actif</th><th>Actions</th></tr></thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  <td>{item.name.fr}</td>
                  <td>{item.city}</td>
                  <td>{item.phone}</td>
                  <td>{item.isActive ? <Badge bg="success">Oui</Badge> : <Badge bg="danger">Non</Badge>}</td>
                  <td>
                    <Link href={`/admin/stores/${item._id}`} className="btn btn-sm btn-outline-primary me-2"><FaEdit /></Link>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(item._id)}><FaTrash /></Button>
                  </td>
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
