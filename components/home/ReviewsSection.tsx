"use client";

import React from "react";
import { Container, Card } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { FaStar, FaQuoteLeft } from "react-icons/fa";
import { motion } from "framer-motion";
import { useLocale } from "@/hooks/useLocale";
import SectionTitle from "@/components/common/SectionTitle";

const reviews = [
  {
    id: 1,
    name: "Kouamé Jean",
    rating: 5,
    text: { fr: "Excellent service et très bon rapport qualité-prix. Je recommande vivement Ivoire Motos !", en: "Excellent service and great value for money. I highly recommend Ivoire Motos!" },
  },
  {
    id: 2,
    name: "Aminata Diallo",
    rating: 5,
    text: { fr: "L'équipe est très professionnelle et à l'écoute. J'ai trouvé la moto parfaite pour mes déplacements.", en: "The team is very professional and attentive. I found the perfect motorcycle for my commute." },
  },
  {
    id: 3,
    name: "Yao Serge",
    rating: 4,
    text: { fr: "Très bonne expérience d'achat. Le financement m'a permis d'obtenir ma moto rapidement.", en: "Very good buying experience. The financing allowed me to get my motorcycle quickly." },
  },
];

export default function ReviewsSection() {
  const { locale } = useLocale();

  return (
    <section className="py-5" style={{ backgroundColor: "var(--secondary)" }}>
      <Container>
        <SectionTitle
          title={locale === "fr" ? "Avis clients" : "Customer reviews"}
          subtitle={locale === "fr" ? "Ce que nos clients disent de nous" : "What our customers say about us"}
          centered
          light
        />
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            768: { slidesPerView: 2 },
            992: { slidesPerView: 3 },
          }}
          className="pb-5"
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <Card className="h-100 border-0 p-4">
                  <Card.Body>
                    <FaQuoteLeft className="text-primary mb-3" size={24} />
                    <div className="d-flex gap-1 mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar
                          key={i}
                          color={i < review.rating ? "var(--primary)" : "var(--gray-300)"}
                          size={16}
                        />
                      ))}
                    </div>
                    <Card.Text className="mb-3">{review.text[locale]}</Card.Text>
                    <Card.Title as="h6" className="mb-0">
                      {review.name}
                    </Card.Title>
                  </Card.Body>
                </Card>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </section>
  );
}
