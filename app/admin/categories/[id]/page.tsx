"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Alert } from "react-bootstrap";
import CategoryForm from "@/components/admin/CategoryForm";
import { getCategoryById } from "@/services/api";

export default function EditCategoryPage() {
  const { id } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getCategoryById(id as string)
        .then((res) => setItem(res.data || null))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <Alert variant="info">Chargement...</Alert>;
  if (!item) return <Alert variant="danger">Catégorie non trouvée</Alert>;

  return (
    <div>
      <h2 className="mb-4">Modifier {item.name.fr}</h2>
      <CategoryForm id={id as string} initialData={item} />
    </div>
  );
}
