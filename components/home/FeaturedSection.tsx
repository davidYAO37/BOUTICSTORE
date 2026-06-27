"use client";

import React from "react";
import Link from "next/link";
import { Container, Button } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { FaArrowRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import MotorcycleCard from "@/components/common/MotorcycleCard";
import SectionTitle from "@/components/common/SectionTitle";
import { useLocale } from "@/hooks/useLocale";

interface FeaturedSectionProps {
  title: string;
  subtitle?: string;
  motos: Array<{
    _id: string;
    slug: string;
    name: string;
    reference: string;
    thumbnail: string;
    price: number;
    oldPrice?: number | null;
    currency: string;
    availability: string;
    stock: number;
    brand?: { name: string; slug: string };
    category?: { name: { fr: string; en: string }; slug: string };
    isPromotion?: boolean;
    isNew?: boolean;
    isPopular?: boolean;
    displacement?: number;
    year?: number;
  }>;
  linkHref?: string;
  linkLabel?: string;
  dark?: boolean;
}

export default function FeaturedSection({
  title,
  subtitle,
  motos,
  linkHref,
  linkLabel,
  dark = false,
}: FeaturedSectionProps) {
  const { locale } = useLocale();

  if (!motos.length) return null;

  return (
    <section className="py-5" style={{ backgroundColor: dark ? "var(--secondary)" : "var(--body-bg)" }}>
      <Container>
        <div className="d-flex flex-wrap justify-content-between align-items-end mb-4">
          <SectionTitle title={title} subtitle={subtitle} light={dark} />
          {linkHref && (
            <Link
              href={linkHref}
              className={`btn ${dark ? "btn-outline-light" : "btn-outline-primary"} d-flex align-items-center gap-2 mb-3`}
            >
              {linkLabel || (locale === "fr" ? "Voir tout" : "See all")} <FaArrowRight />
            </Link>
          )}
        </div>

        <div className="position-relative">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation={{
              nextEl: ".swiper-button-next-custom",
              prevEl: ".swiper-button-prev-custom",
            }}
            pagination={{ clickable: true, dynamicBullets: true }}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              576: { slidesPerView: 2 },
              992: { slidesPerView: 3 },
              1200: { slidesPerView: 4 },
            }}
            className="pb-5"
          >
            {motos.map((moto) => (
              <SwiperSlide key={moto._id}>
                <MotorcycleCard moto={moto} />
              </SwiperSlide>
            ))}
          </Swiper>
          <button
            className="swiper-button-prev-custom position-absolute top-50 start-0 translate-middle-y btn btn-light rounded-circle shadow-sm d-none d-lg-flex"
            style={{ width: 44, height: 44, zIndex: 10 }}
            aria-label="Précédent"
          >
            <FaChevronLeft />
          </button>
          <button
            className="swiper-button-next-custom position-absolute top-50 end-0 translate-middle-y btn btn-light rounded-circle shadow-sm d-none d-lg-flex"
            style={{ width: 44, height: 44, zIndex: 10 }}
            aria-label="Suivant"
          >
            <FaChevronRight />
          </button>
        </div>
      </Container>
    </section>
  );
}
