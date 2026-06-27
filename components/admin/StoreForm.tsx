"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Button, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import { createStore, updateStore } from "@/services/api";

interface StoreFormProps {
  id?: string;
  initialData?: {
    name?: { fr?: string; en?: string };
    address?: string;
    city?: string;
    country?: string;
    phone?: string;
    whatsapp?: string;
    email?: string;
    coordinates?: { lat: number; lng: number };
    openingHours?: { fr?: string; en?: string };
    isActive?: boolean;
  };
}

export default function StoreForm({ id, initialData }: StoreFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    nameFr: initialData?.name?.fr || "",
    nameEn: initialData?.name?.en || "",
    address: initialData?.address || "",
    city: initialData?.city || "",
    country: initialData?.country || "Côte d'Ivoire",
    phone: initialData?.phone || "",
    whatsapp: initialData?.whatsapp || "",
    email: initialData?.email || "",
    lat: initialData?.coordinates?.lat || 0,
    lng: initialData?.coordinates?.lng || 0,
    openingHoursFr: initialData?.openingHours?.fr || "",
    openingHoursEn: initialData?.openingHours?.en || "",
    isActive: initialData?.isActive ?? true,
  });

  const handleChange = (field: string, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: { fr: form.nameFr, en: form.nameEn || form.nameFr },
      address: form.address,
      city: form.city,
      country: form.country,
      phone: form.phone,
      whatsapp: form.whatsapp,
      email: form.email,
      coordinates: { lat: Number(form.lat), lng: Number(form.lng) },
      openingHours: { fr: form.openingHoursFr, en: form.openingHoursEn },
      isActive: form.isActive,
    };
    try {
      if (id) {
        await updateStore(id, payload);
        toast.success("Magasin mis à jour");
      } else {
        await createStore(payload);
        toast.success("Magasin créé");
      }
      router.push("/admin/stores/");
    } catch {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row className="g-3">
        <Col md={6}><Form.Group><Form.Label>Nom (FR)</Form.Label><Form.Control value={form.nameFr} onChange={(e) => handleChange("nameFr", e.target.value)} required /></Form.Group></Col>
        <Col md={6}><Form.Group><Form.Label>Nom (EN)</Form.Label><Form.Control value={form.nameEn} onChange={(e) => handleChange("nameEn", e.target.value)} required /></Form.Group></Col>
        <Col md={6}><Form.Group><Form.Label>Adresse</Form.Label><Form.Control value={form.address} onChange={(e) => handleChange("address", e.target.value)} required /></Form.Group></Col>
        <Col md={6}><Form.Group><Form.Label>Ville</Form.Label><Form.Control value={form.city} onChange={(e) => handleChange("city", e.target.value)} required /></Form.Group></Col>
        <Col md={4}><Form.Group><Form.Label>Téléphone</Form.Label><Form.Control value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} /></Form.Group></Col>
        <Col md={4}><Form.Group><Form.Label>WhatsApp</Form.Label><Form.Control value={form.whatsapp} onChange={(e) => handleChange("whatsapp", e.target.value)} /></Form.Group></Col>
        <Col md={4}><Form.Group><Form.Label>Email</Form.Label><Form.Control type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} required /></Form.Group></Col>
        <Col md={6}><Form.Group><Form.Label>Pays</Form.Label><Form.Control value={form.country} onChange={(e) => handleChange("country", e.target.value)} required /></Form.Group></Col>
        <Col md={6}><Form.Group><Form.Label>Latitude</Form.Label><Form.Control type="number" step="any" value={form.lat} onChange={(e) => handleChange("lat", Number(e.target.value))} /></Form.Group></Col>
        <Col md={6}><Form.Group><Form.Label>Longitude</Form.Label><Form.Control type="number" step="any" value={form.lng} onChange={(e) => handleChange("lng", Number(e.target.value))} /></Form.Group></Col>
        <Col md={6}><Form.Group><Form.Label>Horaires (FR)</Form.Label><Form.Control value={form.openingHoursFr} onChange={(e) => handleChange("openingHoursFr", e.target.value)} /></Form.Group></Col>
        <Col md={6}><Form.Group><Form.Label>Horaires (EN)</Form.Label><Form.Control value={form.openingHoursEn} onChange={(e) => handleChange("openingHoursEn", e.target.value)} /></Form.Group></Col>
        <Col md={6}><Form.Group><Form.Label>Actif</Form.Label><Form.Check type="switch" checked={form.isActive} onChange={(e) => handleChange("isActive", e.target.checked)} label="Visible" /></Form.Group></Col>
      </Row>
      <div className="d-flex gap-2 mt-4">
        <Button type="submit" variant="primary" disabled={saving}>{saving ? "Enregistrement..." : id ? "Mettre à jour" : "Créer"}</Button>
        <Button variant="outline-secondary" onClick={() => router.push("/admin/stores/")}>Annuler</Button>
      </div>
    </Form>
  );
}
