export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Motorcycle } from "@/models";
import {
  successResponse,
  internalErrorResponse,
  validationErrorResponse,
  notFoundResponse,
} from "@/lib/api-response";
import { motorcycleSchema } from "@/lib/zod-schemas";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    const query = isObjectId ? { _id: id } : { slug: id, isActive: true };
    const moto = await Motorcycle.findOne(query)
      .populate("brand", "name slug logo country")
      .populate("category", "name slug")
      .lean();

    if (!moto) return notFoundResponse("Moto non trouvée");

    return successResponse(moto);
  } catch (error) {
    return internalErrorResponse(error);
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();
    const result = motorcycleSchema.partial().safeParse(body);

    if (!result.success) {
      const formattedErrors: Record<string, string[]> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (!formattedErrors[path]) formattedErrors[path] = [];
        formattedErrors[path].push(issue.message);
      });
      return validationErrorResponse(formattedErrors);
    }

    const moto = await Motorcycle.findByIdAndUpdate(id, result.data, {
      new: true,
      runValidators: true,
    })
      .populate("brand", "name slug logo")
      .populate("category", "name slug");

    if (!moto) return notFoundResponse("Moto non trouvée");

    return successResponse(moto, "Moto mise à jour avec succès");
  } catch (error) {
    return internalErrorResponse(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const moto = await Motorcycle.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!moto) return notFoundResponse("Moto non trouvée");

    return successResponse(null, "Moto supprimée avec succès");
  } catch (error) {
    return internalErrorResponse(error);
  }
}
