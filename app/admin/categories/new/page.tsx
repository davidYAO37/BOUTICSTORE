"use client";

import React from "react";
import CategoryForm from "@/components/admin/CategoryForm";

export default function NewCategoryPage() {
  return (
    <div>
      <h2 className="mb-4">Nouvelle catégorie</h2>
      <CategoryForm />
    </div>
  );
}
