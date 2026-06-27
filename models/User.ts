import mongoose, { Schema } from "mongoose";
import { IUser } from "@/types";

const AddressSchema = new Schema(
  {
    label: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true, default: "Côte d'Ivoire" },
    isDefault: { type: Boolean, default: false },
  },
  { _id: false }
);

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    phone: { type: String, default: "" },
    role: {
      type: String,
      enum: ["admin", "sales", "warehouse", "customer"],
      default: "customer",
    },
    isActive: { type: Boolean, default: true },
    emailVerified: { type: Boolean, default: false },
    avatar: { type: String, default: "" },
    favorites: [{ type: Schema.Types.ObjectId, ref: "Motorcycle" }],
    addresses: [AddressSchema],
  },
  { timestamps: true }
);

UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
