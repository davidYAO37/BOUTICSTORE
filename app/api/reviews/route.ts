export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Review, User, Motorcycle } from "@/models";
import {
  successResponse,
  createdResponse,
  internalErrorResponse,
  validationErrorResponse,
  parseQueryParams,
} from "@/lib/api-response";
import { reviewSchema } from "@/lib/zod-schemas";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const params = parseQueryParams(request);
    const filter: Record<string, unknown> = params.admin === "true" ? {} : { isActive: true };
    if (params.search) {
      const [users, motos] = await Promise.all([
        User.find({
          $or: [
            { email: { $regex: params.search, $options: "i" } },
            { firstName: { $regex: params.search, $options: "i" } },
            { lastName: { $regex: params.search, $options: "i" } },
          ],
        }).select("_id").lean(),
        Motorcycle.find({ name: { $regex: params.search, $options: "i" } }).select("_id").lean(),
      ]);
      const userIds = users.map((u: { _id: string }) => u._id);
      const motoIds = motos.map((m: { _id: string }) => m._id);
      filter.$or = [
        ...(userIds.length ? [{ user: { $in: userIds } }] : []),
        ...(motoIds.length ? [{ motorcycle: { $in: motoIds } }] : []),
      ];
    }

    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .populate("user", "firstName lastName avatar")
        .populate("motorcycle", "name slug thumbnail")
        .sort({ createdAt: -1 })
        .skip((params.page - 1) * params.limit)
        .limit(params.limit)
        .lean(),
      Review.countDocuments(filter),
    ]);

    return successResponse(reviews, undefined, {
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
    const result = reviewSchema.safeParse(body);

    if (!result.success) {
      const formattedErrors: Record<string, string[]> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (!formattedErrors[path]) formattedErrors[path] = [];
        formattedErrors[path].push(issue.message);
      });
      return validationErrorResponse(formattedErrors);
    }

    const review = await Review.create(result.data);
    await review.populate("user motorcycle");
    return createdResponse(review, "Avis ajouté avec succès");
  } catch (error) {
    return internalErrorResponse(error);
  }
}
