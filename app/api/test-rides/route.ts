export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { TestRide } from "@/models";
import {
  successResponse,
  createdResponse,
  internalErrorResponse,
  validationErrorResponse,
  parseQueryParams,
} from "@/lib/api-response";
import { testRideSchema } from "@/lib/zod-schemas";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const params = parseQueryParams(request);
    const filter: Record<string, unknown> = {};
    if (params.status) filter.status = params.status;

    const [rides, total] = await Promise.all([
      TestRide.find(filter)
        .populate("motorcycle", "name slug thumbnail")
        .populate("store", "name city")
        .sort({ createdAt: -1 })
        .skip((params.page - 1) * params.limit)
        .limit(params.limit)
        .lean(),
      TestRide.countDocuments(filter),
    ]);

    return successResponse(rides, undefined, {
      page: params.page,
      limit: params.limit,
      total,
      totalPages: Math.ceil(total / params.limit),
    });
  } catch (error) {
    return internalErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const result = testRideSchema.safeParse(body);

    if (!result.success) {
      const formattedErrors: Record<string, string[]> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (!formattedErrors[path]) formattedErrors[path] = [];
        formattedErrors[path].push(issue.message);
      });
      return validationErrorResponse(formattedErrors);
    }

    const ride = await TestRide.create({
      ...result.data,
      preferredDate: new Date(result.data.preferredDate),
    });
    await ride.populate("motorcycle store");
    return createdResponse(ride, "Demande d'essai envoyée avec succès");
  } catch (error) {
    return internalErrorResponse(error);
  }
}
