"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Button, Table, Badge, Form, Pagination, Alert } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import { getMotorcycles, deleteMotorcycle } from "@/services/api";
import { formatPrice } from "@/lib/utils";

interface MotoAdmin { _id: string; name: string; reference: string; price: number; currency: string; stock: number; availability: string; isActive: boolean; brand?: { name: string }; category?: { name: { fr: string; en: string } }; }

export default function AdminMotosPage() {
  const [motos, setMotos] = useState<MotoAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMotorcycles({ page, limit: 10, search, admin: true });
      setMotos(data.data || []);
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
    if (!window.confirm("Supprimer cette moto ?")) return;
    try {
      await deleteMotorcycle(id);
      toast.success("Moto supprimée");
      fetch();
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  const availabilityLabel = (value: string) => {
    switch (value) {
      case "in_stock": return <Badge bg="success">En stock</Badge>;
      case "out_of_stock": return <Badge bg="danger">Rupture</Badge>;
      case "pre_order": return <Badge bg="info">Précommande</Badge>;
      case "coming_soon": return <Badge bg="warning">Bientôt</Badge>;
      default: return <Badge bg="secondary">{value}</Badge>;
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Gestion des motos</h2>
        <Link href="/admin/motos/new" className="btn btn-primary d-flex align-items-center gap-2">
          <FaPlus /> Ajouter
        </Link>
      </div>

      <div className="d-flex mb-3">
        <div className="position-relative" style={{ width: 300 }}>
          <Form.Control
            type="search"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FaSearch className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted" />
        </div>
      </div>

      {loading ? (
        <Alert variant="info">Chargement...</Alert>
      ) : motos.length === 0 ? (
        <Alert variant="warning">Aucune moto trouvée</Alert>
      ) : (
        <>
          <Table responsive hover className="bg-white shadow-sm rounded">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Référence</th>
                <th>Marque</th>
                <th>Catégorie</th>
                <th>Prix</th>
                <th>Stock</th>
                <th>Disponibilité</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {motos.map((moto) => (
                <tr key={moto._id}>
                  <td>{moto.name}</td>
                  <td>{moto.reference}</td>
                  <td>{moto.brand?.name || "-"}</td>
                  <td>{moto.category?.name?.fr || "-"}</td>
                  <td>{formatPrice(moto.price, moto.currency)}</td>
                  <td>{moto.stock}</td>
                  <td>{availabilityLabel(moto.availability)}</td>
                  <td>
                    <Link href={`/admin/motos/${moto._id}`} className="btn btn-sm btn-outline-primary me-2">
                      <FaEdit />
                    </Link>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(moto._id)}>
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {totalPages > 1 && (
            <Pagination>
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
