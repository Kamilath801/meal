// src/components/RecipeModal.jsx
import { useEffect, useState } from 'react';
import { IcFermer, IcVideo, IcCoeur } from './Icons';

export default function RecipeModal({ mealId, onClose, isFav, onToggleFav }) {
  const [meal,    setMeal]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  useEffect(() => {
    if (!mealId) return;
    setLoading(true); setError(false); setMeal(null);
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
      .then(r => r.json())
      .then(d => { setMeal(d.meals?.[0] || null); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [mealId]);

  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  const getIngredients = (m) => {
    const list = [];
    for (let i = 1; i <= 20; i++) {
      const name    = m[`strIngredient${i}`];
      const measure = m[`strMeasure${i}`];
      if (name?.trim()) list.push({ name: name.trim(), measure: measure?.trim() || '' });
    }
    return list;
  };

  const favori = meal ? isFav(meal.idMeal) : false;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal">
        {loading && (
          <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Chargement...
          </div>
        )}
        {error && (
          <div style={{ padding: '2rem', color: '#A32D2D' }}>Erreur de chargement.</div>
        )}

        {meal && !loading && (() => {
          const ingredients = getIngredients(meal);
          const instructions = meal.strInstructions?.length > 600
            ? meal.strInstructions.substring(0, 600) + '...'
            : meal.strInstructions || '';
          return (
            <>
              <div className="modal-hero">
                <img src={meal.strMealThumb} alt={meal.strMeal} />
                <div className="modal-hero-overlay" />
                <button className="modal-close" onClick={onClose}>
                  <IcFermer size={12} />
                </button>
              </div>

              <div className="modal-body">
                {/* Badges + bouton favori */}
                <div className="modal-badges">
                  <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                    {meal.strCategory && <span className="tag tag-blue">{meal.strCategory}</span>}
                    {meal.strArea     && <span className="tag tag-teal">{meal.strArea}</span>}
                  </div>

                  <button
                    className={`modal-fav-btn${favori ? ' is-fav' : ' not-fav'}`}
                    onClick={() => onToggleFav(meal)}
                  >
                    <IcCoeur size={13} filled={favori} />
                    {favori ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                  </button>
                </div>

                <div className="modal-title">{meal.strMeal}</div>

                <div className="section-label">Ingrédients ({ingredients.length})</div>
                <div className="ingredients-grid">
                  {ingredients.map((ing, i) => (
                    <div key={i} className="ingredient-item">
                      <div className="ingredient-dot" />
                      <span className="ingredient-name">{ing.name}</span>
                      {ing.measure && <span className="ingredient-measure">{ing.measure}</span>}
                    </div>
                  ))}
                </div>

                <div className="section-label">Préparation</div>
                <div className="instructions">{instructions}</div>

                {meal.strYoutube && (
                  <a className="modal-link-btn" href={meal.strYoutube} target="_blank" rel="noreferrer">
                    <IcVideo size={13} /> Voir la vidéo
                  </a>
                )}
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
}