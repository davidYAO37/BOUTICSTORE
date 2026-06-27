export const dynamic = "force-dynamic";

import { Metadata } from "next";
import ContactContent from "@/components/contact/ContactContent";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez Ivoire Motos pour toute question sur nos motos, services, pièces détachées ou pour prendre rendez-vous.",
};

export default function ContactPage() {
  return <ContactContent />;
}
