import mongoose, { Schema } from "mongoose";
import { IMotorcycle } from "@/types";

const localizedStringSchema = {
  fr: { type: String, required: true },
  en: { type: String, required: true },
};

const optionalLocalizedStringSchema = {
  fr: { type: String, default: "" },
  en: { type: String, default: "" },
};

const SpecificationSchema = new Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
    unit: { type: String, default: "" },
    category: { type: String, default: "" },
  },
  { _id: false }
);

const MotorcycleSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    reference: { type: String, required: true, unique: true, trim: true },
    brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    description: { type: localizedStringSchema, required: true },
    shortDescription: { type: localizedStringSchema, required: true },
    price: { type: Number, required: true, min: 0 },
    oldPrice: { type: Number, min: 0, default: null },
    currency: { type: String, default: "FCFA" },
    stock: { type: Number, required: true, min: 0, default: 0 },
    availability: {
      type: String,
      enum: ["in_stock", "out_of_stock", "pre_order", "coming_soon"],
      default: "in_stock",
    },
    year: { type: Number, required: true, min: 1900, max: 2100 },
    color: [{ type: String, required: true }],
    displacement: { type: Number, required: true, min: 0 },
    transmission: { type: String, required: true },
    engineType: { type: String, default: "" },
    power: { type: String, default: "" },
    torque: { type: String, default: "" },
    weight: { type: String, default: "" },
    seatHeight: { type: String, default: "" },
    fuelCapacity: { type: String, default: "" },
    consumption: { type: String, default: "" },
    images: [{ type: String, required: true }],
    thumbnail: { type: String, required: true },
    video: { type: String, default: "" },
    datasheet: { type: String, default: "" },
    specifications: [SpecificationSchema],
    features: [{ type: localizedStringSchema }],
    warranty: { type: String, default: "12 mois" },
    isPromotion: { type: Boolean, default: false },
    isNew: { type: Boolean, default: false },
    isPopular: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    metaTitle: { type: optionalLocalizedStringSchema },
    metaDescription: { type: optionalLocalizedStringSchema },
  },
  { timestamps: true, suppressReservedKeysWarning: true }
);

MotorcycleSchema.index({ name: "text", description: "text", reference: "text" });
MotorcycleSchema.index({ brand: 1 });
MotorcycleSchema.index({ category: 1 });
MotorcycleSchema.index({ price: 1 });
MotorcycleSchema.index({ displacement: 1 });
MotorcycleSchema.index({ year: 1 });
MotorcycleSchema.index({ isPromotion: 1 });
MotorcycleSchema.index({ isNew: 1 });
MotorcycleSchema.index({ isPopular: 1 });
MotorcycleSchema.index({ isActive: 1 });
MotorcycleSchema.index({ availability: 1 });
MotorcycleSchema.index({ transmission: 1 });
MotorcycleSchema.index({ color: 1 });

export default mongoose.models.Motorcycle || mongoose.model<IMotorcycle>("Motorcycle", MotorcycleSchema);
