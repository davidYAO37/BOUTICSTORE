import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getMotorcycles(params?: Record<string, string | number | boolean | undefined>) {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });
  }
  const response = await fetch(`/api/motos/?${searchParams.toString()}`, { cache: "no-store" });
  if (!response.ok) throw new Error("Erreur lors de la récupération des motos");
  return response.json();
}

export async function getMotorcycleBySlug(slug: string) {
  const response = await fetch(`/api/motos/${slug}/`, { cache: "no-store" });
  if (!response.ok) throw new Error("Erreur lors de la récupération de la moto");
  return response.json();
}

export async function createMotorcycle(data: unknown) {
  const response = await api.post("/api/motos/", data);
  return response.data;
}

export async function updateMotorcycle(id: string, data: unknown) {
  const response = await api.put(`/api/motos/${id}/`, data);
  return response.data;
}

export async function deleteMotorcycle(id: string) {
  const response = await api.delete(`/api/motos/${id}/`);
  return response.data;
}

export async function getCategories(params?: Record<string, string | number | boolean | undefined>) {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });
  }
  const response = await fetch(`/api/categories/?${searchParams.toString()}`, { cache: "no-store" });
  if (!response.ok) throw new Error("Erreur lors de la récupération des catégories");
  return response.json();
}

export async function getBrands(params?: Record<string, string | number | boolean | undefined>) {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });
  }
  const response = await fetch(`/api/brands/?${searchParams.toString()}`, { cache: "no-store" });
  if (!response.ok) throw new Error("Erreur lors de la récupération des marques");
  return response.json();
}

export async function getStores(params?: Record<string, string | number | boolean | undefined>) {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });
  }
  const response = await fetch(`/api/stores/?${searchParams.toString()}`, { cache: "no-store" });
  if (!response.ok) throw new Error("Erreur lors de la récupération des magasins");
  return response.json();
}

export async function getUsers(params?: Record<string, string | number | boolean | undefined>) {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });
  }
  const response = await fetch(`/api/users/?${searchParams.toString()}`, { cache: "no-store" });
  if (!response.ok) throw new Error("Erreur lors de la récupération des utilisateurs");
  return response.json();
}

export async function getBrandById(id: string) {
  const response = await fetch(`/api/brands/${id}/`, { cache: "no-store" });
  if (!response.ok) throw new Error("Erreur lors de la récupération de la marque");
  return response.json();
}

export async function createBrand(data: unknown) {
  const response = await api.post("/api/brands/", data);
  return response.data;
}

export async function updateBrand(id: string, data: unknown) {
  const response = await api.put(`/api/brands/${id}/`, data);
  return response.data;
}

export async function deleteBrand(id: string) {
  const response = await api.delete(`/api/brands/${id}/`);
  return response.data;
}

export async function getCategoryById(id: string) {
  const response = await fetch(`/api/categories/${id}/`, { cache: "no-store" });
  if (!response.ok) throw new Error("Erreur lors de la récupération de la catégorie");
  return response.json();
}

export async function createCategory(data: unknown) {
  const response = await api.post("/api/categories/", data);
  return response.data;
}

export async function updateCategory(id: string, data: unknown) {
  const response = await api.put(`/api/categories/${id}/`, data);
  return response.data;
}

export async function deleteCategory(id: string) {
  const response = await api.delete(`/api/categories/${id}/`);
  return response.data;
}

export async function updateOrder(id: string, data: unknown) {
  const response = await api.put(`/api/orders/${id}/`, data);
  return response.data;
}

export async function deleteOrder(id: string) {
  const response = await api.delete(`/api/orders/${id}/`);
  return response.data;
}

export async function updateQuote(id: string, data: unknown) {
  const response = await api.put(`/api/quotes/${id}/`, data);
  return response.data;
}

export async function deleteQuote(id: string) {
  const response = await api.delete(`/api/quotes/${id}/`);
  return response.data;
}

export async function updateTestRide(id: string, data: unknown) {
  const response = await api.put(`/api/test-rides/${id}/`, data);
  return response.data;
}

export async function deleteTestRide(id: string) {
  const response = await api.delete(`/api/test-rides/${id}/`);
  return response.data;
}

export async function updateReview(id: string, data: unknown) {
  const response = await api.put(`/api/reviews/${id}/`, data);
  return response.data;
}

export async function deleteReview(id: string) {
  const response = await api.delete(`/api/reviews/${id}/`);
  return response.data;
}

export async function getStoreById(id: string) {
  const response = await fetch(`/api/stores/${id}/`, { cache: "no-store" });
  if (!response.ok) throw new Error("Erreur lors de la récupération du magasin");
  return response.json();
}

export async function createStore(data: unknown) {
  const response = await api.post("/api/stores/", data);
  return response.data;
}

export async function updateStore(id: string, data: unknown) {
  const response = await api.put(`/api/stores/${id}/`, data);
  return response.data;
}

export async function deleteStore(id: string) {
  const response = await api.delete(`/api/stores/${id}/`);
  return response.data;
}

export async function createUser(data: unknown) {
  const response = await api.post("/api/users/", data);
  return response.data;
}

export async function updateUser(id: string, data: unknown) {
  const response = await api.put(`/api/users/${id}/`, data);
  return response.data;
}

export async function deleteUser(id: string) {
  const response = await api.delete(`/api/users/${id}/`);
  return response.data;
}

export async function createQuote(data: unknown) {
  const response = await api.post("/api/quotes/", data);
  return response.data;
}

export async function createTestRide(data: unknown) {
  const response = await api.post("/api/test-rides/", data);
  return response.data;
}

export async function createReview(data: unknown) {
  const response = await api.post("/api/reviews/", data);
  return response.data;
}

export async function createOrder(data: unknown) {
  const response = await api.post("/api/orders/", data);
  return response.data;
}

export async function getOrders(params?: Record<string, string | number | boolean | undefined>) {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });
  }
  const response = await fetch(`/api/orders/?${searchParams.toString()}`, { cache: "no-store" });
  if (!response.ok) throw new Error("Erreur lors de la récupération des commandes");
  return response.json();
}

export async function getQuotes(params?: Record<string, string | number | boolean | undefined>) {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });
  }
  const response = await fetch(`/api/quotes/?${searchParams.toString()}`, { cache: "no-store" });
  if (!response.ok) throw new Error("Erreur lors de la récupération des devis");
  return response.json();
}

export async function getTestRides(params?: Record<string, string | number | boolean | undefined>) {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });
  }
  const response = await fetch(`/api/test-rides/?${searchParams.toString()}`, { cache: "no-store" });
  if (!response.ok) throw new Error("Erreur lors de la récupération des essais");
  return response.json();
}

export async function getReviews(params?: Record<string, string | number | boolean | undefined>) {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });
  }
  const response = await fetch(`/api/reviews/?${searchParams.toString()}`, { cache: "no-store" });
  if (!response.ok) throw new Error("Erreur lors de la récupération des avis");
  return response.json();
}

export default api;
