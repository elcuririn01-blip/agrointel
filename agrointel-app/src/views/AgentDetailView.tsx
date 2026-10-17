import React, { useState } from 'react';
import { useParams, useNavigate, useOutletContext, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Bot,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { AGENTS_CATALOG } from '../data/agentsCatalog';
import { LayoutContextType } from '../components/layout/AppLayout';
import { IconHelper } from '../components/ui/IconHelper';

export const AgentDetailView: React.FC = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const { showToast } = useOutletContext<LayoutContextType>();

  const agent = AGENTS_CATALOG.find(a => a.id === agentId || a.slug === agentId);

  const [hasCopiedSys, setHasCopiedSys] = useState(false);
  const [copiedTaskIndex, setCopiedTaskIndex] = useState<number | null>(null);

  if (!agent) {
    return (
      <div className="p-8 text-center sales-card max-w-xl mx-auto shadow-sm">
        <h2 className="text-xl font-bold text-white">Agente não encontrado</h2>
        <Link to="/agents" className="inline-block mt-4 btn-agro-primary text-xs">
          Voltar aos Agentes
        </Link>
      </div>
    );
  }

  const handleCopySystemPrompt = async () => {
    try {
      await navigator.clipboard.writeText(agent.systemInstructions);
      setHasCopiedSys(true);
      showToast('success', 'Instruções Copiadas!', 'Cole na aba de instruções do Claude ou Gemini.');
      setTimeout(() => setHasCopiedSys(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyTask = async (taskText: string, index: number) => {
    try {
      await navigator.clipboard.writeText(taskText);
      setCopiedTaskIndex(index);
      showToast('success', 'Comando de Tarefa Copiado!', 'Cole no seu chat de IA para obter a resposta.');
      setTimeout(() => setCopiedTaskIndex(null), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Return button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white font-semibold transition-colors py-1 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        <span>Voltar aos Agentes</span>
      </button>

      {/* Hero Card */}
      <div className="sales-card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-5">
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
              <IconHelper name={agent.iconName} className="w-7 h-7" />
            </div>
            <div>
              <span className="badge-agro-gold">
                {agent.cropOrFocus}
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-2">
                {agent.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 mt-1 font-semibold">
                {agent.role}
              </p>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed max-w-2xl">
                {agent.description}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-col gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopySystemPrompt}
              className="btn-agro-gold text-xs py-2.5 px-5 active:scale-95"
            >
              {hasCopiedSys ? (
                <>
                  <Check className="w-4 h-4 text-black" />
                  <span>Instruções Copiadas!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-black" />
                  <span>Copiar System Prompt</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* All Capabilities */}
        <div className="mt-6 pt-5 border-t border-[rgba(255,255,255,0.06)]">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
            Especializações e Procedimentos Operacionais:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {agent.capabilities.map((cap, i) => (
              <div key={i} className="flex items-start space-x-2 p-3 rounded-xl bg-[#081D14] border border-[rgba(255,255,255,0.08)] text-xs text-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399] shrink-0 mt-0.5" />
                <span>{cap}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Tasks with 1-Click Copy */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-white">Tarefas Agronômicas Pré-configuradas</h2>
          <p className="text-xs text-slate-400">Clique para copiar o comando calibrado ou abra diretamente no Claude/Gemini</p>
        </div>

        <div className="space-y-4">
          {agent.recommendedPrompts.map((task, index) => {
            const isTaskCopied = copiedTaskIndex === index;
            return (
              <div
                key={index}
                className="sales-card p-6 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-bold text-white">{task.title}</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{task.description}</p>

                  <div className="mt-3 p-3.5 rounded-xl bg-[#040D09] border border-[rgba(255,255,255,0.06)] font-mono text-xs text-[#34D399] leading-relaxed">
                    <p className="line-clamp-3">{task.prefillPrompt}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[rgba(255,255,255,0.06)]">
                  <span className="text-[11px] text-slate-400">Pronto para execução externa</span>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleCopyTask(task.prefillPrompt, index)}
                      className={`btn-agro-primary text-xs py-2 px-3.5 ${
                        isTaskCopied ? 'from-emerald-400 to-emerald-600' : ''
                      }`}
                    >
                      {isTaskCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-white" />
                          <span>Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-white" />
                          <span>Copiar Comando</span>
                        </>
                      )}
                    </button>

                    <a
                      href="https://claude.ai/new"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleCopyTask(task.prefillPrompt, index)}
                      className="btn-agro-secondary text-xs py-2 px-3"
                      title="Copia comando e abre o Claude"
                    >
                      <span>Abrir Claude</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
