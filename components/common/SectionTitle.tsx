"use client";

import React from "react";
import { motion } from "framer-motion";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
}

export default function SectionTitle({ title, subtitle, centered = false, light = false }: SectionTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className={`mb-4 ${centered ? "text-center" : ""}`}
    >
      <h2
        className={`section-title ${centered ? "text-center" : ""}`}
        style={{ color: light ? "#ffffff" : "var(--body-color)" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-3 ${light ? "text-white-50" : "text-muted"}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
