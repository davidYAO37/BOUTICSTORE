import mongoose, { Schema } from "mongoose";
import { ITestRide } from "@/types";

const TestRideSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    motorcycle: { type: Schema.Types.ObjectId, ref: "Motorcycle", required: true },
    store: { type: Schema.Types.ObjectId, ref: "Store", default: null },
    preferredDate: { type: Date, required: true },
    preferredTime: { type: String, required: true },
    message: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

TestRideSchema.index({ motorcycle: 1 });
TestRideSchema.index({ status: 1 });
TestRideSchema.index({ preferredDate: 1 });
TestRideSchema.index({ createdAt: -1 });

export default mongoose.models.TestRide || mongoose.model<ITestRide>("TestRide", TestRideSchema);
