"use client";

import React from "react";
import { ButtonGroup, Button } from "react-bootstrap";
import { FaWhatsapp, FaFacebookF, FaTwitter, FaEnvelope, FaLink } from "react-icons/fa";
import { shareUrl } from "@/lib/utils";
import { toast } from "react-toastify";

interface ShareButtonsProps {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    toast.success("Lien copié !");
  };

  return (
    <div className="d-flex align-items-center gap-2 flex-wrap">
      <span className="text-muted small">Partager :</span>
      <ButtonGroup>
        <Button
          variant="outline-success"
          size="sm"
          href={shareUrl("whatsapp", url, title)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
        >
          <FaWhatsapp />
        </Button>
        <Button
          variant="outline-primary"
          size="sm"
          href={shareUrl("facebook", url, title)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
        >
          <FaFacebookF />
        </Button>
        <Button
          variant="outline-dark"
          size="sm"
          href={shareUrl("twitter", url, title)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="X / Twitter"
        >
          <FaTwitter />
        </Button>
        <Button
          variant="outline-secondary"
          size="sm"
          href={shareUrl("email", url, title)}
          aria-label="Email"
        >
          <FaEnvelope />
        </Button>
        <Button variant="outline-secondary" size="sm" onClick={handleCopy} aria-label="Copier le lien">
          <FaLink />
        </Button>
      </ButtonGroup>
    </div>
  );
}
