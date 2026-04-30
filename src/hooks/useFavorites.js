// src/hooks/useFavorites.js
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'mf_favorites';

export default function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  });

  // Sauvegarde automatique dans localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {}
  }, [favorites]);

  const isFav   = (id) => favorites.some(f => f.idMeal === id);

  const toggleFav = (meal) => {
    setFavorites(prev =>
      isFav(meal.idMeal)
        ? prev.filter(f => f.idMeal !== meal.idMeal)
        : [...prev, meal]
    );
  };

  const clearFavorites = () => setFavorites([]);

  return { favorites, isFav, toggleFav, clearFavorites };
}