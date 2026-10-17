import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate, useOutletContext } from 'react-router-dom';
import {
  Search,
  Bookmark,
  ChevronRight,
  Clock,
  Layers,
} from 'lucide-react';
import { SKILLS_CATALOG } from '../data/skillsCatalog';
import { CATEGORIES } from '../data/categories';
import { LayoutContextType } from '../components/layout/AppLayout';
import { IconHelper } from '../components/ui/IconHelper';
import { SkillCategory } from '../types';

export const SkillsCatalogView: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useOutletContext<LayoutContextType>();

  const activeCategory = searchParams.get('cat') as SkillCategory | null;
  const initialQuery = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(initialQuery);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null && q !== searchTerm) {
      setSearchTerm(q);
    }
  }, [searchParams]);

  const handleSelectCategory = (catId: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (catId) {
      newParams.set('cat', catId);
    } else {
      newParams.delete('cat');
    }
    setSearchParams(newParams);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    const newParams = new URLSearchParams(searchParams);
    if (value.trim()) {
      newParams.set('q', value.trim());
    } else {
      newParams.delete('q');
    }
    setSearchParams(newParams);
  };

  const filteredSkills = useMemo(() => {
    return SKILLS_CATALOG.filter(skill => {
      if (activeCategory && skill.category !== activeCategory) {
        return false;
      }
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = skill.name.toLowerCase().includes(query);
        const matchesDesc = skill.description.toLowerCase().includes(query);
        const matchesSummary = skill.summary.toLowerCase().includes(query);
        const matchesRole = skill.technicalRole.toLowerCase().includes(query);
        const matchesTags = skill.tags.some(t => t.toLowerCase().includes(query));
        return matchesName || matchesDesc || matchesSummary || matchesRole || matchesTags;
      }
      return true;
    });
  }, [activeCategory, searchTerm]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-white/8">
        <div>
          <div className="flex items-center space-x-2">
            <span className="badge-agro">
              <Layers className="w-3.5 h-3.5" />
              Catálogo Operacional
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-1.5">
            108 Skills Agronômicas Homologadas
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Ferramentas padronizadas para transformar dados de campo em relatórios e recomendações técnicas formais.
          </p>
        </div>

        {/* Search Bar Input */}
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => handleSearchChange(e.target.value)}
            placeholder="Filtrar por cultura, praga, laudo..."
            className="sales-input w-full pl-10 pr-4 py-2 text-xs sm:text-sm"
          />
        </div>
      </div>

      {/* Category Tabs Filter */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => handleSelectCategory(null)}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            !activeCategory
              ? 'bg-[#10B981] text-white font-bold shadow-sm'
              : 'bg-white/5 text-[#CBD5E1] hover:text-white hover:bg-white/8 border border-white/10'
          }`}
        >
          Todas as Skills ({SKILLS_CATALOG.length})
        </button>

        {CATEGORIES.map(cat => {
          const isSelected = activeCategory === cat.id;
          const count = SKILLS_CATALOG.filter(s => s.category === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => handleSelectCategory(cat.id)}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-[#10B981] text-white font-bold shadow-sm'
                  : 'bg-white/5 text-[#CBD5E1] hover:text-white hover:bg-white/8 border border-white/10'
              }`}
            >
              <IconHelper name={cat.iconName} className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${isSelected ? 'bg-black/20 text-white' : 'bg-white/10 text-[#94A3B8]'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Skills Grid */}
      {filteredSkills.length === 0 ? (
        <div className="p-12 text-center rounded-2xl sales-card">
          <Layers className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">Nenhuma ferramenta encontrada</h3>
          <p className="text-xs text-[#94A3B8] mt-1 max-w-sm mx-auto">
            Não foram encontradas skills correspondentes aos termos pesquisados. Tente buscar por outros termos ou limpe o filtro.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              handleSelectCategory(null);
            }}
            className="mt-4 btn-agro-secondary text-xs"
          >
            Limpar Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSkills.map(skill => {
            const isFav = favorites.includes(skill.id);
            return (
              <div
                key={skill.id}
                className="sales-card p-6 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Icon, Category & Favorite Toggle */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-[#34D399] flex items-center justify-center shrink-0">
                      <IconHelper name={skill.iconName} className="w-5 h-5" />
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <span className="badge-agro">
                        {skill.categoryLabel}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(skill.id);
                        }}
                        className={`p-1.5 rounded-lg border transition-all ${
                          isFav
                            ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                        }`}
                        title={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                        aria-label="Favoritar ferramenta"
                      >
                        <Bookmark className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Technical Role */}
                  <h3 className="text-base font-bold text-white leading-snug">
                    {skill.name}
                  </h3>
                  <p className="text-[11px] font-semibold text-[#34D399] mt-1">
                    Atuação: {skill.technicalRole}
                  </p>

                  {/* Summary */}
                  <p className="text-xs text-[#94A3B8] mt-2 line-clamp-3 leading-relaxed">
                    {skill.summary}
                  </p>

                  {/* Tags */}
                  <div className="mt-3.5 flex flex-wrap gap-1.5">
                    {skill.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/8 font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-6 pt-3.5 border-t border-white/8 flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-[11px] text-[#94A3B8] font-mono">
                    <Clock className="w-3 h-3 text-[#34D399]" />
                    <span>~{skill.estimatedMinutes} min</span>
                  </div>

                  <button
                    onClick={() => navigate(`/skills/${skill.id}`)}
                    className="btn-agro-primary text-xs py-2 px-4"
                  >
                    <span>Iniciar</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
