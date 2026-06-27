import mongoose, { Schema } from "mongoose";
import { IOrder } from "@/types";

const AddressSchema = new Schema(
  {
    label: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { _id: false }
);

const OrderItemSchema = new Schema(
  {
    motorcycle: { type: Schema.Types.ObjectId, ref: "Motorcycle", required: true },
    quantity: { type: Number, required: true, min: 1 },
    color: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const OrderSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [OrderItemSchema],
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "confirmed", "paid", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    paymentMethod: { type: String, required: true },
    shippingAddress: { type: AddressSchema, required: true },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

OrderSchema.index({ user: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
