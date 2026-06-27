"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface FavoritesContextType {
  favorites: string[];
  count: number;
  addFavorite: (motorcycleId: string) => void;
  removeFavorite: (motorcycleId: string) => void;
  toggleFavorite: (motorcycleId: string) => void;
  isFavorite: (motorcycleId: string) => boolean;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites doit être utilisé dans un FavoritesProvider");
  }
  return context;
}

interface FavoritesProviderProps {
  children: ReactNode;
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("favorites");
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Erreur lors du chargement des favoris:", error);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  }, [favorites, mounted]);

  const addFavorite = (motorcycleId: string) => {
    setFavorites((prev) => (prev.includes(motorcycleId) ? prev : [...prev, motorcycleId]));
  };

  const removeFavorite = (motorcycleId: string) => {
    setFavorites((prev) => prev.filter((id) => id !== motorcycleId));
  };

  const toggleFavorite = (motorcycleId: string) => {
    if (favorites.includes(motorcycleId)) {
      removeFavorite(motorcycleId);
    } else {
      addFavorite(motorcycleId);
    }
  };

  const isFavorite = (motorcycleId: string) => favorites.includes(motorcycleId);
  const clearFavorites = () => setFavorites([]);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        count: favorites.length,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}
