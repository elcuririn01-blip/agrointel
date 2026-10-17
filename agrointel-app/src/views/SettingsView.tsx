import React, { useState, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Settings,
  UserCheck,
  Cpu,
  ShieldCheck,
  Download,
  Upload,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { LayoutContextType } from '../components/layout/AppLayout';
import { storageService } from '../services/storageService';
import { UserSettings } from '../types';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, showToast } = useOutletContext<LayoutContextType>();

  const [formSettings, setFormSettings] = useState<UserSettings>(settings);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formSettings);
  };

  const handleExportBackup = () => {
    const dataStr = storageService.exportData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `agrointel-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('success', 'Backup Exportado', 'Seus dados foram salvos em arquivo JSON.');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (storageService.importData(content)) {
        setFormSettings(storageService.getSettings());
        updateSettings(storageService.getSettings());
        showToast('success', 'Backup Restaurado', 'Configurações e histórico foram recuperados.');
      } else {
        showToast('error', 'Falha na Importação', 'Arquivo de backup inválido ou corrompido.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      <div className="pb-4 border-b border-[rgba(255,255,255,0.08)]">
        <div className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-[#34D399]" />
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Configurações do Sistema</h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Personalize sua identificação agronômica técnica e preferências de formatação de comandos.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Agronomist Identity Card */}
        <div className="sales-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-[rgba(255,255,255,0.06)]">
            <UserCheck className="w-5 h-5 text-[#34D399]" />
            <h2 className="text-base font-bold text-white">Identificação Agronômica e CREA</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Nome do Responsável Técnico
              </label>
              <input
                type="text"
                value={formSettings.agronomistName}
                onChange={e => setFormSettings({ ...formSettings, agronomistName: e.target.value })}
                className="sales-input w-full"
                placeholder="Ex: Eng. Agrônomo Roberto Silva"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Registro Profissional (CREA / CFT)
              </label>
              <input
                type="text"
                value={formSettings.creaNumber}
                onChange={e => setFormSettings({ ...formSettings, creaNumber: e.target.value })}
                className="sales-input w-full"
                placeholder="Ex: CREA-SP 506987123"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Nome da Empresa / Consultoria
              </label>
              <input
                type="text"
                value={formSettings.companyName}
                onChange={e => setFormSettings({ ...formSettings, companyName: e.target.value })}
                className="sales-input w-full"
                placeholder="Ex: AgroConsulting Manejo & Solos"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Região Agrícola Predominante
              </label>
              <input
                type="text"
                value={formSettings.defaultRegion}
                onChange={e => setFormSettings({ ...formSettings, defaultRegion: e.target.value })}
                className="sales-input w-full"
                placeholder="Ex: Cerrado Centro-Oeste (Goiás / MT)"
              />
            </div>
          </div>
        </div>

        {/* AI Model Preferences Card */}
        <div className="sales-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-[rgba(255,255,255,0.06)]">
            <Cpu className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">Modelo de Inteligência Artificial Padrão</h2>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              Selecione o motor de IA que você mais utiliza externamente:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'claude', name: 'Claude 3.7 / 3.5 Sonnet', desc: 'Raciocínio longo, formatação XML e rigor técnico' },
                { id: 'gemini', name: 'Gemini 2.5 Pro', desc: 'Análise de dados densa e tabelas limpas' },
                { id: 'chatgpt', name: 'ChatGPT / GPT-4o', desc: 'Estruturação padrão e síntese executiva' },
              ].map(item => (
                <div
                  key={item.id}
                  onClick={() => setFormSettings({ ...formSettings, defaultModel: item.id as any })}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    formSettings.defaultModel === item.id
                      ? 'bg-[rgba(16,185,129,0.15)] border-[#10B981] text-white shadow-xs'
                      : 'bg-[#081D14] border-[rgba(255,255,255,0.08)] text-slate-300 hover:border-[rgba(255,255,255,0.2)]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm">{item.name}</span>
                    {formSettings.defaultModel === item.id && (
                      <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formSettings.includeDisclaimer}
                onChange={e => setFormSettings({ ...formSettings, includeDisclaimer: e.target.checked })}
                className="w-4 h-4 rounded border-[rgba(255,255,255,0.2)] text-[#10B981] focus:ring-[#10B981] bg-[#081D14]"
              />
              <span className="text-xs text-slate-300 font-medium">
                Incluir declaração de responsabilidade técnica e ART perante o CREA em todos os prompts gerados
              </span>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="btn-agro-primary py-2.5 px-6 text-sm"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Alterações</span>
          </button>
        </div>
      </form>

      {/* Backup and Local Storage Management */}
      <div className="sales-card p-6 sm:p-8 space-y-4">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-[rgba(255,255,255,0.06)]">
          <ShieldCheck className="w-5 h-5 text-[#34D399]" />
          <h2 className="text-base font-bold text-white">Privacidade e Armazenamento Local</h2>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          O AgroIntel PRO opera em modo privado: nenhum dado do produtor ou da fazenda é enviado para servidores proprietários terceiros.
          Todos os dados permanecem armazenados unicamente no seu dispositivo.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleExportBackup}
            className="btn-agro-secondary text-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Fazer Backup em JSON</span>
          </button>

          <label className="btn-agro-secondary text-xs cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>Restaurar Backup</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
