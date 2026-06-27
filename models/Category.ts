import mongoose, { Schema } from "mongoose";
import { ICategory } from "@/types";

const localizedStringSchema = {
  fr: { type: String, required: true },
  en: { type: String, required: true },
};

const CategorySchema: Schema = new Schema(
  {
    name: { type: localizedStringSchema, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: localizedStringSchema, default: { fr: "", en: "" } },
    image: { type: String, default: "" },
    icon: { type: String, default: "" },
    parent: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

CategorySchema.index({ isActive: 1 });
CategorySchema.index({ parent: 1 });

export default mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);
