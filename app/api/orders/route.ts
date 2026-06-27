export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Order, User } from "@/models";
import {
  successResponse,
  createdResponse,
  internalErrorResponse,
  validationErrorResponse,
  parseQueryParams,
} from "@/lib/api-response";
import { orderSchema } from "@/lib/zod-schemas";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const params = parseQueryParams(request);
    const filter: Record<string, unknown> = {};
    if (params.status) filter.status = params.status;
    if (params.search) {
      const users = await User.find({
        $or: [
          { email: { $regex: params.search, $options: "i" } },
          { firstName: { $regex: params.search, $options: "i" } },
          { lastName: { $regex: params.search, $options: "i" } },
        ],
      }).select("_id").lean();
      filter.user = { $in: users.map((u: { _id: string }) => u._id) };
    }

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate("user", "firstName lastName email")
        .populate("items.motorcycle", "name slug thumbnail")
        .sort({ createdAt: -1 })
        .skip((params.page - 1) * params.limit)
        .limit(params.limit)
        .lean(),
      Order.countDocuments(filter),
    ]);

    return successResponse(orders, undefined, {
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
    const result = orderSchema.safeParse(body);

    if (!result.success) {
      const formattedErrors: Record<string, string[]> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (!formattedErrors[path]) formattedErrors[path] = [];
        formattedErrors[path].push(issue.message);
      });
      return validationErrorResponse(formattedErrors);
    }

    const order = await Order.create(result.data);
    await order.populate("user items.motorcycle");
    return createdResponse(order, "Commande créée avec succès");
  } catch (error) {
    return internalErrorResponse(error);
  }
}
