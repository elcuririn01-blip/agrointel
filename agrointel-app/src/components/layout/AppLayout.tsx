import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { ToastContainer, ToastMessage } from '../ui/Toast';
import { storageService } from '../../services/storageService';
import { UserSettings } from '../../types';

export interface LayoutContextType {
  settings: UserSettings;
  updateSettings: (newSettings: UserSettings) => void;
  showToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
  favorites: string[];
  toggleFavorite: (skillId: string) => void;
}

export const AppLayout: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [settings, setSettings] = useState<UserSettings>(() => storageService.getSettings());
  const [favorites, setFavorites] = useState<string[]>(() => storageService.getFavorites());
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname, location.search]);

  const showToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const newToast: ToastMessage = {
      id: Date.now().toString(),
      type,
      title,
      message,
    };
    setToasts(prev => [...prev, newToast]);
  };

  const handleDismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleToggleFavorite = (skillId: string) => {
    const updated = storageService.toggleFavorite(skillId);
    setFavorites(updated);
    const isNowFav = updated.includes(skillId);
    showToast(
      'info',
      isNowFav ? 'Adicionado aos Favoritos' : 'Removido dos Favoritos',
      'Acesse rapidamente no painel inicial ou na aba Favoritos.'
    );
  };

  const handleUpdateSettings = (newSettings: UserSettings) => {
    storageService.saveSettings(newSettings);
    setSettings(newSettings);
    showToast('success', 'Configurações salvas', 'Seus dados profissionais e modelo padrão foram atualizados.');
  };

  return (
    <div className="min-h-screen bg-[#071A12] text-white flex flex-col md:flex-row antialiased selection:bg-emerald-500 selection:text-black">
      {/* Desktop & Mobile Drawer Sidebar */}
      <Sidebar
        settings={settings}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        favoritesCount={favorites.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <Navbar
          settings={settings}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          <Outlet
            context={{
              settings,
              updateSettings: handleUpdateSettings,
              showToast,
              favorites,
              toggleFavorite: handleToggleFavorite,
            }}
          />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
};
