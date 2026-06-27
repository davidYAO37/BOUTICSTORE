export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Quote } from "@/models";
import {
  successResponse,
  createdResponse,
  internalErrorResponse,
  validationErrorResponse,
  parseQueryParams,
} from "@/lib/api-response";
import { quoteSchema } from "@/lib/zod-schemas";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const params = parseQueryParams(request);
    const filter: Record<string, unknown> = {};
    if (params.status) filter.status = params.status;

    const [quotes, total] = await Promise.all([
      Quote.find(filter)
        .populate("motorcycle", "name slug thumbnail price")
        .sort({ createdAt: -1 })
        .skip((params.page - 1) * params.limit)
        .limit(params.limit)
        .lean(),
      Quote.countDocuments(filter),
    ]);

    return successResponse(quotes, undefined, {
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
    const result = quoteSchema.safeParse(body);

    if (!result.success) {
      const formattedErrors: Record<string, string[]> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (!formattedErrors[path]) formattedErrors[path] = [];
        formattedErrors[path].push(issue.message);
      });
      return validationErrorResponse(formattedErrors);
    }

    const quote = await Quote.create(result.data);
    await quote.populate("motorcycle", "name slug thumbnail price");
    return createdResponse(quote, "Demande de devis envoyée avec succès");
  } catch (error) {
    return internalErrorResponse(error);
  }
}
