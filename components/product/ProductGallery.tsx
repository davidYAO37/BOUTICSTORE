"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Modal, Button } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, Pagination } from "swiper/modules";
import { FaExpand, FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [showZoom, setShowZoom] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  const mainImage = images[activeIndex] || "/images/placeholder.jpg";

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const handleMouseEnter = () => setShowZoom(true);
  const handleMouseLeave = () => setShowZoom(false);

  return (
    <div className="product-gallery">
      <div
        ref={imageRef}
        className="position-relative rounded overflow-hidden mb-3"
        style={{ aspectRatio: "4/3", cursor: "crosshair", backgroundColor: "var(--gray-100)" }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Image
          src={mainImage}
          alt={productName}
          fill
          className="object-fit-contain"
          sizes="(max-width: 991px) 100vw, 50vw"
          priority
        />
        {showZoom && (
          <div
            className="zoom-lens"
            style={{
              width: 120,
              height: 120,
              left: `calc(${zoomPosition.x}% - 60px)`,
              top: `calc(${zoomPosition.y}% - 60px)`,
              display: "block",
            }}
          />
        )}
        <div
          className="zoom-result"
          style={{
            display: showZoom ? "block" : "none",
            backgroundImage: `url(${mainImage})`,
            backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
            backgroundSize: "200%",
          }}
        />
        <button
          className="btn btn-light btn-sm position-absolute top-0 end-0 m-2 rounded-circle d-flex align-items-center justify-content-center"
          style={{ width: 40, height: 40 }}
          onClick={() => setShowFullscreen(true)}
          aria-label="Plein écran"
        >
          <FaExpand />
        </button>
      </div>

      <div className="position-relative">
        <Swiper
          modules={[Navigation, Thumbs]}
          navigation={{
            nextEl: ".thumb-next",
            prevEl: ".thumb-prev",
          }}
          spaceBetween={12}
          slidesPerView={4}
          watchSlidesProgress
          className="product-thumbnails"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <button
                className={`border-0 p-0 rounded overflow-hidden w-100 ${activeIndex === index ? "ring-2 ring-primary" : ""}`}
                style={{
                  aspectRatio: "4/3",
                  position: "relative",
                  border: activeIndex === index ? "3px solid var(--primary)" : "1px solid var(--border-color)",
                  backgroundColor: "var(--gray-100)",
                }}
                onClick={() => setActiveIndex(index)}
                aria-label={`Voir l'image ${index + 1}`}
              >
                <Image
                  src={image}
                  alt={`${productName} - ${index + 1}`}
                  fill
                  className="object-fit-contain"
                  sizes="120px"
                />
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
        <button className="thumb-prev position-absolute top-50 start-0 translate-middle-y btn btn-light btn-sm rounded-circle shadow-sm" style={{ width: 32, height: 32, zIndex: 10 }} aria-label="Précédent">
          <FaChevronLeft />
        </button>
        <button className="thumb-next position-absolute top-50 end-0 translate-middle-y btn btn-light btn-sm rounded-circle shadow-sm" style={{ width: 32, height: 32, zIndex: 10 }} aria-label="Suivant">
          <FaChevronRight />
        </button>
      </div>

      <Modal show={showFullscreen} onHide={() => setShowFullscreen(false)} size="xl" centered fullscreen>
        <Modal.Header className="border-0">
          <Modal.Title>{productName}</Modal.Title>
          <Button variant="link" className="text-dark" onClick={() => setShowFullscreen(false)}>
            <FaTimes size={24} />
          </Button>
        </Modal.Header>
        <Modal.Body className="d-flex align-items-center justify-content-center bg-dark">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            initialSlide={activeIndex}
            className="w-100 h-100"
            style={{ maxHeight: "80vh" }}
          >
            {images.map((image, index) => (
              <SwiperSlide key={index} className="d-flex align-items-center justify-content-center">
                <div className="position-relative" style={{ width: "100%", height: "70vh" }}>
                  <Image
                    src={image}
                    alt={`${productName} - ${index + 1}`}
                    fill
                    className="object-fit-contain"
                    sizes="100vw"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </Modal.Body>
      </Modal>
    </div>
  );
}
