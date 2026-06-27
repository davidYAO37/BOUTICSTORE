export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Category } from "@/models";
import {
  successResponse,
  internalErrorResponse,
  validationErrorResponse,
  notFoundResponse,
} from "@/lib/api-response";
import { categorySchema } from "@/lib/zod-schemas";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const category = await Category.findById(id).populate("parent", "name slug").lean();
    if (!category) return notFoundResponse("Catégorie non trouvée");
    return successResponse(category);
  } catch (error) {
    return internalErrorResponse(error);
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();
    const result = categorySchema.partial().safeParse(body);

    if (!result.success) {
      const formattedErrors: Record<string, string[]> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (!formattedErrors[path]) formattedErrors[path] = [];
        formattedErrors[path].push(issue.message);
      });
      return validationErrorResponse(formattedErrors);
    }

    const category = await Category.findByIdAndUpdate(id, result.data, { new: true, runValidators: true })
      .populate("parent", "name slug");
    if (!category) return notFoundResponse("Catégorie non trouvée");
    return successResponse(category, "Catégorie mise à jour");
  } catch (error) {
    return internalErrorResponse(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) return notFoundResponse("Catégorie non trouvée");
    return successResponse(null, "Catégorie supprimée");
  } catch (error) {
    return internalErrorResponse(error);
  }
}
