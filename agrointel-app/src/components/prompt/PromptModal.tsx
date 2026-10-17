import React, { useState } from 'react';
import {
  Copy,
  Check,
  ExternalLink,
  Download,
  X,
  FileCode,
  Terminal,
} from 'lucide-react';
import { promptEngine } from '../../services/promptEngine';
import { Skill, UserSettings } from '../../types';

interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  skill: Skill;
  inputs: Record<string, any>;
  settings: UserSettings;
  onCopied: () => void;
}

export const PromptModal: React.FC<PromptModalProps> = ({
  isOpen,
  onClose,
  skill,
  inputs,
  settings,
  onCopied,
}) => {
  const [selectedModel, setSelectedModel] = useState<'claude' | 'gemini' | 'chatgpt'>(
    settings.defaultModel || 'claude'
  );
  const [hasCopied, setHasCopied] = useState(false);

  if (!isOpen) return null;

  const promptText = promptEngine.buildPrompt({
    skill,
    inputs,
    settings,
    targetModel: selectedModel,
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setHasCopied(true);
      onCopied();
      setTimeout(() => setHasCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([promptText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `agrointel-${skill.slug}-${Date.now()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#071A12] border border-[rgba(255,255,255,0.12)] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Browser Mockup Window Title Bar */}
        <div className="px-5 py-4 bg-[#081710] border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Traffic Light Browser Window Dots */}
            <div className="flex items-center space-x-1.5 mr-2">
              <span className="w-3 h-3 rounded-full bg-[#EF4444] inline-block shadow-xs" />
              <span className="w-3 h-3 rounded-full bg-[#F59E0B] inline-block shadow-xs" />
              <span className="w-3 h-3 rounded-full bg-[#10B981] inline-block shadow-xs" />
            </div>

            <div className="w-8 h-8 rounded-lg bg-[rgba(16,185,129,0.15)] text-[#34D399] flex items-center justify-center shrink-0">
              <Terminal className="w-4 h-4" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  Prompt Especializado Gerado
                </h3>
                <span className="badge-agro">
                  Pronto para Rodar
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-md">
                {skill.name} • Engenharia de prompt agronômica
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-[rgba(255,255,255,0.08)] transition-all"
            aria-label="Fechar janela"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target Model Selector & Download Bar */}
        <div className="px-5 py-3 bg-[#091C13] border-b border-[rgba(255,255,255,0.08)] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider hidden sm:inline">
              Otimizar Formato:
            </span>
            <div className="flex items-center space-x-1 p-1 bg-[#06150E] border border-[rgba(255,255,255,0.08)] rounded-xl">
              <button
                onClick={() => setSelectedModel('claude')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedModel === 'claude'
                    ? 'bg-amber-500 text-black shadow-xs font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Claude 3.7 / 3.5
              </button>
              <button
                onClick={() => setSelectedModel('gemini')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedModel === 'gemini'
                    ? 'bg-[#10B981] text-white shadow-xs font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Gemini 2.5 Pro
              </button>
              <button
                onClick={() => setSelectedModel('chatgpt')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedModel === 'chatgpt'
                    ? 'bg-slate-700 text-white shadow-xs font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ChatGPT / GPT-4o
              </button>
            </div>
          </div>

          <button
            onClick={handleDownload}
            className="btn-agro-secondary py-1.5 px-3 text-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Baixar (.md)</span>
          </button>
        </div>

        {/* Terminal Code View */}
        <div className="relative flex-1 p-5 overflow-y-auto bg-[#040D09] border-y border-[rgba(255,255,255,0.04)] font-mono text-xs sm:text-[13px] text-[#34D399] leading-relaxed selection:bg-[#10B981] selection:text-black">
          <pre className="whitespace-pre-wrap break-words">{promptText}</pre>
        </div>

        {/* Action Bar Footer */}
        <div className="p-4 sm:p-5 bg-[#081710] border-t border-[rgba(255,255,255,0.08)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span>Copie o comando e cole diretamente no Claude ou Gemini.</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className={`btn-agro-primary py-2.5 px-6 text-xs sm:text-sm active:scale-95 ${
                hasCopied ? 'from-emerald-400 to-emerald-600' : ''
              }`}
            >
              {hasCopied ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Prompt Copiado com Sucesso!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-white" />
                  <span>Copiar Prompt Especializado</span>
                </>
              )}
            </button>

            {/* Launch Claude */}
            <a
              href="https://claude.ai/new"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleCopy}
              className="btn-agro-secondary py-2.5 px-4 text-xs font-semibold"
              title="Copia o prompt e abre nova conversa no Claude"
            >
              <span>Abrir Claude</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

            {/* Launch Gemini */}
            <a
              href="https://gemini.google.com/app"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleCopy}
              className="btn-agro-secondary py-2.5 px-4 text-xs font-semibold"
              title="Copia o prompt e abre o Gemini"
            >
              <span>Abrir Gemini</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
