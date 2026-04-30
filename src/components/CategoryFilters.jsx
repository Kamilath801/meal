// src/components/CategoryFilters.jsx
import { IcGrille, IcRepas } from './Icons';

export default function CategoryFilters({ categories, activeFilter, onFilter }) {
  return (
    <div className="filters-zone">
      <div className="filters-label">Filtrer par catégorie</div>
      <div className="filters-list">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-btn${activeFilter === cat ? ' active' : ''}`}
            onClick={() => onFilter(cat)}
          >
            {cat === 'Toutes' ? <IcGrille size={12} /> : <IcRepas size={12} />}
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}