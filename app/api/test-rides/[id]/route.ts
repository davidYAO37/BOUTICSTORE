export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { TestRide } from "@/models";
import {
  successResponse,
  internalErrorResponse,
  validationErrorResponse,
  notFoundResponse,
} from "@/lib/api-response";
import { z } from "zod";

const testRideUpdateSchema = z.object({
  status: z.enum(["pending", "confirmed", "completed", "cancelled"]).optional(),
  notes: z.string().optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const ride = await TestRide.findById(id)
      .populate("motorcycle", "name slug thumbnail")
      .populate("store", "name city")
      .lean();
    if (!ride) return notFoundResponse("Essai non trouvé");
    return successResponse(ride);
  } catch (error) {
    return internalErrorResponse(error);
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();
    const result = testRideUpdateSchema.safeParse(body);

    if (!result.success) {
      const formattedErrors: Record<string, string[]> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (!formattedErrors[path]) formattedErrors[path] = [];
        formattedErrors[path].push(issue.message);
      });
      return validationErrorResponse(formattedErrors);
    }

    const ride = await TestRide.findByIdAndUpdate(id, result.data, { new: true })
      .populate("motorcycle", "name slug thumbnail")
      .populate("store", "name city");
    if (!ride) return notFoundResponse("Essai non trouvé");
    return successResponse(ride, "Essai mis à jour");
  } catch (error) {
    return internalErrorResponse(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const ride = await TestRide.findByIdAndDelete(id);
    if (!ride) return notFoundResponse("Essai non trouvé");
    return successResponse(null, "Essai supprimé");
  } catch (error) {
    return internalErrorResponse(error);
  }
}
