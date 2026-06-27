export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Brand } from "@/models";
import {
  successResponse,
  createdResponse,
  internalErrorResponse,
  validationErrorResponse,
  parseQueryParams,
} from "@/lib/api-response";
import { brandSchema } from "@/lib/zod-schemas";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const params = parseQueryParams(request);
    const filter: Record<string, unknown> = {};
    if (params.search) filter.name = { $regex: params.search, $options: "i" };

    const [brands, total] = await Promise.all([
      Brand.find(filter)
        .sort({ name: 1 })
        .skip((params.page - 1) * params.limit)
        .limit(params.limit)
        .lean(),
      Brand.countDocuments(filter),
    ]);

    return successResponse(brands, undefined, {
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
    console.log("[POST /api/brands] body reçu:", JSON.stringify(body, null, 2));
    const result = brandSchema.safeParse(body);

    if (!result.success) {
      console.error("[POST /api/brands] Erreurs Zod:", JSON.stringify(result.error.issues, null, 2));
      const formattedErrors: Record<string, string[]> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (!formattedErrors[path]) formattedErrors[path] = [];
        formattedErrors[path].push(issue.message);
      });
      return validationErrorResponse(formattedErrors);
    }

    const brand = await Brand.create(result.data);
    return createdResponse(brand, "Marque créée avec succès");
  } catch (error) {
    return internalErrorResponse(error);
  }
}
