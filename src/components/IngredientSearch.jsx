// src/components/IngredientSearch.jsx
import { useState } from 'react';
import { IcIngredient, IcFermer } from './Icons';

const SUGGESTIONS = [
  { label: 'Poulet',   value: 'chicken' },
  { label: 'Tomate',   value: 'tomato'  },
  { label: 'Ail',      value: 'garlic'  },
  { label: 'Pâtes',    value: 'pasta'   },
  { label: 'Fromage',  value: 'cheese'  },
  { label: 'Oeuf',     value: 'egg'     },
  { label: 'Oignon',   value: 'onion'   },
  { label: 'Bœuf',     value: 'beef'    },
];

export default function IngredientSearch({ onSearch }) {
  const [input,       setInput]       = useState('');
  const [ingredients, setIngredients] = useState([]);

  const addIngredient = (val) => {
    const v = (val || input).trim().toLowerCase();
    if (!v || ingredients.includes(v)) return;
    setIngredients(prev => [...prev, v]);
    setInput('');
  };

  const removeIngredient = (val) => {
    setIngredients(prev => prev.filter(i => i !== val));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') addIngredient();
  };

  return (
    <div className="ing-zone">
      <div className="ing-zone-title">Quels ingrédients avez-vous ?</div>

      {/* Champ + bouton ajouter */}
      <div className="ing-input-row">
        <div className="ing-input-wrap">
          <span className="ing-input-icon"><IcIngredient size={14} /></span>
          <input
            className="search-input ing-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ajouter un ingrédient..."
            autoComplete="off"
          />
        </div>
        <button className="add-btn" onClick={() => addIngredient()}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"/><path d="M12 5v14"/>
          </svg>
          Ajouter
        </button>
      </div>

      {/* Suggestions rapides */}
      <div className="ing-suggestions">
        <span className="ing-sug-label">Rapide :</span>
        {SUGGESTIONS.map(s => (
          <button key={s.value} className="ing-sug-btn" onClick={() => addIngredient(s.value)}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Chips des ingrédients sélectionnés */}
      <div className="chips">
        {ingredients.map(ing => (
          <div key={ing} className="chip">
            <IcIngredient size={11} />
            {ing}
            <button className="chip-remove" onClick={() => removeIngredient(ing)}>
              <IcFermer size={10} />
            </button>
          </div>
        ))}
      </div>

      {/* Bouton recherche */}
      <button
        className="search-ing-btn"
        onClick={() => onSearch(ingredients)}
        disabled={ingredients.length === 0}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        Trouver des recettes avec ces ingrédients
      </button>

      <div className="ing-hint">
        L'API cherche les recettes contenant <strong>au moins un</strong> de vos ingrédients
      </div>
    </div>
  );
}