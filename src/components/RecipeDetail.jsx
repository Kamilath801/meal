// src/components/RecipeDetail.jsx
// Page de détail COMPLÈTE (remplace la modal tronquée)
import { useEffect, useState } from 'react';
import { IcFermer, IcVideo, IcCoeur, IcFleche } from './Icons';
import { getCached, setCache } from '../hooks/useCache';

const IcShare = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
);

const IcCheck = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

export default function RecipeDetail({ mealId, onClose, isFav, onToggleFav }) {
  const [meal,    setMeal]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);
  const [offline, setOffline] = useState(false);
  const [copied,  setCopied]  = useState(false);

  useEffect(() => {
    if (!mealId) return;
    setLoading(true); setError(false); setOffline(false); setMeal(null);

    // 1. Essayer le cache d'abord
    const cached = getCached(mealId);
    if (cached) { setMeal(cached); setLoading(false); return; }

    // 2. Sinon fetch API
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
      .then(r => r.json())
      .then(d => {
        const m = d.meals?.[0];
        if (m) { setCache(m); setMeal(m); }
        setLoading(false);
      })
      .catch(() => {
        // 3. Hors-ligne : réessayer depuis le cache
        const fallback = getCached(mealId);
        if (fallback) { setMeal(fallback); setOffline(true); }
        else { setError(true); }
        setLoading(false);
      });
  }, [mealId]);

  // Fermer avec Escape
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  // Bloquer le scroll du body
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const getIngredients = (m) => {
    const list = [];
    for (let i = 1; i <= 20; i++) {
      const name    = m[`strIngredient${i}`];
      const measure = m[`strMeasure${i}`];
      if (name?.trim()) list.push({ name: name.trim(), measure: measure?.trim() || '' });
    }
    return list;
  };

  // Formater les instructions en étapes numérotées
  const formatInstructions = (text) => {
    if (!text) return [];
    // Séparer par numéros (1. 2. STEP 1 etc.) ou par double saut de ligne
    const steps = text
      .replace(/\r\n/g, '\n')
      .split(/\n{2,}|(?=STEP \d+)/i)
      .map(s => s.replace(/^STEP \d+[:\s]*/i, '').trim())
      .filter(s => s.length > 10);
    return steps;
  };

  const handleShare = async () => {
    const url = `https://www.themealdb.com/meal/${mealId}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: meal?.strMeal, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {}
  };

  const favori = meal ? isFav(meal.idMeal) : false;

  return (
    <div
      className="detail-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="detail-panel">

        {/* Chargement */}
        {loading && (
          <div className="detail-loading">
            <div className="detail-skeleton-hero" />
            <div style={{ padding: '1.5rem' }}>
              <div className="detail-skeleton-line tall" />
              <div className="detail-skeleton-line" style={{ width: '60%' }} />
            </div>
          </div>
        )}

        {/* Erreur */}
        {error && !loading && (
          <div className="detail-error">
            <p>Impossible de charger cette recette.</p>
            <button className="detail-close-btn" onClick={onClose}>Fermer</button>
          </div>
        )}

        {/* Contenu complet */}
        {meal && !loading && (() => {
          const ingredients  = getIngredients(meal);
          const instructions = formatInstructions(meal.strInstructions);

          return (
            <>
              {/* HERO IMAGE */}
              <div className="detail-hero">
                <img src={meal.strMealThumb} alt={meal.strMeal} />
                <div className="detail-hero-overlay" />

                {/* Boutons flottants */}
                <div className="detail-hero-actions">
                  <button className="detail-action-btn" onClick={onClose} title="Fermer">
                    <IcFermer size={14} />
                  </button>
                </div>
              </div>

              {/* CORPS */}
              <div className="detail-body">

                {/* Bandeau hors-ligne */}
                {offline && (
                  <div className="offline-banner">
                    Mode hors-ligne — données depuis le cache
                  </div>
                )}

                {/* Badges */}
                <div className="detail-meta">
                  <div className="detail-badges">
                    {meal.strCategory && <span className="tag tag-blue">{meal.strCategory}</span>}
                    {meal.strArea     && <span className="tag tag-teal">{meal.strArea}</span>}
                    {meal.strTags && meal.strTags.split(',').slice(0, 2).map(t => (
                      <span key={t} className="tag tag-blue">{t.trim()}</span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="detail-actions">
                    <button
                      className={`detail-fav-btn${favori ? ' is-fav' : ''}`}
                      onClick={() => onToggleFav(meal)}
                      title={favori ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                    >
                      <IcCoeur size={15} filled={favori} />
                      {favori ? 'Favori' : 'Ajouter'}
                    </button>

                    <button className="detail-share-btn" onClick={handleShare} title="Partager">
                      {copied ? <IcCheck size={14} /> : <IcShare size={14} />}
                      {copied ? 'Copié !' : 'Partager'}
                    </button>
                  </div>
                </div>

                {/* Titre */}
                <h1 className="detail-title">{meal.strMeal}</h1>

                {/* INGRÉDIENTS */}
                <div className="section-label">
                  Ingrédients ({ingredients.length})
                </div>
                <div className="detail-ings-grid">
                  {ingredients.map((ing, i) => (
                    <div key={i} className="detail-ing-item">
                      <div className="ingredient-dot" />
                      <span className="ingredient-name">{ing.name}</span>
                      {ing.measure && (
                        <span className="ingredient-measure">{ing.measure}</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* INSTRUCTIONS COMPLÈTES */}
                <div className="section-label">
                  Préparation ({instructions.length} étapes)
                </div>
                <div className="detail-steps">
                  {instructions.length > 0 ? (
                    instructions.map((step, i) => (
                      <div key={i} className="detail-step">
                        <div className="step-number">{i + 1}</div>
                        <div className="step-text">{step}</div>
                      </div>
                    ))
                  ) : (
                    <p className="instructions">{meal.strInstructions}</p>
                  )}
                </div>

                {/* LIEN YOUTUBE */}
                {meal.strYoutube && (
                  <a
                    className="modal-link-btn"
                    href={meal.strYoutube}
                    target="_blank"
                    rel="noreferrer"
                    style={{ marginTop: '1.5rem', display: 'inline-flex' }}
                  >
                    <IcVideo size={13} /> Voir la vidéo de préparation
                  </a>
                )}

                {/* Source */}
                {meal.strSource && (
                  <a
                    className="modal-link-btn"
                    href={meal.strSource}
                    target="_blank"
                    rel="noreferrer"
                    style={{ marginTop: '0.5rem', display: 'inline-flex' }}
                  >
                    <IcFleche size={13} /> Recette originale
                  </a>
                )}

                <div style={{ height: '2rem' }} />
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
}