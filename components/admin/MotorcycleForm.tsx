"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Button, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import { createMotorcycle, updateMotorcycle } from "@/services/api";

interface SpecRow {
  label: string;
  value: string;
  unit: string;
  category: string;
}


interface MotorcycleFormProps {
  id?: string;
  initialData?: {
    name?: string;
    slug?: string;
    reference?: string;
    price?: number;
    oldPrice?: number | null;
    stock?: number;
    year?: number;
    displacement?: number;
    transmission?: string;
    brand?: string | { _id: string; name: string };
    category?: string | { _id: string; name: { fr: string } };
    availability?: string;
    color?: string[];
    images?: string[];
    thumbnail?: string;
    description?: { fr?: string; en?: string };
    shortDescription?: { fr?: string; en?: string };
    currency?: string;
    isPromotion?: boolean;
    isNew?: boolean;
    isPopular?: boolean;
    isActive?: boolean;
    specifications?: SpecRow[];
    datasheet?: string;
  };
  brands: { _id: string; name: string }[];
  categories: { _id: string; name: { fr: string } }[];
}

export default function MotorcycleForm({ id, initialData, brands, categories }: MotorcycleFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const getBrandId = (b: typeof initialData) =>
    b?.brand ? (typeof b.brand === "object" ? (b.brand as { _id: string })._id : b.brand) : "";
  const getCategoryId = (b: typeof initialData) =>
    b?.category ? (typeof b.category === "object" ? (b.category as { _id: string })._id : b.category) : "";

  const [datasheet, setDatasheet] = useState(initialData?.datasheet || "");
  const [pdfUploading, setPdfUploading] = useState(false);

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Veuillez sélectionner un fichier PDF");
      return;
    }
    setPdfUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        setDatasheet(data.url);
        toast.success("PDF uploadé avec succès");
      } else {
        toast.error(data.error || "Erreur upload");
      }
    } catch {
      toast.error("Erreur lors de l'upload du PDF");
    } finally {
      setPdfUploading(false);
    }
  };
  const [specs, setSpecs] = useState<SpecRow[]>(
    initialData?.specifications?.length
      ? initialData.specifications.map((s) => ({ label: s.label || "", value: s.value || "", unit: "", category: "" }))
      : [{ label: "", value: "", unit: "", category: "" }]
  );

  const addSpecRow = () => setSpecs((prev) => [...prev, { label: "", value: "", unit: "", category: "" }]);
  const removeSpecRow = (i: number) => setSpecs((prev) => prev.filter((_, idx) => idx !== i));
  const updateSpec = (i: number, field: keyof SpecRow, value: string) =>
    setSpecs((prev) => prev.map((row, idx) => (idx === i ? { ...row, [field]: value } : row)));

  const [form, setForm] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    reference: initialData?.reference || "",
    price: initialData?.price || 0,
    oldPrice: initialData?.oldPrice ?? null,
    stock: initialData?.stock || 0,
    year: initialData?.year || new Date().getFullYear(),
    displacement: initialData?.displacement || 0,
    transmission: initialData?.transmission || "",
    brand: getBrandId(initialData),
    category: getCategoryId(initialData),
    availability: initialData?.availability || "in_stock",
    color: (initialData?.color || []).join(", "),
    images: (initialData?.images || []).join(", "),
    thumbnail: initialData?.thumbnail || "",
    descriptionFr: initialData?.description?.fr || "",
    descriptionEn: initialData?.description?.en || "",
    shortDescriptionFr: initialData?.shortDescription?.fr || "",
    shortDescriptionEn: initialData?.shortDescription?.en || "",
    currency: initialData?.currency || "XOF",
    isPromotion: initialData?.isPromotion ?? false,
    isNew: initialData?.isNew ?? false,
    isPopular: initialData?.isPopular ?? false,
    isActive: initialData?.isActive ?? true,
  });

  React.useEffect(() => {
    if (!initialData) return;
    setDatasheet(initialData.datasheet || "");
    setForm((prev) => ({
      ...prev,
      brand: getBrandId(initialData),
      category: getCategoryId(initialData),
    }));
    if (initialData.specifications?.length) {
      setSpecs(initialData.specifications.map((s: SpecRow) => ({ label: s.label || "", value: s.value || "", unit: "", category: "" })));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  const toSlug = (str: string) =>
    str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  const handleChange = (field: string, value: string | number | boolean | null) => {
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
      slug: toSlug(form.slug || form.name),
      reference: form.reference,
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
      stock: Number(form.stock),
      year: Number(form.year),
      displacement: Number(form.displacement),
      transmission: form.transmission,
      brand: form.brand,
      category: form.category,
      availability: form.availability,
      color: form.color.split(",").map((c) => c.trim()).filter(Boolean),
      images: form.images.split(",").map((i) => i.trim()).filter(Boolean),
      thumbnail: form.thumbnail,
      description: { fr: form.descriptionFr, en: form.descriptionEn || form.descriptionFr },
      shortDescription: { fr: form.shortDescriptionFr, en: form.shortDescriptionEn || form.shortDescriptionFr },
      currency: form.currency,
      isPromotion: form.isPromotion,
      isNew: form.isNew,
      isPopular: form.isPopular,
      isActive: form.isActive,
      specifications: specs.filter((s) => s.label.trim() && s.value.trim()),
      datasheet,
    };
    try {
      if (id) {
        await updateMotorcycle(id, payload);
        toast.success("Moto mise à jour");
      } else {
        await createMotorcycle(payload);
        toast.success("Moto créée");
      }
      router.push("/admin/motos/");
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
            <Form.Control value={form.slug} onChange={(e) => handleChange("slug", e.target.value)} placeholder="genere-auto" />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Référence</Form.Label>
            <Form.Control value={form.reference} onChange={(e) => handleChange("reference", e.target.value)} required />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Marque</Form.Label>
            <Form.Select value={form.brand} onChange={(e) => handleChange("brand", e.target.value)} required>
              <option value="">Sélectionner</option>
              {brands.map((b) => (
                <option key={b._id} value={b._id}>{b.name}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Catégorie</Form.Label>
            <Form.Select value={form.category} onChange={(e) => handleChange("category", e.target.value)} required>
              <option value="">Sélectionner</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name.fr}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Prix</Form.Label>
            <Form.Control type="number" value={form.price} onChange={(e) => handleChange("price", Number(e.target.value))} required />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Ancien prix</Form.Label>
            <Form.Control type="number" value={form.oldPrice ?? ""} onChange={(e) => handleChange("oldPrice", e.target.value ? Number(e.target.value) : null)} />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Devise</Form.Label>
            <Form.Control value={form.currency} onChange={(e) => handleChange("currency", e.target.value)} />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Stock</Form.Label>
            <Form.Control type="number" value={form.stock} onChange={(e) => handleChange("stock", Number(e.target.value))} required />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Année</Form.Label>
            <Form.Control type="number" value={form.year} onChange={(e) => handleChange("year", Number(e.target.value))} required />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Cylindrée</Form.Label>
            <Form.Control type="number" value={form.displacement} onChange={(e) => handleChange("displacement", Number(e.target.value))} required />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Transmission</Form.Label>
            <Form.Control value={form.transmission} onChange={(e) => handleChange("transmission", e.target.value)} required />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Couleurs (séparées par des virgules)</Form.Label>
            <Form.Control value={form.color} onChange={(e) => handleChange("color", e.target.value)} required />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Disponibilité</Form.Label>
            <Form.Select value={form.availability} onChange={(e) => handleChange("availability", e.target.value)}>
              <option value="in_stock">En stock</option>
              <option value="out_of_stock">Rupture</option>
              <option value="pre_order">Précommande</option>
              <option value="coming_soon">Bientôt</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Miniature (URL)</Form.Label>
            <Form.Control value={form.thumbnail} onChange={(e) => handleChange("thumbnail", e.target.value)} required />
          </Form.Group>
        </Col>
        <Col xs={12}>
          <Form.Group>
            <Form.Label>Images (URLs séparées par des virgules)</Form.Label>
            <Form.Control value={form.images} onChange={(e) => handleChange("images", e.target.value)} required />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Description courte (FR)</Form.Label>
            <Form.Control as="textarea" rows={2} value={form.shortDescriptionFr} onChange={(e) => handleChange("shortDescriptionFr", e.target.value)} required />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Description courte (EN)</Form.Label>
            <Form.Control as="textarea" rows={2} value={form.shortDescriptionEn} onChange={(e) => handleChange("shortDescriptionEn", e.target.value)} required />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Description (FR)</Form.Label>
            <Form.Control as="textarea" rows={4} value={form.descriptionFr} onChange={(e) => handleChange("descriptionFr", e.target.value)} required />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Description (EN)</Form.Label>
            <Form.Control as="textarea" rows={4} value={form.descriptionEn} onChange={(e) => handleChange("descriptionEn", e.target.value)} required />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Check type="switch" checked={form.isPromotion} onChange={(e) => handleChange("isPromotion", e.target.checked)} label="Promotion" />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Check type="switch" checked={form.isNew} onChange={(e) => handleChange("isNew", e.target.checked)} label="Nouveauté" />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Check type="switch" checked={form.isPopular} onChange={(e) => handleChange("isPopular", e.target.checked)} label="Populaire" />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Actif</Form.Label>
            <Form.Check
              type="switch"
              checked={form.isActive}
              onChange={(e) => handleChange("isActive", e.target.checked)}
              label="Visible sur le site"
            />
          </Form.Group>
        </Col>

        <Col xs={12}>
          <Form.Group>
            <Form.Label className="fw-bold">Fiche technique PDF</Form.Label>
            <div className="d-flex align-items-center gap-3">
              <Form.Control
                type="file"
                accept="application/pdf"
                onChange={handlePdfUpload}
                disabled={pdfUploading}
              />
              {pdfUploading && <span className="text-muted small">Upload en cours...</span>}
            </div>
            {datasheet && (
              <div className="mt-2 d-flex align-items-center gap-2">
                <a href={datasheet} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                  📄 Voir le PDF actuel
                </a>
                <Button variant="outline-danger" size="sm" onClick={() => setDatasheet("")}>
                  Supprimer
                </Button>
              </div>
            )}
          </Form.Group>
        </Col>

        <Col xs={12}>
          <hr />
          <div className="d-flex justify-content-between align-items-center mb-2">
            <Form.Label className="mb-0 fw-bold">Fiche technique</Form.Label>
            <Button type="button" variant="outline-primary" size="sm" onClick={addSpecRow}>
              + Ajouter une ligne
            </Button>
          </div>
          <div className="table-responsive">
            <table className="table table-bordered table-sm align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ width: "45%" }}>Spécification</th>
                  <th style={{ width: "50%" }}>Détail</th>
                  <th style={{ width: "5%" }}></th>
                </tr>
              </thead>
              <tbody>
                {specs.map((row, i) => (
                  <tr key={i}>
                    <td>
                      <Form.Control
                        size="sm"
                        placeholder="ex: Type de moteur"
                        value={row.label}
                        onChange={(e) => updateSpec(i, "label", e.target.value)}
                      />
                    </td>
                    <td>
                      <Form.Control
                        size="sm"
                        placeholder="ex: Monocylindre 4 temps"
                        value={row.value}
                        onChange={(e) => updateSpec(i, "value", e.target.value)}
                      />
                    </td>
                    <td className="text-center">
                      <Button
                        type="button"
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removeSpecRow(i)}
                        disabled={specs.length === 1}
                      >
                        &times;
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Col>
      </Row>
      <div className="d-flex gap-2 mt-4">
        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? "Enregistrement..." : id ? "Mettre à jour" : "Créer"}
        </Button>
        <Button variant="outline-secondary" onClick={() => router.push("/admin/motos/")}>
          Annuler
        </Button>
      </div>
    </Form>
  );
}
