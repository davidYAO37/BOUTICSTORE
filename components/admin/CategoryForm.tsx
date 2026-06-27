"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Form, Button, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import { createCategory, updateCategory, getCategories } from "@/services/api";

interface CategoryFormProps {
  id?: string;
  initialData?: { name?: { fr?: string; en?: string }; slug?: string; description?: { fr?: string; en?: string }; parent?: string; isActive?: boolean };
}

export default function CategoryForm({ id, initialData }: CategoryFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [parents, setParents] = useState<{ _id: string; name: { fr: string } }[]>([]);
  const [form, setForm] = useState({
    nameFr: initialData?.name?.fr || "",
    nameEn: initialData?.name?.en || "",
    slug: initialData?.slug || "",
    descriptionFr: initialData?.description?.fr || "",
    descriptionEn: initialData?.description?.en || "",
    parent: initialData?.parent || "",
    isActive: initialData?.isActive ?? true,
  });

  useEffect(() => {
    getCategories({ limit: 100 }).then((res) => setParents(res.data || [])).catch(console.error);
  }, []);

  const toSlug = (str: string) =>
    str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "nameFr" && !id) {
        updated.slug = toSlug(value as string);
      }
      if (field === "slug") {
        updated.slug = toSlug(value as string);
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: { fr: form.nameFr, en: form.nameEn || form.nameFr },
      slug: toSlug(form.slug),
      description: { fr: form.descriptionFr, en: form.descriptionEn },
      parent: form.parent || undefined,
      isActive: form.isActive,
    };
    try {
      if (id) {
        await updateCategory(id, payload);
        toast.success("Catégorie mise à jour");
      } else {
        await createCategory(payload);
        toast.success("Catégorie créée");
      }
      router.push("/admin/categories/");
    } catch {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row className="g-3">
        <Col md={6}>
          <Form.Group><Form.Label>Nom (FR)</Form.Label><Form.Control value={form.nameFr} onChange={(e) => handleChange("nameFr", e.target.value)} required /></Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group><Form.Label>Nom (EN)</Form.Label><Form.Control value={form.nameEn} onChange={(e) => handleChange("nameEn", e.target.value)} required /></Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group><Form.Label>Slug</Form.Label><Form.Control value={form.slug} onChange={(e) => handleChange("slug", e.target.value)} required /></Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Parent</Form.Label>
            <Form.Select value={form.parent} onChange={(e) => handleChange("parent", e.target.value)}>
              <option value="">Aucun</option>
              {parents.filter((p) => p._id !== id).map((p) => <option key={p._id} value={p._id}>{p.name.fr}</option>)}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group><Form.Label>Description (FR)</Form.Label><Form.Control as="textarea" rows={2} value={form.descriptionFr} onChange={(e) => handleChange("descriptionFr", e.target.value)} /></Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group><Form.Label>Description (EN)</Form.Label><Form.Control as="textarea" rows={2} value={form.descriptionEn} onChange={(e) => handleChange("descriptionEn", e.target.value)} /></Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group><Form.Label>Actif</Form.Label><Form.Check type="switch" checked={form.isActive} onChange={(e) => handleChange("isActive", e.target.checked)} label="Visible" /></Form.Group>
        </Col>
      </Row>
      <div className="d-flex gap-2 mt-4">
        <Button type="submit" variant="primary" disabled={saving}>{saving ? "Enregistrement..." : id ? "Mettre à jour" : "Créer"}</Button>
        <Button variant="outline-secondary" onClick={() => router.push("/admin/categories/")}>Annuler</Button>
      </div>
    </Form>
  );
}
