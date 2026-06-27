export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Order } from "@/models";
import {
  successResponse,
  internalErrorResponse,
  validationErrorResponse,
  notFoundResponse,
} from "@/lib/api-response";
import { z } from "zod";

const orderUpdateSchema = z.object({
  status: z.enum(["pending", "confirmed", "paid", "processing", "shipped", "delivered", "cancelled"]).optional(),
  notes: z.string().optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const order = await Order.findById(id)
      .populate("user", "firstName lastName email")
      .populate("items.motorcycle", "name slug thumbnail")
      .lean();
    if (!order) return notFoundResponse("Commande non trouvée");
    return successResponse(order);
  } catch (error) {
    return internalErrorResponse(error);
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();
    const result = orderUpdateSchema.safeParse(body);

    if (!result.success) {
      const formattedErrors: Record<string, string[]> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (!formattedErrors[path]) formattedErrors[path] = [];
        formattedErrors[path].push(issue.message);
      });
      return validationErrorResponse(formattedErrors);
    }

    const order = await Order.findByIdAndUpdate(id, result.data, { new: true })
      .populate("user", "firstName lastName email")
      .populate("items.motorcycle", "name slug thumbnail");
    if (!order) return notFoundResponse("Commande non trouvée");
    return successResponse(order, "Commande mise à jour");
  } catch (error) {
    return internalErrorResponse(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const order = await Order.findByIdAndDelete(id);
    if (!order) return notFoundResponse("Commande non trouvée");
    return successResponse(null, "Commande supprimée");
  } catch (error) {
    return internalErrorResponse(error);
  }
}
