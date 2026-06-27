"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Alert } from "react-bootstrap";
import BrandForm from "@/components/admin/BrandForm";
import { getBrandById } from "@/services/api";

export default function EditBrandPage() {
  const { id } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getBrandById(id as string)
        .then((res) => setItem(res.data || null))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <Alert variant="info">Chargement...</Alert>;
  if (!item) return <Alert variant="danger">Marque non trouvée</Alert>;

  return (
    <div>
      <h2 className="mb-4">Modifier {item.name}</h2>
      <BrandForm id={id as string} initialData={item} />
    </div>
  );
}
