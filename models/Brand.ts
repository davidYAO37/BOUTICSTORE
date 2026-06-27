import mongoose, { Schema } from "mongoose";
import { IBrand } from "@/types";

const localizedStringSchema = {
  fr: { type: String, required: true },
  en: { type: String, required: true },
};

const BrandSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    logo: { type: String, default: "" },
    description: { type: localizedStringSchema, default: { fr: "", en: "" } },
    country: { type: String, default: "" },
    website: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

BrandSchema.index({ name: "text" });
BrandSchema.index({ isActive: 1 });

export default mongoose.models.Brand || mongoose.model<IBrand>("Brand", BrandSchema);
