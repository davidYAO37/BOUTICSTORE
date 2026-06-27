"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Button, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import { createBrand, updateBrand } from "@/services/api";

interface BrandFormProps {
  id?: string;
  initialData?: { name?: string; slug?: string; country?: string; logo?: string; website?: string; description?: { fr?: string; en?: string }; isActive?: boolean };
}

export default function BrandForm({ id, initialData }: BrandFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    country: initialData?.country || "",
    logo: initialData?.logo || "",
    website: initialData?.website || "",
    descriptionFr: initialData?.description?.fr || "",
    descriptionEn: initialData?.description?.en || "",
    isActive: initialData?.isActive ?? true,
  });

  const toSlug = (str: string) =>
    str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "name" && !id) {
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
      name: form.name,
      slug: toSlug(form.slug),
      country: form.country,
      logo: form.logo,
      website: form.website,
      description: { fr: form.descriptionFr, en: form.descriptionEn },
      isActive: form.isActive,
    };
    try {
      if (id) {
        await updateBrand(id, payload);
        toast.success("Marque mise à jour");
      } else {
        await createBrand(payload);
        toast.success("Marque créée");
      }
      router.push("/admin/brands/");
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
          <Form.Group>
            <Form.Label>Nom</Form.Label>
            <Form.Control value={form.name} onChange={(e) => handleChange("name", e.target.value)} required />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Slug</Form.Label>
            <Form.Control value={form.slug} onChange={(e) => handleChange("slug", e.target.value)} required />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Pays</Form.Label>
            <Form.Control value={form.country} onChange={(e) => handleChange("country", e.target.value)} />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Logo (URL)</Form.Label>
            <Form.Control value={form.logo} onChange={(e) => handleChange("logo", e.target.value)} />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Site web</Form.Label>
            <Form.Control value={form.website} onChange={(e) => handleChange("website", e.target.value)} />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Description (FR)</Form.Label>
            <Form.Control as="textarea" rows={2} value={form.descriptionFr} onChange={(e) => handleChange("descriptionFr", e.target.value)} />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Description (EN)</Form.Label>
            <Form.Control as="textarea" rows={2} value={form.descriptionEn} onChange={(e) => handleChange("descriptionEn", e.target.value)} />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Actif</Form.Label>
            <Form.Check type="switch" checked={form.isActive} onChange={(e) => handleChange("isActive", e.target.checked)} label="Visible" />
          </Form.Group>
        </Col>
      </Row>
      <div className="d-flex gap-2 mt-4">
        <Button type="submit" variant="primary" disabled={saving}>{saving ? "Enregistrement..." : id ? "Mettre à jour" : "Créer"}</Button>
        <Button variant="outline-secondary" onClick={() => router.push("/admin/brands/")}>Annuler</Button>
      </div>
    </Form>
  );
}
