import React, { useState } from 'react';
import { useParams, useNavigate, useLocation, useOutletContext, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  UserCheck,
  ShieldCheck,
  Bookmark,
} from 'lucide-react';
import { SKILLS_CATALOG } from '../data/skillsCatalog';
import { DynamicForm } from '../components/form/DynamicForm';
import { PromptModal } from '../components/prompt/PromptModal';
import { LayoutContextType } from '../components/layout/AppLayout';
import { storageService } from '../services/storageService';
import { promptEngine } from '../services/promptEngine';
import { IconHelper } from '../components/ui/IconHelper';

export const SkillExecutionView: React.FC = () => {
  const { skillId } = useParams<{ skillId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { settings, favorites, toggleFavorite, showToast } = useOutletContext<LayoutContextType>();

  const skill = SKILLS_CATALOG.find(s => s.id === skillId || s.slug === skillId);
  const initialValues = location.state?.initialValues;

  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [currentInputs, setCurrentInputs] = useState<Record<string, any>>({});

  if (!skill) {
    return (
      <div className="p-12 text-center sales-card max-w-xl mx-auto">
        <h2 className="text-xl font-bold text-white">Ferramenta não encontrada</h2>
        <p className="text-xs text-[#94A3B8] mt-2">A ferramenta solicitada não existe ou foi movida.</p>
        <Link
          to="/skills"
          className="mt-4 inline-block btn-agro-primary text-xs"
        >
          Voltar ao Catálogo de Skills
        </Link>
      </div>
    );
  }

  const isFav = favorites.includes(skill.id);

  const handleFormSubmit = (values: Record<string, any>) => {
    setCurrentInputs(values);

    const promptText = promptEngine.buildPrompt({
      skill,
      inputs: values,
      settings,
      targetModel: settings.defaultModel || 'claude',
    });

    const summaryLabel = values.propriedade
      ? `${values.propriedade} • ${values.cultura || 'Cultura'}`
      : `${skill.name} • Parâmetros de campo`;

    storageService.addHistory({
      skillId: skill.id,
      skillName: skill.name,
      category: skill.category,
      categoryLabel: skill.categoryLabel,
      inputs: values,
      generatedPrompt: promptText,
      targetModel: settings.defaultModel || 'claude',
      summaryLabel,
    });

    setIsPromptModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Top Breadcrumb & Return Action */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-1.5 text-xs text-[#94A3B8] hover:text-white font-semibold transition-colors py-1 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Voltar ao Catálogo</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => toggleFavorite(skill.id)}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isFav
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/8'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 fill-current" />
            <span>{isFav ? 'Salvo nos Favoritos' : 'Favoritar'}</span>
          </button>
        </div>
      </div>

      {/* Header Info Card matching .sales-card */}
      <div className="sales-card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-[#34D399] flex items-center justify-center shrink-0">
              <IconHelper name={skill.iconName} className="w-6 h-6" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge-agro">
                  {skill.categoryLabel}
                </span>
                <span className="text-[11px] text-[#94A3B8] font-mono flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-[#34D399]" />
                  <span>Preenchimento: ~{skill.estimatedMinutes} min</span>
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-2">
                {skill.name}
              </h1>

              <p className="text-xs sm:text-sm text-[#CBD5E1] mt-2 leading-relaxed max-w-3xl">
                {skill.description}
              </p>
            </div>
          </div>
        </div>

        {/* Technical Role Banner */}
        <div className="mt-6 pt-4 border-t border-white/8 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-[#34D399]">
            <UserCheck className="w-4 h-4 shrink-0" />
            <span><strong>Papel Operacional:</strong> {skill.technicalRole}</span>
          </div>

          <div className="flex items-center space-x-1.5 text-[#94A3B8] text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#34D399]" />
            <span>Validação de normas CREA, MAPA & Embrapa</span>
          </div>
        </div>
      </div>

      {/* Form Engine Container */}
      <div className="sales-card p-6 sm:p-8">
        <DynamicForm
          skill={skill}
          initialValues={initialValues}
          onSubmit={handleFormSubmit}
        />
      </div>

      {/* Prompt Execution Modal */}
      <PromptModal
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
        skill={skill}
        inputs={currentInputs}
        settings={settings}
        onCopied={() => {
          showToast('success', 'Prompt Copiado com Sucesso!', 'Cole no Claude ou Gemini e execute a geração.');
        }}
      />
    </div>
  );
};
