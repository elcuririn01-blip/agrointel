import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  RotateCcw,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';
import { Skill, SkillField } from '../../types';

interface DynamicFormProps {
  skill: Skill;
  initialValues?: Record<string, any>;
  onSubmit: (values: Record<string, any>) => void;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({
  skill,
  initialValues,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const defaults: Record<string, any> = {};
    skill.fields.forEach(field => {
      defaults[field.id] = initialValues?.[field.id] ?? field.defaultValue ?? '';
    });
    return defaults;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasLoadedExample, setHasLoadedExample] = useState(false);

  useEffect(() => {
    if (initialValues) {
      setFormData(prev => ({ ...prev, ...initialValues }));
    }
  }, [initialValues]);

  const handleChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
    }
  };

  const handleLoadExample = () => {
    setFormData(skill.defaultExample);
    setErrors({});
    setHasLoadedExample(true);
    setTimeout(() => setHasLoadedExample(false), 2500);
  };

  const handleReset = () => {
    const cleared: Record<string, any> = {};
    skill.fields.forEach(f => {
      cleared[f.id] = f.defaultValue ?? '';
    });
    setFormData(cleared);
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    skill.fields.forEach(field => {
      if (field.required) {
        const val = formData[field.id];
        if (val === undefined || val === null || val === '') {
          newErrors[field.id] = `${field.label} é obrigatório`;
        }
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstErrorKey = Object.keys(newErrors)[0];
      const element = document.getElementById(`field-${firstErrorKey}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Action Ribbon matching sales-rec-box */}
      <div className="sales-rec-box flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5 text-xs text-slate-200">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-[#34D399] flex items-center justify-center shrink-0">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <strong className="block text-white">Preenchimento de Variáveis Agronômicas</strong>
            <span className="text-[11px] text-[#94A3B8]">
              Insira os dados do talhão ou use o botão ao lado para carregar dados reais de campo.
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            type="button"
            onClick={handleLoadExample}
            className={`btn-agro-gold text-xs py-2 px-3.5 ${hasLoadedExample ? 'bg-emerald-500 text-white' : ''}`}
          >
            {hasLoadedExample ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Exemplo Carregado!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Preencher Exemplo Real</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors text-xs"
            title="Limpar formulário"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Dynamic Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
        {skill.fields.map(field => {
          const colSpan =
            field.gridSpan === 'full'
              ? 'md:col-span-6'
              : field.gridSpan === 'third'
              ? 'md:col-span-2'
              : 'md:col-span-3';

          const hasError = Boolean(errors[field.id]);

          return (
            <div
              key={field.id}
              id={`field-${field.id}`}
              className={`${colSpan} flex flex-col space-y-1.5`}
            >
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#CBD5E1] tracking-wide">
                  {field.label}
                  {field.required && <span className="text-amber-400 ml-1 font-black">*</span>}
                </label>
                {field.unit && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/5 text-[#34D399] border border-white/8">
                    {field.unit}
                  </span>
                )}
              </div>

              {/* Input Renderers matching .sales-input */}
              {field.type === 'textarea' ? (
                <textarea
                  value={formData[field.id] || ''}
                  onChange={e => handleChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  rows={4}
                  className={`sales-input w-full resize-y leading-relaxed ${
                    hasError ? 'border-red-500 focus:border-red-400' : ''
                  }`}
                />
              ) : field.type === 'select' ? (
                <div className="relative">
                  <select
                    value={formData[field.id] || ''}
                    onChange={e => handleChange(field.id, e.target.value)}
                    className={`sales-input w-full appearance-none cursor-pointer pr-10 ${
                      hasError ? 'border-red-500' : ''
                    }`}
                  >
                    <option value="" disabled className="bg-[#081D14] text-slate-400">
                      Selecione uma opção...
                    </option>
                    {field.options?.map(opt => (
                      <option key={opt.value} value={opt.value} className="bg-[#081D14] text-white">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              ) : field.type === 'number' ? (
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    value={formData[field.id] || ''}
                    onChange={e => handleChange(field.id, e.target.value ? Number(e.target.value) : '')}
                    placeholder={field.placeholder}
                    className={`sales-input w-full font-mono ${
                      hasError ? 'border-red-500' : ''
                    }`}
                  />
                  {field.unit && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#94A3B8] pointer-events-none">
                      {field.unit}
                    </div>
                  )}
                </div>
              ) : field.type === 'date' ? (
                <input
                  type="date"
                  value={formData[field.id] || ''}
                  onChange={e => handleChange(field.id, e.target.value)}
                  className={`sales-input w-full ${hasError ? 'border-red-500' : ''}`}
                />
              ) : (
                <input
                  type="text"
                  value={formData[field.id] || ''}
                  onChange={e => handleChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  className={`sales-input w-full ${hasError ? 'border-red-500' : ''}`}
                />
              )}

              {/* Error or Help text */}
              {hasError ? (
                <p className="text-[11px] text-red-400 font-medium flex items-center space-x-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors[field.id]}</span>
                </p>
              ) : field.helperText ? (
                <p className="text-[11px] text-[#94A3B8] mt-1 leading-normal">{field.helperText}</p>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Submit Button & Technical Notice */}
      <div className="pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-xs text-[#94A3B8]">
          <span className="w-2 h-2 rounded-full bg-[#10B981]" />
          <span>Campos com <span className="text-amber-400 font-bold">*</span> são validados para calibração dos cálculos.</span>
        </div>

        <button
          type="submit"
          className="btn-agro-primary w-full sm:w-auto"
        >
          <span>Gerar Prompt Especializado</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};
