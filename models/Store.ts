import mongoose, { Schema } from "mongoose";
import { IStore } from "@/types";

const localizedStringSchema = {
  fr: { type: String, required: true },
  en: { type: String, required: true },
};

const StoreSchema: Schema = new Schema(
  {
    name: { type: localizedStringSchema, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true, default: "Côte d'Ivoire" },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    whatsapp: { type: String, default: "" },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    openingHours: { type: localizedStringSchema, default: { fr: "", en: "" } },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

StoreSchema.index({ coordinates: "2dsphere" });
StoreSchema.index({ isActive: 1 });
StoreSchema.index({ city: 1 });

export default mongoose.models.Store || mongoose.model<IStore>("Store", StoreSchema);
