// src/components/FavButton.jsx
// Bouton cœur sur chaque carte
import { IcCoeur } from './Icons';

export default function FavButton({ meal, isFav, onToggle }) {
  const handleClick = (e) => {
    e.stopPropagation(); // Ne pas ouvrir la modal
    onToggle(meal);
  };

  return (
    <button
      className={`fav-btn${isFav ? ' is-fav' : ''}`}
      onClick={handleClick}
      title={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
      <IcCoeur size={14} filled={isFav} />
    </button>
  );
}