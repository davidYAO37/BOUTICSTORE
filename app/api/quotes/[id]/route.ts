export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Quote } from "@/models";
import {
  successResponse,
  internalErrorResponse,
  validationErrorResponse,
  notFoundResponse,
} from "@/lib/api-response";
import { z } from "zod";

const quoteUpdateSchema = z.object({
  status: z.enum(["pending", "processing", "sent", "accepted", "rejected"]).optional(),
  adminNotes: z.string().optional(),
  price: z.number().min(0).optional().nullable(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const quote = await Quote.findById(id)
      .populate("motorcycle", "name slug thumbnail price")
      .lean();
    if (!quote) return notFoundResponse("Devis non trouvé");
    return successResponse(quote);
  } catch (error) {
    return internalErrorResponse(error);
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();
    const result = quoteUpdateSchema.safeParse(body);

    if (!result.success) {
      const formattedErrors: Record<string, string[]> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (!formattedErrors[path]) formattedErrors[path] = [];
        formattedErrors[path].push(issue.message);
      });
      return validationErrorResponse(formattedErrors);
    }

    const quote = await Quote.findByIdAndUpdate(id, result.data, { new: true })
      .populate("motorcycle", "name slug thumbnail price");
    if (!quote) return notFoundResponse("Devis non trouvé");
    return successResponse(quote, "Devis mis à jour");
  } catch (error) {
    return internalErrorResponse(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const quote = await Quote.findByIdAndDelete(id);
    if (!quote) return notFoundResponse("Devis non trouvé");
    return successResponse(null, "Devis supprimé");
  } catch (error) {
    return internalErrorResponse(error);
  }
}
