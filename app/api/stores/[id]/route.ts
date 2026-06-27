export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Store } from "@/models";
import {
  successResponse,
  internalErrorResponse,
  validationErrorResponse,
  notFoundResponse,
} from "@/lib/api-response";
import { storeSchema } from "@/lib/zod-schemas";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const store = await Store.findById(id).lean();
    if (!store) return notFoundResponse("Magasin non trouvé");
    return successResponse(store);
  } catch (error) {
    return internalErrorResponse(error);
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();
    const result = storeSchema.partial().safeParse(body);

    if (!result.success) {
      const formattedErrors: Record<string, string[]> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (!formattedErrors[path]) formattedErrors[path] = [];
        formattedErrors[path].push(issue.message);
      });
      return validationErrorResponse(formattedErrors);
    }

    const store = await Store.findByIdAndUpdate(id, result.data, { new: true, runValidators: true });
    if (!store) return notFoundResponse("Magasin non trouvé");
    return successResponse(store, "Magasin mis à jour");
  } catch (error) {
    return internalErrorResponse(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const store = await Store.findByIdAndDelete(id);
    if (!store) return notFoundResponse("Magasin non trouvé");
    return successResponse(null, "Magasin supprimé");
  } catch (error) {
    return internalErrorResponse(error);
  }
}
