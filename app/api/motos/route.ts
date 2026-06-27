export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Motorcycle, Brand, Category } from "@/models";
import {
  successResponse,
  createdResponse,
  internalErrorResponse,
  validationErrorResponse,
  parseQueryParams,
} from "@/lib/api-response";
import { motorcycleSchema } from "@/lib/zod-schemas";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MongoFilter = Record<string, any>;

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const params = parseQueryParams(request);

    const filter: MongoFilter = params.admin === "true" ? {} : { isActive: true };

    if (params.search) {
      filter.$text = { $search: params.search };
    }
    if (params.brand) {
      const brand = await Brand.findOne({ slug: params.brand });
      if (brand) filter.brand = brand._id;
    }
    if (params.category) {
      const category = await Category.findOne({ slug: params.category });
      if (category) filter.category = category._id;
    }
    if (params.color) filter.color = { $in: [params.color] };
    if (params.transmission) filter.transmission = params.transmission;
    if (params.availability) filter.availability = params.availability;
    if (params.year) filter.year = params.year;

    const priceFilter: Record<string, number> = {};
    if (params.minPrice !== undefined) priceFilter.$gte = params.minPrice;
    if (params.maxPrice !== undefined) priceFilter.$lte = params.maxPrice;
    if (Object.keys(priceFilter).length > 0) filter.price = priceFilter;

    const displacementFilter: Record<string, number> = {};
    if (params.minDisplacement !== undefined) displacementFilter.$gte = params.minDisplacement;
    if (params.maxDisplacement !== undefined) displacementFilter.$lte = params.maxDisplacement;
    if (Object.keys(displacementFilter).length > 0) filter.displacement = displacementFilter;

    if (params.isPromotion) filter.isPromotion = true;
    if (params.isNew) filter.isNew = true;
    if (params.isPopular) filter.isPopular = true;

    const sortDirection = params.order === "asc" ? 1 : -1;
    const sortOptions: Record<string, 1 | -1> = {};
    if (params.sort === "price") sortOptions.price = sortDirection;
    else if (params.sort === "name") sortOptions.name = sortDirection;
    else if (params.sort === "year") sortOptions.year = sortDirection;
    else if (params.sort === "popularity") sortOptions.isPopular = -1;
    else sortOptions.createdAt = sortDirection;

    const skip = (params.page - 1) * params.limit;

    const [motos, total] = await Promise.all([
      Motorcycle.find(filter)
        .populate("brand", "name slug logo")
        .populate("category", "name slug")
        .sort(sortOptions)
        .skip(skip)
        .limit(params.limit)
        .lean(),
      Motorcycle.countDocuments(filter),
    ]);

    return successResponse(motos, undefined, {
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
    const result = motorcycleSchema.safeParse(body);

    if (!result.success) {
      const formattedErrors: Record<string, string[]> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (!formattedErrors[path]) formattedErrors[path] = [];
        formattedErrors[path].push(issue.message);
      });
      return validationErrorResponse(formattedErrors);
    }

    const existing = await Motorcycle.findOne({
      $or: [{ slug: result.data.slug }, { reference: result.data.reference }],
    });
    if (existing) {
      return validationErrorResponse({
        slug: ["Une moto avec ce slug ou cette référence existe déjà"],
      });
    }

    const moto = await Motorcycle.create(result.data);
    await moto.populate("brand category");
    return createdResponse(moto, "Moto créée avec succès");
  } catch (error) {
    return internalErrorResponse(error);
  }
}
