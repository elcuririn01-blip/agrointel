import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Layers, Bot, History, Settings } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const tabs = [
    { to: '/', label: 'Início', icon: Home },
    { to: '/skills', label: 'Skills', icon: Layers },
    { to: '/agents', label: 'Agentes', icon: Bot },
    { to: '/history', label: 'Histórico', icon: History },
    { to: '/settings', label: 'Ajustes', icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#081710]/95 backdrop-blur-md border-t border-[rgba(255,255,255,0.08)] px-2 py-1.5 flex justify-around items-center shadow-2xl">
      {tabs.map(tab => {
        const Icon = tab.icon;
        return (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-semibold transition-colors ${
                isActive
                  ? 'text-[#34D399] font-bold'
                  : 'text-slate-400 hover:text-white'
              }`
            }
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span>{tab.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};
