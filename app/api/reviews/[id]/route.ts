export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Review } from "@/models";
import {
  successResponse,
  internalErrorResponse,
  validationErrorResponse,
  notFoundResponse,
} from "@/lib/api-response";
import { z } from "zod";

const reviewUpdateSchema = z.object({
  isActive: z.boolean().optional(),
  status: z.enum(["pending", "approved", "rejected"]).optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const review = await Review.findById(id)
      .populate("user", "firstName lastName avatar")
      .populate("motorcycle", "name slug thumbnail")
      .lean();
    if (!review) return notFoundResponse("Avis non trouvé");
    return successResponse(review);
  } catch (error) {
    return internalErrorResponse(error);
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();
    const result = reviewUpdateSchema.safeParse(body);

    if (!result.success) {
      const formattedErrors: Record<string, string[]> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (!formattedErrors[path]) formattedErrors[path] = [];
        formattedErrors[path].push(issue.message);
      });
      return validationErrorResponse(formattedErrors);
    }

    const review = await Review.findByIdAndUpdate(id, result.data, { new: true })
      .populate("user", "firstName lastName avatar")
      .populate("motorcycle", "name slug thumbnail");
    if (!review) return notFoundResponse("Avis non trouvé");
    return successResponse(review, "Avis mis à jour");
  } catch (error) {
    return internalErrorResponse(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const review = await Review.findByIdAndDelete(id);
    if (!review) return notFoundResponse("Avis non trouvé");
    return successResponse(null, "Avis supprimé");
  } catch (error) {
    return internalErrorResponse(error);
  }
}
