"use client";

import React from "react";
import { Container } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import MotorcycleCard from "@/components/common/MotorcycleCard";
import SectionTitle from "@/components/common/SectionTitle";
interface SimilarProductsProps {
  title: string;
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
}

export default function SimilarProducts({ title, motos }: SimilarProductsProps) {
  if (!motos.length) return null;

  return (
    <section className="py-5" style={{ backgroundColor: "var(--gray-100)" }}>
      <Container>
        <SectionTitle title={title} centered />
        <Swiper
          modules={[Navigation, Pagination]}
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
      </Container>
    </section>
  );
}
