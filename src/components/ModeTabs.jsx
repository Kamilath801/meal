// src/components/ModeTabs.jsx
import { IcLoupe, IcIngredient, IcCoeur } from './Icons';

export default function ModeTabs({ activeMode, onSwitch, favCount }) {
  return (
    <div className="mode-tabs">
      <button
        className={`mode-tab${activeMode === 'recette' ? ' active' : ''}`}
        onClick={() => onSwitch('recette')}
      >
        <IcLoupe size={14} />
        Recherche
      </button>

      <button
        className={`mode-tab${activeMode === 'ingredients' ? ' active' : ''}`}
        onClick={() => onSwitch('ingredients')}
      >
        <IcIngredient size={14} />
        Ingrédients
      </button>

      <button
        className={`mode-tab${activeMode === 'favoris' ? ' active' : ''}`}
        onClick={() => onSwitch('favoris')}
      >
        <IcCoeur size={14} />
        Favoris
        {favCount > 0 && (
          <span className="fav-count-badge">{favCount}</span>
        )}
      </button>
    </div>
  );
}