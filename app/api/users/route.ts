export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { User } from "@/models";
import {
  successResponse,
  createdResponse,
  internalErrorResponse,
  validationErrorResponse,
  parseQueryParams,
} from "@/lib/api-response";
import { userSchema } from "@/lib/zod-schemas";
import bcrypt from "bcryptjs";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const params = parseQueryParams(request);
    const filter: Record<string, unknown> = {};
    if (params.search) {
      filter.$or = [
        { email: { $regex: params.search, $options: "i" } },
        { firstName: { $regex: params.search, $options: "i" } },
        { lastName: { $regex: params.search, $options: "i" } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip((params.page - 1) * params.limit)
        .limit(params.limit)
        .lean(),
      User.countDocuments(filter),
    ]);

    return successResponse(users, undefined, {
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
    const result = userSchema.safeParse(body);

    if (!result.success) {
      const formattedErrors: Record<string, string[]> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (!formattedErrors[path]) formattedErrors[path] = [];
        formattedErrors[path].push(issue.message);
      });
      return validationErrorResponse(formattedErrors);
    }

    const existing = await User.findOne({ email: result.data.email });
    if (existing) return validationErrorResponse({ email: ["Email déjà utilisé"] });

    const password = await bcrypt.hash(result.data.password, 10);
    const user = await User.create({ ...result.data, password });

    return createdResponse(user, "Utilisateur créé");
  } catch (error) {
    return internalErrorResponse(error);
  }
}
