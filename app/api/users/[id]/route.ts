export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { User } from "@/models";
import {
  successResponse,
  internalErrorResponse,
  validationErrorResponse,
  notFoundResponse,
} from "@/lib/api-response";
import { z } from "zod";

const userUpdateSchema = z.object({
  role: z.enum(["admin", "sales", "warehouse", "customer"]).optional(),
  isActive: z.boolean().optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const user = await User.findById(id).select("-password").lean();
    if (!user) return notFoundResponse("Utilisateur non trouvé");
    return successResponse(user);
  } catch (error) {
    return internalErrorResponse(error);
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();
    const result = userUpdateSchema.safeParse(body);

    if (!result.success) {
      const formattedErrors: Record<string, string[]> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (!formattedErrors[path]) formattedErrors[path] = [];
        formattedErrors[path].push(issue.message);
      });
      return validationErrorResponse(formattedErrors);
    }

    const user = await User.findByIdAndUpdate(id, result.data, { new: true }).select("-password");
    if (!user) return notFoundResponse("Utilisateur non trouvé");
    return successResponse(user, "Utilisateur mis à jour");
  } catch (error) {
    return internalErrorResponse(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return notFoundResponse("Utilisateur non trouvé");
    return successResponse(null, "Utilisateur supprimé");
  } catch (error) {
    return internalErrorResponse(error);
  }
}
