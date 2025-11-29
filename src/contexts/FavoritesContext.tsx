import { createContext, useContext, useState, ReactNode } from "react";
import { LiveStream } from "@/data/mockData";
import { toast } from "sonner";

interface FavoritesContextType {
  favorites: string[];
  addToFavorites: (id: string) => void;
  removeFromFavorites: (id: string) => void;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  getFavoriteStreams: (streams: LiveStream[]) => LiveStream[];
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const saveToStorage = (newFavorites: string[]) => {
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
    setFavorites(newFavorites);
  };

  const addToFavorites = (id: string) => {
    if (!favorites.includes(id)) {
      const newFavorites = [...favorites, id];
      saveToStorage(newFavorites);
      toast.success("Added to favorites");
    }
  };

  const removeFromFavorites = (id: string) => {
    const newFavorites = favorites.filter((favId) => favId !== id);
    saveToStorage(newFavorites);
    toast.success("Removed from favorites");
  };

  const isFavorite = (id: string) => {
    return favorites.includes(id);
  };

  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      removeFromFavorites(id);
    } else {
      addToFavorites(id);
    }
  };

  const getFavoriteStreams = (streams: LiveStream[]) => {
    return streams.filter((stream) => favorites.includes(stream.id));
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        toggleFavorite,
        getFavoriteStreams,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return context;
};


