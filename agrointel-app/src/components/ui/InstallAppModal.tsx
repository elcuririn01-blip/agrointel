import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Download,
  X,
  Share2,
  PlusSquare,
  CheckCircle2,
  Sparkles,
  WifiOff,
  Cpu,
} from 'lucide-react';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Detect if already installed / standalone
    const isRunningStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(isRunningStandalone);

    // Capture beforeinstallprompt for Android / Chrome
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#071A12] border border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-[#081710] border-b border-white/8 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Instalar AgroIntel PRO no Celular
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Sem precisar baixar na Play Store ou App Store
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Benefit Highlights */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/8 flex items-center space-x-2 text-slate-200">
              <WifiOff className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Abre offline no talhão</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/8 flex items-center space-x-2 text-slate-200">
              <Cpu className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Acesso rápido na tela inicial</span>
            </div>
          </div>

          {isStandalone ? (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <strong className="block text-white text-sm">O aplicativo já está instalado!</strong>
              <p className="text-xs text-slate-300">
                Você já está utilizando o AgroIntel PRO no modo aplicativo integrado ao seu celular.
              </p>
            </div>
          ) : isIOS ? (
            /* iOS Safari Instructions */
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2.5">
                <span className="text-xs font-bold text-emerald-300 block uppercase tracking-wider font-mono">
                  Como adicionar no iPhone / iPad:
                </span>

                <div className="flex items-start space-x-3 text-xs text-slate-200">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-xs">
                    1
                  </div>
                  <div className="flex-1">
                    Toque no botão <strong>Compartilhar</strong> (ícone com um quadrado e uma seta para cima na barra do Safari).
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-xs text-slate-200">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-xs">
                    2
                  </div>
                  <div className="flex-1">
                    Role as opções e toque em <strong>"Adicionar à Tela de Início"</strong>.
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-xs text-slate-200">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-xs">
                    3
                  </div>
                  <div className="flex-1">
                    Toque em <strong>"Adicionar"</strong> no canto superior direito.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Android / Chrome Instructions */
            <div className="space-y-3">
              {deferredPrompt ? (
                <button
                  onClick={handleInstallClick}
                  className="w-full btn-agro-primary py-3 text-sm font-bold flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Instalar Agora no Meu Celular</span>
                </button>
              ) : (
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2.5 text-xs text-slate-200">
                  <span className="text-xs font-bold text-emerald-300 block uppercase tracking-wider font-mono">
                    Como adicionar no Android (Chrome):
                  </span>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-xs">
                      1
                    </div>
                    <div>Toque nos <strong>3 pontinhos</strong> no canto superior direito do Chrome.</div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-xs">
                      2
                    </div>
                    <div>Toque em <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.</div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-xs">
                      3
                    </div>
                    <div>O ícone do <strong>AgroIntel PRO</strong> aparecerá na tela do seu celular como um app nativo!</div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="pt-2 text-center text-[11px] text-slate-400">
            Fica salvo no celular com ícone próprio e tela cheia, sem barra do navegador.
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#081710] border-t border-white/8 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
