"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { FaArrowRight, FaPhone } from "react-icons/fa";
import { motion } from "framer-motion";
import { CONTACT } from "@/lib/constants";
import { useLocale } from "@/hooks/useLocale";

const slides = [
  {
    id: 1,
    image: "/images/motos/magazin.jpg",
    title: { fr: "Trouvez la moto de vos rêves", en: "Find your dream motorcycle" },
    subtitle: { fr: "Large choix de motos neuves et occasions en Côte d'Ivoire", en: "Wide selection of new and used motorcycles in Ivory Coast" },
    cta: { fr: "Découvrir nos motos", en: "Discover our motorcycles" },
    href: "/catalog/",
  },
  {
    id: 2,
    image: "/images/motos/apsonic-200gy-7-2.jpg",
    title: { fr: "Service premium garanti", en: "Premium service guaranteed" },
    subtitle: { fr: "Mécanique, pièces détachées et entretien par des experts", en: "Mechanics, spare parts and maintenance by experts" },
    cta: { fr: "Nos services", en: "Our services" },
    href: "/services/",
  },
  {
    id: 3,
    image: "/images/motos/apsonic-125-aloba.jpg",
    title: { fr: "Promotions exclusives", en: "Exclusive promotions" },
    subtitle: { fr: "Profitez de nos offres spéciales et financements avantageux", en: "Take advantage of our special offers and advantageous financing" },
    cta: { fr: "Voir les promotions", en: "See promotions" },
    href: "/promotions/",
  },
];

export default function HeroSlider() {
  const { locale } = useLocale();
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="hero-slider bg-dark" style={{ height: "600px", borderRadius: "var(--radius-xl)" }}>
        <Container className="h-100 d-flex align-items-center">
          <div className="skeleton w-50" style={{ height: "200px" }} />
        </Container>
      </div>
    );
  }

  return (
    <section className="py-3">
      <Container>
        <div className="hero-slider" style={{ height: "600px" }}>
          <Swiper
            modules={[Autoplay, Pagination, Navigation, EffectFade]}
            effect="fade"
            autoplay={{ delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            pagination={{ clickable: true, dynamicBullets: true }}
            navigation
            loop
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            className="h-100"
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={slide.id}>
                <div className="position-relative h-100">
                  <Image
                    src={slide.image}
                    alt={slide.title[locale]}
                    fill
                    className="object-fit-cover"
                    priority={index === 0}
                    sizes="100vw"
                  />
                  <div className="slide-content">
                    <Container>
                      <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={activeIndex === index ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="max-w-2xl"
                      >
                        <h1 className="display-3 fw-bold text-white mb-3">
                          {slide.title[locale]}
                        </h1>
                        <p className="lead text-white-80 mb-4" style={{ maxWidth: 600 }}>
                          {slide.subtitle[locale]}
                        </p>
                        <div className="d-flex flex-wrap gap-3">
                          <Link href={slide.href} className="btn btn-primary btn-lg d-flex align-items-center gap-2">
                            {slide.cta[locale]} <FaArrowRight />
                          </Link>
                          <a
                            href={`tel:${CONTACT.phone}`}
                            className="btn btn-outline-light btn-lg d-flex align-items-center gap-2"
                          >
                            <FaPhone /> {CONTACT.phone}
                          </a>
                        </div>
                      </motion.div>
                    </Container>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </Container>
    </section>
  );
}
