export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Brand } from "@/models";
import {
  successResponse,
  internalErrorResponse,
  validationErrorResponse,
  notFoundResponse,
} from "@/lib/api-response";
import { brandSchema } from "@/lib/zod-schemas";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const brand = await Brand.findById(id).lean();
    if (!brand) return notFoundResponse("Marque non trouvée");
    return successResponse(brand);
  } catch (error) {
    return internalErrorResponse(error);
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();
    const result = brandSchema.partial().safeParse(body);

    if (!result.success) {
      const formattedErrors: Record<string, string[]> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (!formattedErrors[path]) formattedErrors[path] = [];
        formattedErrors[path].push(issue.message);
      });
      return validationErrorResponse(formattedErrors);
    }

    const brand = await Brand.findByIdAndUpdate(id, result.data, { new: true, runValidators: true });
    if (!brand) return notFoundResponse("Marque non trouvée");
    return successResponse(brand, "Marque mise à jour");
  } catch (error) {
    return internalErrorResponse(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const brand = await Brand.findByIdAndDelete(id);
    if (!brand) return notFoundResponse("Marque non trouvée");
    return successResponse(null, "Marque supprimée");
  } catch (error) {
    return internalErrorResponse(error);
  }
}
