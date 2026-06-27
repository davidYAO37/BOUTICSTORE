export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Store } from "@/models";
import {
  successResponse,
  createdResponse,
  internalErrorResponse,
  validationErrorResponse,
  parseQueryParams,
} from "@/lib/api-response";
import { storeSchema } from "@/lib/zod-schemas";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const params = parseQueryParams(request);
    const filter: Record<string, unknown> = params.admin === "true" ? {} : { isActive: true };
    if (params.search) {
      filter.$or = [
        { city: { $regex: params.search, $options: "i" } },
        { "name.fr": { $regex: params.search, $options: "i" } },
        { "name.en": { $regex: params.search, $options: "i" } },
      ];
    }

    const [stores, total] = await Promise.all([
      Store.find(filter)
        .sort({ "name.fr": 1 })
        .skip((params.page - 1) * params.limit)
        .limit(params.limit)
        .lean(),
      Store.countDocuments(filter),
    ]);

    return successResponse(stores, undefined, {
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
    const result = storeSchema.safeParse(body);

    if (!result.success) {
      const formattedErrors: Record<string, string[]> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (!formattedErrors[path]) formattedErrors[path] = [];
        formattedErrors[path].push(issue.message);
      });
      return validationErrorResponse(formattedErrors);
    }

    const store = await Store.create(result.data);
    return createdResponse(store, "Magasin créé avec succès");
  } catch (error) {
    return internalErrorResponse(error);
  }
}
