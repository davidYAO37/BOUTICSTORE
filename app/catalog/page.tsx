import CatalogContent from "@/components/catalog/CatalogContent";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="py-5 text-center">Chargement...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
