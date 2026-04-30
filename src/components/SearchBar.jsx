// src/components/SearchBar.jsx
import { IcLoupe, IcRepas, IcFiltres, IcCoeur, IcIngredient } from './Icons';

const SUGGESTIONS = [
  { label: 'Poulet',  value: 'Chicken' },
  { label: 'Pâtes',   value: 'Pasta'   },
  { label: 'Sushi',   value: 'Sushi'   },
  { label: 'Bœuf',    value: 'Beef'    },
  { label: 'Salade',  value: 'Salad'   },
  { label: 'Gâteau',  value: 'Cake'    },
  { label: 'Soupe',   value: 'Soup'    },
  { label: 'Pizza',   value: 'Pizza'   },
];

export default function SearchBar({ query, onChange, onSearch }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && query.trim().length >= 1) onSearch(query.trim());
  };

  const handleSuggestion = (value) => {
    onChange(value);
    onSearch(value);
  };

  return (
    <>
      <div className="search-zone">
        <div className="search-wrapper">
          <span className="search-icon"><IcLoupe size={16} /></span>
          <input
            className="search-input"
            type="text"
            value={query}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Rechercher une recette... (ex : poulet, pâtes, soupe)"
            autoComplete="off"
          />
        </div>
        <div className="search-hint">
          Appuyez sur <kbd>Entrée</kbd> pour rechercher · Minimum 2 lettres
        </div>
      </div>

      <div className="welcome">
        <div className="welcome-title">Suggestions rapides</div>
        <div className="quick-searches">
          {SUGGESTIONS.map((item) => (
            <button key={item.value} className="quick-btn" onClick={() => handleSuggestion(item.value)}>
              <IcRepas size={13} />
              {item.label}
            </button>
          ))}
        </div>
        <div className="feature-strip">
          <div className="feature-pill"><IcLoupe size={17} />Recherche</div>
          <div className="feature-pill"><IcFiltres size={17} />Filtres</div>
          <div className="feature-pill"><IcCoeur size={17} />Favoris</div>
          <div className="feature-pill"><IcIngredient size={17} />Ingrédients</div>
        </div>
      </div>
    </>
  );
}