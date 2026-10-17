import React from 'react';
import { Link, useOutletContext, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ClipboardCheck,
  FileText,
  Sprout,
  CalendarCheck,
  DollarSign,
  Landmark,
  Beef,
  Bookmark,
  Clock,
  CheckCircle2,
  Bot,
  Layers,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { LayoutContextType } from '../components/layout/AppLayout';
import { SKILLS_CATALOG } from '../data/skillsCatalog';
import { AGENTS_CATALOG } from '../data/agentsCatalog';
import { CATEGORIES } from '../data/categories';
import { storageService } from '../services/storageService';
import { IconHelper } from '../components/ui/IconHelper';

export const DashboardView: React.FC = () => {
  const { settings, favorites, showToast } = useOutletContext<LayoutContextType>();
  const navigate = useNavigate();

  const history = storageService.getHistory();
  const favoriteSkills = SKILLS_CATALOG.filter(s => favorites.includes(s.id));

  const handleCopyHistoryPrompt = async (promptText: string) => {
    try {
      await navigator.clipboard.writeText(promptText);
      showToast('success', 'Prompt Copiado!', 'Cole no Claude ou Gemini para gerar o documento.');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header Banner matching .app-pane-header from Sales Page */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/8 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Plataforma Operacional de IA Agronômica
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Módulos de campo · 108 Skills homologadas · 75 Agentes por cultura · Padrão CREA & ART
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="badge-agro">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
            Status: Pronto para Uso
          </span>
          <span className="badge-agro-gold">
            <Sparkles className="w-3 h-3" />
            Qualidade: Padrão Ouro
          </span>
        </div>
      </div>

      {/* 2. Key Metrics Grid matching .mock-report-grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="sales-card p-4">
          <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
            Skills do Agro
          </div>
          <div className="text-lg font-bold text-white">{SKILLS_CATALOG.length} Rotinas Ativas</div>
          <p className="text-xs text-[#94A3B8] mt-0.5">13 Departamentos homologados</p>
        </div>

        <div className="sales-card p-4">
          <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
            Co-pilotos Especialistas
          </div>
          <div className="text-lg font-bold text-white">{AGENTS_CATALOG.length} Agentes de IA</div>
          <p className="text-xs text-[#94A3B8] mt-0.5">8 Grupos de culturas e manejo</p>
        </div>

        <div className="sales-card p-4">
          <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
            Privacidade de Campo
          </div>
          <div className="text-lg font-bold text-white">100% Local (LGPD)</div>
          <p className="text-xs text-[#94A3B8] mt-0.5">Sem envio a servidores terceiros</p>
        </div>

        <div className="sales-card p-4">
          <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
            Modelo Conectado
          </div>
          <div className="text-lg font-bold text-[#34D399] capitalize">{settings.defaultModel} 3.7 / 2.5</div>
          <p className="text-xs text-[#94A3B8] mt-0.5">Comandos prontos para cópia</p>
        </div>
      </div>

      {/* 3. Operational Notice Box matching .mock-rec-box */}
      <div className="sales-rec-box flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <strong>Fluxo Operacional AgroIntel:</strong>
          <span className="text-slate-300 ml-1">
            Selecione uma ferramenta técnica, alimente as variáveis do talhão e copie o comando pronto com validação agronômica para executar no Claude ou Gemini.
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link to="/skills" className="btn-agro-primary text-xs py-2 px-4">
            <span>Iniciar Nova Visita</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 4. Favorites / Quick Access Row */}
      {favoriteSkills.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bookmark className="w-4 h-4 text-amber-400 fill-current" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Ferramentas em Destaque &amp; Favoritas
              </h2>
            </div>
            <Link to="/favorites" className="text-xs text-[#34D399] hover:underline font-semibold flex items-center space-x-1">
              <span>Ver todas ({favorites.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {favoriteSkills.map(skill => (
              <div
                key={skill.id}
                onClick={() => navigate(`/skills/${skill.id}`)}
                className="sales-card p-5 cursor-pointer flex flex-col justify-between hover:border-emerald-500/50 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/15 text-[#34D399] flex items-center justify-center">
                      <IconHelper name={skill.iconName} className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300">
                      ~{skill.estimatedMinutes} min
                    </span>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#34D399] block mb-1">
                    {skill.categoryLabel}
                  </span>

                  <h3 className="text-sm font-bold text-white line-clamp-1">
                    {skill.name}
                  </h3>

                  <p className="text-xs text-[#94A3B8] mt-1.5 line-clamp-2 leading-relaxed">
                    {skill.summary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/8 flex items-center justify-between text-xs text-[#34D399] font-bold">
                  <span>Abrir ferramenta</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Departments Grid */}
      <section className="space-y-3">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Departamentos Operacionais
          </h2>
          <p className="text-xs text-[#94A3B8]">Selecione a área técnica para carregar as rotinas especializadas</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {CATEGORIES.map(category => {
            const count = SKILLS_CATALOG.filter(s => s.category === category.id).length;
            return (
              <Link
                key={category.id}
                to={`/skills?cat=${category.id}`}
                className="sales-card p-5 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 group-hover:bg-emerald-500/25 text-[#34D399] flex items-center justify-center mb-3 transition-colors">
                    <IconHelper name={category.iconName} className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-[#34D399] transition-colors">
                    {category.label}
                  </h3>
                  <p className="text-xs text-[#94A3B8] mt-1 line-clamp-2 leading-relaxed">
                    {category.shortDescription}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/8 flex items-center justify-between text-xs text-[#94A3B8]">
                  <span className="font-mono text-[11px]">{count} ferramenta{count > 1 ? 's' : ''}</span>
                  <span className="text-[#34D399] font-semibold group-hover:translate-x-0.5 transition-transform flex items-center space-x-1">
                    <span>Acessar</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 6. AI Co-pilots Showcase */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <Bot className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Co-pilotos e Agentes Especialistas
              </h2>
            </div>
            <p className="text-xs text-[#94A3B8]">Instruções de sistema calibradas com base em manuais da Embrapa e MAPA</p>
          </div>
          <Link to="/agents" className="text-xs text-[#34D399] hover:underline font-semibold transition-colors flex items-center space-x-1">
            <span>Ver todos os {AGENTS_CATALOG.length} agentes</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {AGENTS_CATALOG.slice(0, 3).map(agent => (
            <div
              key={agent.id}
              onClick={() => navigate(`/agents/${agent.id}`)}
              className="sales-card p-5 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/15 text-[#FBBF24] flex items-center justify-center">
                    <IconHelper name={agent.iconName} className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-[#FBBF24] border border-amber-500/30">
                    {agent.cropOrFocus}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white">
                  {agent.name}
                </h3>
                <p className="text-xs text-[#94A3B8] mt-1 line-clamp-2 leading-relaxed">
                  {agent.summary}
                </p>

                <div className="mt-3.5 space-y-1">
                  {agent.capabilities.slice(0, 2).map((cap, i) => (
                    <div key={i} className="flex items-center space-x-1.5 text-[11px] text-[#CBD5E1]">
                      <CheckCircle2 className="w-3 h-3 text-[#34D399] shrink-0" />
                      <span className="truncate">{cap}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/8 flex items-center justify-between text-xs text-[#FBBF24] font-semibold">
                <span>Instruções &amp; Tarefas Prontas</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Recent History Feed */}
      {history.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-[#34D399]" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Atividade Recente</h2>
            </div>
            <Link to="/history" className="text-xs text-[#94A3B8] hover:text-white font-medium transition-colors">
              Histórico completo ({history.length})
            </Link>
          </div>

          <div className="sales-card divide-y divide-white/8 overflow-hidden">
            {history.slice(0, 3).map(item => (
              <div
                key={item.id}
                className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-white/4 transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white">{item.skillName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-[#94A3B8]">
                      {item.categoryLabel}
                    </span>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-amber-500/15 text-[#FBBF24]">
                      {item.targetModel}
                    </span>
                  </div>
                  <p className="text-xs text-[#CBD5E1] mt-1 truncate max-w-xl">
                    {item.summaryLabel || 'Parâmetros técnicos validados'}
                  </p>
                  <span className="text-[10px] text-[#64748B] font-mono mt-0.5 block">
                    {new Date(item.timestamp).toLocaleString('pt-BR')}
                  </span>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => handleCopyHistoryPrompt(item.generatedPrompt)}
                    className="btn-agro-secondary text-xs py-1.5 px-3"
                  >
                    <span>Copiar Prompt</span>
                  </button>
                  <button
                    onClick={() => navigate(`/skills/${item.skillId}`, { state: { initialValues: item.inputs } })}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors text-xs"
                  >
                    <span>Reabrir</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
