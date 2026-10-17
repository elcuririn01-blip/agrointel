import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  Bot,
  Copy,
  Check,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { AGENTS_CATALOG } from '../data/agentsCatalog';
import { LayoutContextType } from '../components/layout/AppLayout';
import { IconHelper } from '../components/ui/IconHelper';

export const AgentsCatalogView: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useOutletContext<LayoutContextType>();
  const [copiedAgentId, setCopiedAgentId] = useState<string | null>(null);

  const handleCopySystemPrompt = async (agentId: string, systemPrompt: string) => {
    try {
      await navigator.clipboard.writeText(systemPrompt);
      setCopiedAgentId(agentId);
      showToast('success', 'Instruções do Agente Copiadas!', 'Cole no System Prompt do Claude ou nas instruções do Gemini Gem.');
      setTimeout(() => setCopiedAgentId(null), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="pb-4 border-b border-[rgba(255,255,255,0.08)]">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-amber-400" />
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Co-pilotos e Agentes Especialistas</h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
          Instruções de sistema calibradas com base em manuais da Embrapa e literatura agronômica para transformar o Claude ou Gemini em assistentes técnicos de campo.
        </p>
      </div>

      {/* Agents List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {AGENTS_CATALOG.map(agent => {
          const isCopied = copiedAgentId === agent.id;
          return (
            <div
              key={agent.id}
              className="sales-card p-6 flex flex-col justify-between"
            >
              <div>
                {/* Header of Card */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
                      <IconHelper name={agent.iconName} className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                        {agent.name}
                      </h2>
                      <span className="text-[11px] font-semibold text-amber-400">
                        {agent.cropOrFocus}
                      </span>
                    </div>
                  </div>

                  <span className="badge-agro-gold">
                    Co-piloto
                  </span>
                </div>

                {/* Role & Summary */}
                <p className="text-xs text-slate-200 font-semibold leading-relaxed mt-2">
                  {agent.role}
                </p>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  {agent.description}
                </p>

                {/* Technical Capabilities */}
                <div className="mt-4 sales-rec-box space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    Competências Técnicas:
                  </span>
                  {agent.capabilities.slice(0, 3).map((cap, i) => (
                    <div key={i} className="flex items-center space-x-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399] shrink-0" />
                      <span className="truncate">{cap}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-6 pt-4 border-t border-[rgba(255,255,255,0.06)] flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => handleCopySystemPrompt(agent.id, agent.systemInstructions)}
                  className={`btn-agro-secondary text-xs py-2 px-3.5 active:scale-95 ${
                    isCopied ? 'border-[#10B981] text-[#34D399]' : ''
                  }`}
                  title="Copia o prompt de instruções do sistema do agente"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#34D399]" />
                      <span>Instruções Copiadas!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar System Prompt</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => navigate(`/agents/${agent.id}`)}
                  className="btn-agro-primary text-xs py-2 px-3.5"
                >
                  <span>Tarefas Recomendadas</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
