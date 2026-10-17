import React from 'react';
import { useNavigate, useOutletContext, Link } from 'react-router-dom';
import { Bookmark, Clock, ChevronRight } from 'lucide-react';
import { SKILLS_CATALOG } from '../data/skillsCatalog';
import { LayoutContextType } from '../components/layout/AppLayout';
import { IconHelper } from '../components/ui/IconHelper';

export const FavoritesView: React.FC = () => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useOutletContext<LayoutContextType>();

  const favoriteSkills = SKILLS_CATALOG.filter(s => favorites.includes(s.id));

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="pb-4 border-b border-[rgba(255,255,255,0.08)]">
        <div className="flex items-center space-x-2">
          <Bookmark className="w-5 h-5 text-amber-400 fill-current" />
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Ferramentas Favoritas</h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Acesse instantaneamente suas rotinas mais frequentes de consultoria agronômica.
        </p>
      </div>

      {favoriteSkills.length === 0 ? (
        <div className="p-12 text-center sales-card">
          <Bookmark className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">Nenhum favorito selecionado</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Clique no ícone de marcador nas ferramentas do catálogo para adicioná-las aos seus favoritos.
          </p>
          <Link
            to="/skills"
            className="inline-block mt-4 btn-agro-primary text-xs"
          >
            Navegar no Catálogo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {favoriteSkills.map(skill => (
            <div
              key={skill.id}
              className="sales-card p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[rgba(16,185,129,0.15)] text-[#34D399] flex items-center justify-center shrink-0">
                    <IconHelper name={skill.iconName} className="w-5 h-5" />
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <span className="badge-agro">
                      {skill.categoryLabel}
                    </span>
                    <button
                      onClick={() => toggleFavorite(skill.id)}
                      className="p-1.5 rounded-lg border bg-amber-500/15 border-amber-500/30 text-amber-400 transition-colors"
                      title="Remover dos favoritos"
                    >
                      <Bookmark className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white leading-snug">
                  {skill.name}
                </h3>
                <p className="text-[11px] font-semibold text-[#34D399] mt-1">
                  Atuação: {skill.technicalRole}
                </p>
                <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                  {skill.summary}
                </p>
              </div>

              <div className="mt-6 pt-3.5 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between">
                <div className="flex items-center space-x-1 text-[11px] text-slate-400 font-mono">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>~{skill.estimatedMinutes} min</span>
                </div>

                <button
                  onClick={() => navigate(`/skills/${skill.id}`)}
                  className="btn-agro-primary py-2 px-4 text-xs"
                >
                  <span>Iniciar</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
