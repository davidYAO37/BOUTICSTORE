"use client";

import React, { useEffect, useState } from "react";
import { Container, Card, Button, Alert } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { FaMapMarkerAlt, FaWhatsapp, FaMap } from "react-icons/fa";
import { useLocale } from "@/hooks/useLocale";
import { CONTACT, DEFAULT_STORE_COORDINATES, GOOGLE_MAPS_URL } from "@/lib/constants";
import { calculateDistance, getEstimatedTime } from "@/lib/utils";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface StoreMapProps {
  stores?: Array<{
    _id: string;
    name: { fr: string; en: string };
    address: string;
    city: string;
    phone: string;
    whatsapp?: string;
    coordinates: { lat: number; lng: number };
  }>;
}

const defaultIcon = L.icon({
  iconUrl: "/images/marker-icon.png",
  shadowUrl: "/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function StoreMap({ stores }: StoreMapProps) {
  const { locale } = useLocale();
  const [distance, setDistance] = useState<number | null>(null);
  const [error, setError] = useState("");

  const store = stores?.[0] || {
    _id: "default",
    name: { fr: "Magasin principal", en: "Main store" },
    address: CONTACT.address,
    city: "Abidjan",
    phone: CONTACT.phone,
    whatsapp: CONTACT.whatsapp,
    coordinates: DEFAULT_STORE_COORDINATES,
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setError(locale === "fr" ? "Géolocalisation non supportée" : "Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        const dist = calculateDistance(loc.lat, loc.lng, store.coordinates.lat, store.coordinates.lng);
        setDistance(dist);
      },
      () => setError(locale === "fr" ? "Impossible d'obtenir votre position" : "Unable to get your location")
    );
  }, [locale, store.coordinates.lat, store.coordinates.lng]);

  return (
    <section className="py-5">
      <Container>
        <h2 className="section-title mb-4">
          {locale === "fr" ? "Notre magasin" : "Our store"}
        </h2>
        <Card className="border-0 shadow-sm overflow-hidden">
          <div style={{ height: 400 }}>
            <MapContainer
              center={[store.coordinates.lat, store.coordinates.lng]}
              zoom={13}
              scrollWheelZoom={false}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[store.coordinates.lat, store.coordinates.lng]} icon={defaultIcon}>
                <Popup>
                  <strong>{store.name[locale]}</strong>
                  <br />
                  {store.address}
                  <br />
                  {store.phone}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
          <Card.Body>
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
              <div>
                <h5><FaMapMarkerAlt className="text-primary" /> {store.name[locale]}</h5>
                <p className="mb-1">{store.address}, {store.city}</p>
                <p className="mb-1">{store.phone}</p>
                {distance !== null && (
                  <p className="mb-0 text-muted">
                    {locale === "fr" ? "Distance" : "Distance"}: {distance.toFixed(1)} km
                    {" "}({getEstimatedTime(distance)} {locale === "fr" ? "min estimées" : "min estimated"})
                  </p>
                )}
                {error && <Alert variant="warning" className="mt-2 py-1">{error}</Alert>}
              </div>
              <div className="d-flex gap-2">
                <Button variant="outline-secondary" href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" className="d-flex align-items-center gap-2">
                  <FaMap /> Google Maps
                </Button>
                <Button variant="success" href={`https://wa.me/${store.whatsapp || CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer" className="d-flex align-items-center gap-2">
                  <FaWhatsapp /> WhatsApp
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </section>
  );
}
