// src/components/RecipeCard.jsx
import { IcFleche, IcCoeur } from './Icons';

export default function RecipeCard({ meal, onClick, mode, isFav, onToggleFav }) {
  const tags = meal.strTags ? meal.strTags.split(',').slice(0, 1) : [];

  const handleFavClick = (e) => {
    e.stopPropagation();
    onToggleFav && onToggleFav(meal);
  };

  return (
    <div className="recipe-card" onClick={() => onClick(meal.idMeal)}>
      <div className="card-img">
        <img src={`${meal.strMealThumb}/preview`} alt={meal.strMeal} loading="lazy" />
        {meal.strCategory && <span className="card-category">{meal.strCategory}</span>}
        {meal.strArea     && <span className="card-area">{meal.strArea}</span>}

        {/* Bouton favori */}
        {onToggleFav && (
          <button
            className={`fav-btn${isFav ? ' is-fav' : ''}`}
            onClick={handleFavClick}
            title={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            <IcCoeur size={14} filled={isFav} />
          </button>
        )}
      </div>

      <div className="card-body">
        <div className="card-title">{meal.strMeal}</div>
        <div className="card-footer">
          <div className="card-tags">
            {tags.map(tag => (
              <span key={tag} className="tag tag-blue">{tag.trim()}</span>
            ))}
            {mode === 'ingredients' && <span className="tag tag-green">Par ingrédients</span>}
            {mode === 'favoris'     && <span className="tag tag-red">Favori</span>}
            {tags.length === 0 && mode === 'recette' && <span className="tag tag-blue">Découvrir</span>}
          </div>
          <span className="card-arrow"><IcFleche size={14} /></span>
        </div>
      </div>
    </div>
  );
}