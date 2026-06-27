import mongoose, { Schema } from "mongoose";
import { IQuote } from "@/types";

const QuoteSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    motorcycle: { type: Schema.Types.ObjectId, ref: "Motorcycle", required: true },
    message: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "processing", "sent", "accepted", "rejected"],
      default: "pending",
    },
    price: { type: Number, min: 0, default: null },
    adminNotes: { type: String, default: "" },
  },
  { timestamps: true }
);

QuoteSchema.index({ motorcycle: 1 });
QuoteSchema.index({ status: 1 });
QuoteSchema.index({ createdAt: -1 });

export default mongoose.models.Quote || mongoose.model<IQuote>("Quote", QuoteSchema);
