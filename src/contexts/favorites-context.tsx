import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useAuth } from "@/contexts/auth-context";

function loadFavorites(email: string): string[] {
  try {
    const users = JSON.parse(window.localStorage.getItem("nn_users") || "[]");
    const found = users.find((u: { email: string }) => u.email === email);
    return found?.favorites || [];
  } catch {
    return [];
  }
}

function saveFavorites(email: string, favorites: string[]) {
  try {
    const users = JSON.parse(window.localStorage.getItem("nn_users") || "[]");
    const idx = users.findIndex((u: { email: string }) => u.email === email);
    if (idx >= 0) {
      users[idx].favorites = favorites;
      window.localStorage.setItem("nn_users", JSON.stringify(users));
    }
  } catch {}
}

interface FavoritesContextValue {
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    if (user?.email) {
      setFavorites(loadFavorites(user.email));
    } else {
      setFavorites([]);
    }
  }, [user?.email]);

  const toggleFavorite = useCallback(
    (productId: string) => {
      if (!user) return;
      setFavorites((prev) => {
        const next = prev.includes(productId)
          ? prev.filter((id) => id !== productId)
          : [...prev, productId];
        saveFavorites(user.email, next);
        return next;
      });
    },
    [user]
  );

  const isFavorite = useCallback(
    (productId: string) => favorites.includes(productId),
    [favorites]
  );

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavoritesContext() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavoritesContext must be used inside FavoritesProvider");
  return ctx;
}
