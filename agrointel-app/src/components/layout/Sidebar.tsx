import React from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import {
  Home,
  Layers,
  Bot,
  History,
  Bookmark,
  Settings,
  FileText,
  X,
  UserCheck,
  ChevronRight,
  BadgeCheck,
} from 'lucide-react';
import { UserSettings } from '../../types';
import { CATEGORIES } from '../../data/categories';
import { IconHelper } from '../ui/IconHelper';

interface SidebarProps {
  settings: UserSettings;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  favoritesCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  settings,
  isOpenMobile,
  onCloseMobile,
  favoritesCount,
}) => {
  const location = useLocation();
  const currentCatParam = new URLSearchParams(location.search).get('cat');

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container matching sales page .app-sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-[#091C13] border-r border-white/8 flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto p-4 space-y-6">
          {/* Top Brand on mobile */}
          <div className="flex items-center justify-between md:hidden pb-3 border-b border-white/8">
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-base text-white">AgroIntel PRO</span>
            </div>
            <button
              onClick={onCloseMobile}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Primary Navigation */}
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#64748B] mb-2 px-3">
              Módulos Operacionais
            </div>
            <div className="space-y-1">
              <NavLink
                to="/"
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${
                    isActive && location.pathname === '/'
                      ? 'bg-emerald-500/15 text-[#34D399] font-bold'
                      : 'text-[#CBD5E1] hover:text-white hover:bg-emerald-500/10'
                  }`
                }
              >
                <Home className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Painel Inicial</span>
              </NavLink>

              <NavLink
                to="/skills"
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${
                    isActive && !currentCatParam
                      ? 'bg-emerald-500/15 text-[#34D399] font-bold'
                      : 'text-[#CBD5E1] hover:text-white hover:bg-emerald-500/10'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Todas as Skills</span>
                </div>
                <span className="text-[11px] bg-white/10 text-[#94A3B8] px-2 py-0.5 rounded-md font-mono font-bold">
                  108
                </span>
              </NavLink>

              <NavLink
                to="/agents"
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-500/15 text-[#34D399] font-bold'
                      : 'text-[#CBD5E1] hover:text-white hover:bg-emerald-500/10'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Bot className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Agentes de IA</span>
                </div>
                <span className="text-[11px] bg-amber-500/20 text-[#FBBF24] px-2 py-0.5 rounded-md font-mono font-bold">
                  75 IA
                </span>
              </NavLink>

              <NavLink
                to="/notes"
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-500/15 text-[#34D399] font-bold'
                      : 'text-[#CBD5E1] hover:text-white hover:bg-emerald-500/10'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Anotações de Campo</span>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono">
                  Offline
                </span>
              </NavLink>
            </div>
          </div>

          {/* Department Categories from Sales Page (13 Departamentos Oficiais) */}
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#64748B] mb-2 px-3">
              Departamentos do Agro
            </div>
            <div className="space-y-1">
              {CATEGORIES.map(dept => {
                const isSelected = location.pathname === '/skills' && currentCatParam === dept.id;
                return (
                  <NavLink
                    key={dept.id}
                    to={`/skills?cat=${dept.id}`}
                    onClick={onCloseMobile}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-[13px] font-semibold transition-all ${
                      isSelected
                        ? 'bg-emerald-500/15 text-[#34D399] font-bold'
                        : 'text-[#CBD5E1] hover:text-white hover:bg-emerald-500/10'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <IconHelper name={dept.iconName} className="w-4 h-4 shrink-0 text-slate-400" />
                      <span className="truncate">{dept.label}</span>
                    </div>
                    {dept.count !== undefined && (
                      <span className="text-[11px] bg-white/10 text-[#94A3B8] px-1.5 py-0.2 rounded-md font-mono">
                        {dept.count}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* Workflows */}
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#64748B] mb-2 px-3">
              Minha Rotina
            </div>
            <div className="space-y-1">
              <NavLink
                to="/history"
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-500/15 text-[#34D399] font-bold'
                      : 'text-[#CBD5E1] hover:text-white hover:bg-emerald-500/10'
                  }`
                }
              >
                <History className="w-4 h-4 shrink-0 text-slate-400" />
                <span>Histórico de Prompts</span>
              </NavLink>

              <NavLink
                to="/favorites"
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-xl text-[13px] font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-500/15 text-[#34D399] font-bold'
                      : 'text-[#CBD5E1] hover:text-white hover:bg-emerald-500/10'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Bookmark className="w-4 h-4 shrink-0 text-slate-400" />
                  <span>Favoritos</span>
                </div>
                {favoritesCount > 0 && (
                  <span className="text-[11px] bg-white/10 text-emerald-300 px-1.5 py-0.2 rounded-md font-mono">
                    {favoritesCount}
                  </span>
                )}
              </NavLink>

              <NavLink
                to="/settings"
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-500/15 text-[#34D399] font-bold'
                      : 'text-[#CBD5E1] hover:text-white hover:bg-emerald-500/10'
                  }`
                }
              >
                <Settings className="w-4 h-4 shrink-0 text-slate-400" />
                <span>Configurações</span>
              </NavLink>
            </div>
          </div>
        </div>

        {/* Footer Technical Card */}
        <div className="p-3 border-t border-white/8 bg-[#07160F]">
          <Link
            to="/settings"
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/8 border border-white/8 flex items-center space-x-3 transition-colors"
          >
            <div className="relative w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <UserCheck className="w-4 h-4" />
              <BadgeCheck className="w-3 h-3 text-emerald-400 absolute -bottom-1 -right-1" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">
                {settings.agronomistName || 'Eng. Agrônomo'}
              </p>
              <p className="text-[10px] text-slate-400 font-mono truncate">
                {settings.creaNumber || 'CREA Habilitado'}
              </p>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </Link>
        </div>
      </aside>
    </>
  );
};
