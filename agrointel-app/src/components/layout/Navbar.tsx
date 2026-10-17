import React, { useState } from 'react';
import { Search, Sparkles, Smartphone, Menu, Command } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { UserSettings } from '../../types';
import { InstallAppModal } from '../ui/InstallAppModal';

interface NavbarProps {
  settings: UserSettings;
  onOpenMobileMenu: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  onOpenMobileMenu,
  searchQuery,
  onSearchChange,
}) => {
  const navigate = useNavigate();
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/skills?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#081710] border-b border-white/8 px-4 md:px-6 flex items-center justify-between">
      {/* Left: Window Dots & Logo */}
      <div className="flex items-center space-x-4">
        {/* Mobile menu button */}
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
          aria-label="Abrir navegação"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Browser Mockup Dots */}
        <div className="hidden sm:flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
        </div>

        {/* Logo Link */}
        <Link to="/" className="flex items-center space-x-2.5">
          <img src="/logo.svg" alt="AgroIntel Pro" className="h-6 w-auto" onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }} />
          <div className="flex items-center space-x-1.5">
            <span className="font-extrabold text-base tracking-tight text-white">AgroIntel</span>
            <span className="text-[10px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-500 text-black">PRO</span>
          </div>
        </Link>
      </div>

      {/* Center: Search / URL Bar */}
      <div className="hidden md:flex flex-1 max-w-md mx-6">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar ferramentas (visita, solo, milho, defensivo)..."
            className="w-full bg-white/6 hover:bg-white/8 focus:bg-white/10 border border-white/10 rounded-lg pl-9 pr-10 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-all font-mono"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-mono pointer-events-none">
            Ctrl K
          </div>
        </form>
      </div>

      {/* Right: Status and Sales Page Link */}
      <div className="flex items-center space-x-3">
        {/* Online Status from Sales Page */}
        <div className="hidden sm:flex items-center space-x-2 text-[11px] text-[#34D399] font-bold">
          <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
          <span>Sistema Online · v3.4 Pro</span>
        </div>

        {/* Instalar App no Celular */}
        <button
          onClick={() => setIsInstallModalOpen(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-xs font-semibold text-emerald-300 hover:text-white transition-colors cursor-pointer"
          title="Instalar aplicativo na tela inicial do celular"
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Instalar no Celular</span>
          <span className="sm:hidden">Instalar</span>
        </button>
      </div>

      {/* Modal de Instalação PWA */}
      <InstallAppModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />
    </header>
  );
};
