"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Alert } from "react-bootstrap";
import MotorcycleForm from "@/components/admin/MotorcycleForm";
import { getBrands, getCategories, getMotorcycleBySlug } from "@/services/api";

export default function EditMotoPage() {
  const { id } = useParams();
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [moto, setMoto] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [b, c, m] = await Promise.all([getBrands(), getCategories(), getMotorcycleBySlug(id as string)]);
        setBrands(b.data || []);
        setCategories(c.data || []);
        setMoto(m.data || null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  if (loading) return <Alert variant="info">Chargement...</Alert>;
  if (!moto) return <Alert variant="danger">Moto non trouvée</Alert>;

  return (
    <div>
      <h2 className="mb-4">Modifier {moto.name}</h2>
      <MotorcycleForm id={id as string} initialData={moto} brands={brands} categories={categories} />
    </div>
  );
}
