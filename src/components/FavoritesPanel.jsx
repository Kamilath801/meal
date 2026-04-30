// src/components/FavoritesPanel.jsx
import RecipeCard from './RecipeCard';
import { IcFermer, IcCoeur } from './Icons';

export default function FavoritesPanel({ favorites, isFav, onToggleFav, onOpenModal, onClear, onGoSearch }) {
  if (favorites.length === 0) {
    return (
      <div className="fav-panel">
        <div className="state-container">
          <div className="state-icon"><IcCoeur size={40} /></div>
          <div className="state-title">Aucun favori pour l'instant</div>
          <div className="state-sub">
            Cliquez sur le cœur d'une recette pour l'ajouter ici
          </div>
          <button className="go-search-btn" onClick={onGoSearch}>
            Rechercher des recettes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fav-panel">
      <div className="fav-header">
        <div className="fav-title">
          Mes favoris ({favorites.length})
        </div>
        <button className="fav-clear-btn" onClick={onClear}>
          <IcFermer size={12} />
          Tout effacer
        </button>
      </div>

      <div className="recipes-grid">
        {favorites.map(meal => (
          <RecipeCard
            key={meal.idMeal}
            meal={meal}
            onClick={onOpenModal}
            mode="favoris"
            isFav={isFav(meal.idMeal)}
            onToggleFav={onToggleFav}
          />
        ))}
      </div>
    </div>
  );
}