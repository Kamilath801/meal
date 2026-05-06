

// src/App.jsx
import { useState, useEffect, useRef } from 'react';
import './App.css';

import useFavorites     from './hooks/useFavorites';
import usePagination    from './hooks/usePagination';
import ModeTabs         from './components/ModeTabs';
import SearchBar        from './components/SearchBar';
import IngredientSearch from './components/IngredientSearch';
import CategoryFilters  from './components/CategoryFilters';
import RecipeCard       from './components/RecipeCard';
import SkeletonCard     from './components/SkeletonCard';
import RecipeDetail     from './components/RecipeDetail';
import FavoritesPanel   from './components/FavoritesPanel';
import Pagination       from './components/Pagination';
import { IcAssiette, IcFermer } from './components/Icons';

const PER_PAGE = 8;

export default function App() {
  const [mode,         setMode]        = useState('recette');
  const [query,        setQuery]       = useState('');
  const [allMeals,     setAllMeals]    = useState([]);
  const [filtered,     setFiltered]    = useState([]);
  const [categories,   setCategories]  = useState(['Toutes']);
  const [activeFilter, setActiveFilter]= useState('Toutes');
  const [status,       setStatus]      = useState('welcome');
  const [selectedId,   setSelectedId]  = useState(null);
  const debounceRef = useRef(null);

  const { favorites, isFav, toggleFav, clearFavorites } = useFavorites();
  const { page, totalPages, paginated, goTo, next, prev } = usePagination(filtered, PER_PAGE);

  const handleSwitchMode = (m) => {
    setMode(m); setStatus('welcome');
    setAllMeals([]); setFiltered([]);
    setCategories(['Toutes']); setActiveFilter('Toutes');
    setQuery('');
  };

  /* Debounce recherche par nom */
  useEffect(() => {
    if (mode !== 'recette') return;
    if (query.trim().length < 2) { if (!query.trim()) setStatus('welcome'); return; }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchByName(query.trim()), 500);
    return () => clearTimeout(debounceRef.current);
  }, [query, mode]);

  const searchByName = async (term) => {
    setStatus('loading'); setActiveFilter('Toutes');
    try {
      const res  = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(term)}`);
      const data = await res.json();
      const meals = data.meals || [];
      if (!meals.length) { setStatus('empty'); return; }
      setAllMeals(meals); setFiltered(meals);
      setCategories(['Toutes', ...new Set(meals.map(m => m.strCategory).filter(Boolean))]);
      setStatus('results');
    } catch { setStatus('empty'); }
  };

  const searchByIngredients = async (ingredients) => {
    if (!ingredients.length) return;
    setStatus('loading'); setActiveFilter('Toutes');
    try {
      const results = await Promise.all(
        ingredients.map(ing =>
          fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(ing)}`).then(r => r.json())
        )
      );
      const seen = new Set(), merged = [];
      results.forEach(d => (d.meals || []).forEach(m => {
        if (!seen.has(m.idMeal)) { seen.add(m.idMeal); merged.push(m); }
      }));
      if (!merged.length) { setStatus('empty'); return; }
      setAllMeals(merged); setFiltered(merged);
      setCategories(['Toutes']); setStatus('results');
    } catch { setStatus('empty'); }
  };

  const handleFilter = (cat) => {
    setActiveFilter(cat);
    setFiltered(cat === 'Toutes' ? allMeals : allMeals.filter(m => m.strCategory === cat));
  };

  return (
    <>
      {/* HEADER */}
      <header className="header">
        <div className="logo">Meal<span>Finder</span></div>
        <div className="tagline">Découvrir · Cuisiner · Savourer</div>
      </header>

      {/* ONGLETS */}
      <ModeTabs activeMode={mode} onSwitch={handleSwitchMode} favCount={favorites.length} />

      {/* ====== FAVORIS ====== */}
      {mode === 'favoris' && (
        <FavoritesPanel
          favorites={favorites}
          isFav={isFav}
          onToggleFav={toggleFav}
          onOpenModal={setSelectedId}
          onClear={clearFavorites}
          onGoSearch={() => handleSwitchMode('recette')}
        />
      )}

      {/* ====== RECHERCHE ====== */}
      {mode !== 'favoris' && (
        <>
          {mode === 'recette' && (
            status === 'welcome'
              ? <SearchBar query={query} onChange={setQuery} onSearch={searchByName} />
              : (
                <div className="search-zone">
                  <div className="search-wrapper">
                    <span className="search-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                      </svg>
                    </span>
                    <input
                      className="search-input" type="text" value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && query.trim()) searchByName(query.trim()); }}
                      placeholder="Rechercher une recette..." autoComplete="off"
                    />
                  </div>
                  <div className="search-hint">Appuyez sur <kbd>Entrée</kbd> pour relancer</div>
                </div>
              )
          )}

          {mode === 'ingredients' && <IngredientSearch onSearch={searchByIngredients} />}

          {/* Filtres */}
          {status === 'results' && categories.length > 2 && (
            <CategoryFilters categories={categories} activeFilter={activeFilter} onFilter={handleFilter} />
          )}

          {/* Chargement */}
          {status === 'loading' && (
            <div className="skeleton-grid">
              {[1,2,3,4].map(n => <SkeletonCard key={n} />)}
            </div>
          )}

          {/* Vide */}
          {status === 'empty' && (
            <div className="state-container">
              <div className="state-icon"><IcAssiette size={40} /></div>
              <div className="state-title">Aucune recette trouvée</div>
              <div className="state-sub">Essayez un autre mot-clé</div>
            </div>
          )}

          {/* Résultats */}
          {status === 'results' && (
            <>
              <div className="results-meta">
                <div className="results-count">
                  <strong>{filtered.length}</strong>{' '}
                  recette{filtered.length > 1 ? 's' : ''} trouvée{filtered.length > 1 ? 's' : ''}
                  {totalPages > 1 && (
                    <span style={{ color: 'var(--text-dim)', marginLeft: '6px' }}>
                      · page {page}/{totalPages}
                    </span>
                  )}
                </div>
                {activeFilter !== 'Toutes' && (
                  <button className="active-filter-badge" onClick={() => handleFilter('Toutes')}>
                    <IcFermer size={11} /> {activeFilter}
                  </button>
                )}
              </div>

              {/* Grille paginée */}
              <div className="recipes-grid">
                {paginated.map(meal => (
                  <RecipeCard
                    key={meal.idMeal}
                    meal={meal}
                    onClick={setSelectedId}
                    mode={mode}
                    isFav={isFav(meal.idMeal)}
                    onToggleFav={toggleFav}
                  />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                page={page}
                totalPages={totalPages}
                onPrev={prev}
                onNext={next}
                onGoTo={goTo}
              />
            </>
          )}
        </>
      )}

      {/* PAGE DE DÉTAIL COMPLÈTE */}
      {selectedId && (
        <RecipeDetail
          mealId={selectedId}
          onClose={() => setSelectedId(null)}
          isFav={isFav}
          onToggleFav={toggleFav}
        />
      )}
    </>
  );
}