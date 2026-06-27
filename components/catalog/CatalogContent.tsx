"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Container, Row, Col, Form, Button, Offcanvas, Pagination, Badge } from "react-bootstrap";
import { FaFilter, FaSearch, FaTimes, FaSort } from "react-icons/fa";
import MotorcycleCard from "@/components/common/MotorcycleCard";
import SectionTitle from "@/components/common/SectionTitle";
import { useLocale } from "@/hooks/useLocale";
import { getMotorcycles, getBrands, getCategories } from "@/services/api";
import { DISPLACEMENT_RANGES, TRANSMISSION_OPTIONS, YEARS } from "@/lib/constants";
import { debounce } from "@/lib/utils";

interface FilterState {
  search: string;
  brand: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  color: string;
  transmission: string;
  availability: string;
  year: string;
  minDisplacement: string;
  maxDisplacement: string;
  sort: string;
  order: string;
}

const initialFilters: FilterState = {
  search: "",
  brand: "",
  category: "",
  minPrice: "",
  maxPrice: "",
  color: "",
  transmission: "",
  availability: "",
  year: "",
  minDisplacement: "",
  maxDisplacement: "",
  sort: "createdAt",
  order: "desc",
};

const sortOptions = [
  { value: "price_asc", label: "Prix croissant" },
  { value: "price_desc", label: "Prix décroissant" },
  { value: "popularity", label: "Popularité" },
  { value: "newest", label: "Nouveautés" },
];

const availabilityOptions = [
  { value: "in_stock", label: "En stock" },
  { value: "out_of_stock", label: "Rupture" },
  { value: "pre_order", label: "Précommande" },
  { value: "coming_soon", label: "Bientôt" },
];

const colorOptions = ["Rouge", "Noir", "Blanc", "Bleu", "Gris", "Jaune", "Vert"];

export default function CatalogContent() {
  const { locale } = useLocale();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<FilterState>({
    ...initialFilters,
    search: searchParams.get("search") || "",
    brand: searchParams.get("brand") || "",
    category: searchParams.get("category") || "",
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [motos, setMotos] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [brands, setBrands] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [sortValue, orderValue] = filters.sort.includes("_")
        ? filters.sort.split("_")
        : [filters.sort, filters.order];

      const params: Record<string, string | number | undefined> = {
        page,
        limit: 12,
        search: filters.search,
        brand: filters.brand,
        category: filters.category,
        minPrice: filters.minPrice ? parseInt(filters.minPrice, 10) : undefined,
        maxPrice: filters.maxPrice ? parseInt(filters.maxPrice, 10) : undefined,
        color: filters.color,
        transmission: filters.transmission,
        availability: filters.availability,
        year: filters.year ? parseInt(filters.year, 10) : undefined,
        minDisplacement: filters.minDisplacement ? parseInt(filters.minDisplacement, 10) : undefined,
        maxDisplacement: filters.maxDisplacement ? parseInt(filters.maxDisplacement, 10) : undefined,
        sort: sortValue,
        order: orderValue,
      };

      const [motosData, brandsData, categoriesData] = await Promise.all([
        getMotorcycles(params),
        getBrands(),
        getCategories(),
      ]);

      setMotos(motosData.data || []);
      setTotalPages(motosData.meta?.totalPages || 1);
      setBrands(brandsData.data || []);
      setCategories(categoriesData.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetch = useCallback(debounce(fetchData, 300), [fetchData]);

  useEffect(() => {
    debouncedFetch();
  }, [filters, page, debouncedFetch]);

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    setPage(1);
  };

  const activeFiltersCount = Object.entries(filters).filter(
    ([key, value]) => value && key !== "sort" && key !== "order"
  ).length;

  const FilterContent = () => (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">{locale === "fr" ? "Filtres" : "Filters"}</h5>
        {activeFiltersCount > 0 && (
          <Button variant="link" size="sm" onClick={clearFilters} className="text-danger">
            <FaTimes /> {locale === "fr" ? "Réinitialiser" : "Reset"}
          </Button>
        )}
      </div>

      <Form.Group className="mb-3">
        <Form.Label>{locale === "fr" ? "Recherche" : "Search"}</Form.Label>
        <div className="position-relative">
          <Form.Control
            type="search"
            placeholder={locale === "fr" ? "Nom, référence..." : "Name, reference..."}
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
          />
          <FaSearch className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted" />
        </div>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>{locale === "fr" ? "Marque" : "Brand"}</Form.Label>
        <Form.Select value={filters.brand} onChange={(e) => updateFilter("brand", e.target.value)}>
          <option value="">{locale === "fr" ? "Toutes" : "All"}</option>
          {brands.map((brand: { _id: string; name: string; slug: string }) => (
            <option key={brand._id} value={brand.slug}>{brand.name}</option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>{locale === "fr" ? "Catégorie" : "Category"}</Form.Label>
        <Form.Select value={filters.category} onChange={(e) => updateFilter("category", e.target.value)}>
          <option value="">{locale === "fr" ? "Toutes" : "All"}</option>
          {categories.map((category: { _id: string; name: { fr: string; en: string }; slug: string }) => (
            <option key={category._id} value={category.slug}>{category.name[locale as keyof typeof category.name]}</option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>{locale === "fr" ? "Prix" : "Price"}</Form.Label>
        <div className="d-flex gap-2">
          <Form.Control
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => updateFilter("minPrice", e.target.value)}
          />
          <Form.Control
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => updateFilter("maxPrice", e.target.value)}
          />
        </div>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>{locale === "fr" ? "Cylindrée" : "Displacement"}</Form.Label>
        <Form.Select value={`${filters.minDisplacement}-${filters.maxDisplacement}`} onChange={(e) => {
          const [min, max] = e.target.value.split("-");
          updateFilter("minDisplacement", min || "");
          updateFilter("maxDisplacement", max || "");
        }}>
          <option value="-">{locale === "fr" ? "Toutes" : "All"}</option>
          {DISPLACEMENT_RANGES.map((range: { label: string; min: number; max: number }) => (
            <option key={range.label} value={`${range.min}-${range.max}`}>{range.label}</option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>{locale === "fr" ? "Couleur" : "Color"}</Form.Label>
        <Form.Select value={filters.color} onChange={(e) => updateFilter("color", e.target.value)}>
          <option value="">{locale === "fr" ? "Toutes" : "All"}</option>
          {colorOptions.map((color) => (
            <option key={color} value={color}>{color}</option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>{locale === "fr" ? "Transmission" : "Transmission"}</Form.Label>
        <Form.Select value={filters.transmission} onChange={(e) => updateFilter("transmission", e.target.value)}>
          <option value="">{locale === "fr" ? "Toutes" : "All"}</option>
          {TRANSMISSION_OPTIONS.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>{locale === "fr" ? "Disponibilité" : "Availability"}</Form.Label>
        <Form.Select value={filters.availability} onChange={(e) => updateFilter("availability", e.target.value)}>
          <option value="">{locale === "fr" ? "Toutes" : "All"}</option>
          {availabilityOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>{locale === "fr" ? "Année" : "Year"}</Form.Label>
        <Form.Select value={filters.year} onChange={(e) => updateFilter("year", e.target.value)}>
          <option value="">{locale === "fr" ? "Toutes" : "All"}</option>
          {YEARS.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </Form.Select>
      </Form.Group>
    </>
  );

  return (
    <section className="py-5">
      <Container>
        <SectionTitle
          title={locale === "fr" ? "Notre catalogue" : "Our catalog"}
          subtitle={locale === "fr" ? "Trouvez la moto de vos rêves parmi notre sélection" : "Find your dream motorcycle among our selection"}
          centered
        />

        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
          <div className="d-flex gap-2 align-items-center">
            <Button variant="outline-primary" className="d-lg-none d-flex align-items-center gap-2" onClick={() => setShowFilters(true)}>
              <FaFilter /> {locale === "fr" ? "Filtres" : "Filters"}
              {activeFiltersCount > 0 && (
                <Badge bg="primary" pill>{activeFiltersCount}</Badge>
              )}
            </Button>
            <span className="text-muted small">
              {loading ? "..." : `${motos.length} ${locale === "fr" ? "résultats" : "results"}`}
            </span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <FaSort className="text-muted" />
            <Form.Select
              style={{ width: "auto" }}
              value={filters.sort}
              onChange={(e) => updateFilter("sort", e.target.value)}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </Form.Select>
          </div>
        </div>

        <Row>
          <Col lg={3} className="d-none d-lg-block">
            <div className="card p-3 border-0 shadow-sm sticky-top" style={{ top: 100 }}>
              <FilterContent />
            </div>
          </Col>

          <Col lg={9}>
            {loading ? (
              <Row className="g-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Col key={i} md={6} lg={4}>
                    <div className="card h-100 border-0">
                      <div className="skeleton" style={{ aspectRatio: "4/3" }} />
                      <div className="p-3">
                        <div className="skeleton w-75 mb-2" style={{ height: 20 }} />
                        <div className="skeleton w-50" style={{ height: 16 }} />
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            ) : motos.length === 0 ? (
              <div className="text-center py-5">
                <h4>{locale === "fr" ? "Aucun résultat" : "No results"}</h4>
                <p className="text-muted">{locale === "fr" ? "Essayez d'autres critères de recherche" : "Try different search criteria"}</p>
                <Button variant="primary" onClick={clearFilters}>
                  {locale === "fr" ? "Réinitialiser les filtres" : "Reset filters"}
                </Button>
              </div>
            ) : (
              <>
                <Row className="g-4">
                  {motos.map((moto: any) => (
                    <Col key={moto._id} md={6} lg={4}>
                      <MotorcycleCard moto={moto} />
                    </Col>
                  ))}
                </Row>
                {totalPages > 1 && (
                  <Pagination className="justify-content-center mt-4">
                    <Pagination.Prev onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} />
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <Pagination.Item key={p} active={p === page} onClick={() => setPage(p)}>
                        {p}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} />
                  </Pagination>
                )}
              </>
            )}
          </Col>
        </Row>
      </Container>

      <Offcanvas show={showFilters} onHide={() => setShowFilters(false)} placement="start" className="d-lg-none">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{locale === "fr" ? "Filtres" : "Filters"}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <FilterContent />
        </Offcanvas.Body>
      </Offcanvas>
    </section>
  );
}
