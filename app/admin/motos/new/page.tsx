"use client";

import React, { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import MotorcycleForm from "@/components/admin/MotorcycleForm";
import { getBrands, getCategories } from "@/services/api";

export default function NewMotoPage() {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [b, c] = await Promise.all([getBrands(), getCategories()]);
        setBrands(b.data || []);
        setCategories(c.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <Alert variant="info">Chargement...</Alert>;

  return (
    <div>
      <h2 className="mb-4">Nouvelle moto</h2>
      <MotorcycleForm brands={brands} categories={categories} />
    </div>
  );
}
