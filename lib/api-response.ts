import { NextResponse } from "next/server";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export function successResponse<T>(data: T, message?: string, meta?: ApiResponse["meta"]) {
  const response: ApiResponse<T> = { success: true, data };
  if (message) response.message = message;
  if (meta) response.meta = meta;
  return NextResponse.json(response, { status: 200 });
}

export function createdResponse<T>(data: T, message?: string) {
  const response: ApiResponse<T> = { success: true, data };
  if (message) response.message = message;
  return NextResponse.json(response, { status: 201 });
}

export function errorResponse(error: string, status: number = 400, errors?: Record<string, string[]>) {
  const response: ApiResponse = { success: false, error };
  if (errors) response.errors = errors;
  return NextResponse.json(response, { status });
}

export function notFoundResponse(message: string = "Ressource non trouvée") {
  return errorResponse(message, 404);
}

export function unauthorizedResponse(message: string = "Non autorisé") {
  return errorResponse(message, 401);
}

export function forbiddenResponse(message: string = "Accès interdit") {
  return errorResponse(message, 403);
}

export function validationErrorResponse(errors: Record<string, string[]>) {
  return errorResponse("Données invalides", 422, errors);
}

export function internalErrorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "Erreur interne du serveur";
  console.error("API Error:", error);
  return errorResponse(message, 500);
}

export function parseQueryParams(request: Request) {
  const { searchParams } = new URL(request.url);
  return {
    page: Math.max(1, parseInt(searchParams.get("page") || "1", 10)),
    limit: Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "12", 10))),
    search: searchParams.get("search") || "",
    sort: searchParams.get("sort") || "createdAt",
    order: searchParams.get("order") || "desc",
    minPrice: searchParams.get("minPrice") ? parseInt(searchParams.get("minPrice")!, 10) : undefined,
    maxPrice: searchParams.get("maxPrice") ? parseInt(searchParams.get("maxPrice")!, 10) : undefined,
    brand: searchParams.get("brand") || undefined,
    category: searchParams.get("category") || undefined,
    color: searchParams.get("color") || undefined,
    transmission: searchParams.get("transmission") || undefined,
    availability: searchParams.get("availability") || undefined,
    year: searchParams.get("year") ? parseInt(searchParams.get("year")!, 10) : undefined,
    minDisplacement: searchParams.get("minDisplacement") ? parseInt(searchParams.get("minDisplacement")!, 10) : undefined,
    maxDisplacement: searchParams.get("maxDisplacement") ? parseInt(searchParams.get("maxDisplacement")!, 10) : undefined,
    isPromotion: searchParams.get("isPromotion") === "true" ? true : undefined,
    isNew: searchParams.get("isNew") === "true" ? true : undefined,
    isPopular: searchParams.get("isPopular") === "true" ? true : undefined,
    status: searchParams.get("status") || undefined,
    admin: searchParams.get("admin") || undefined,
  };
}
