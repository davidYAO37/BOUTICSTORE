"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Col, Row } from "react-bootstrap";
import { motion } from "framer-motion";
import { useLocale } from "@/hooks/useLocale";
import SectionTitle from "@/components/common/SectionTitle";

interface Category {
  _id: string;
  slug: string;
  name: { fr: string; en: string };
  image?: string;
  icon?: string;
}

interface CategoriesSectionProps {
  categories: Category[];
}

export default function CategoriesSection({ categories }: CategoriesSectionProps) {
  const { locale } = useLocale();

  return (
    <section className="py-5">
      <div className="container">
        <SectionTitle
          title={locale === "fr" ? "Nos catégories" : "Our categories"}
          subtitle={locale === "fr" ? "Trouvez la moto adaptée à vos besoins" : "Find the motorcycle that suits your needs"}
          centered
        />
        <Row className="g-4">
          {categories.slice(0, 6).map((category, index) => (
            <Col key={category._id} xs={6} md={4} lg={2}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link
                  href={`/catalog/?category=${category.slug}`}
                  className="card h-100 text-center text-decoration-none p-3 d-flex flex-column align-items-center justify-content-center"
                  style={{ minHeight: 180, backgroundColor: "var(--body-bg)" }}
                >
                  {category.image ? (
                    <div className="position-relative mb-3" style={{ width: 80, height: 80 }}>
                      <Image
                        src={category.image}
                        alt={category.name[locale]}
                        fill
                        className="object-fit-contain"
                      />
                    </div>
                  ) : (
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle mb-3"
                      style={{ width: 80, height: 80, backgroundColor: "var(--primary-light)", color: "var(--dark)" }}
                    >
                      <span className="fs-1">{category.icon || "🏍️"}</span>
                    </div>
                  )}
                  <h5 className="mb-0" style={{ color: "var(--body-color)" }}>
                    {category.name[locale]}
                  </h5>
                </Link>
              </motion.div>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
}
