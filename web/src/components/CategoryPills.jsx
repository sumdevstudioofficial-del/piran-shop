import React from 'react';
import { 
  LayoutGrid, 
  Smartphone, 
  Shirt, 
  Home, 
  ShoppingBag, 
  Sparkles, 
  Monitor,
  Dumbbell
} from 'lucide-react';

const iconMap = {
  LayoutGrid,
  Smartphone,
  Shirt,
  Home,
  ShoppingBag,
  Sparkles,
  Monitor,
  Dumbbell
};

export default function CategoryPills({ categories, activeCategory, onSelectCategory }) {
  return (
    <div className="py-3 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon] || LayoutGrid;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition shrink-0 cursor-pointer border ${
                  isActive
                    ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
