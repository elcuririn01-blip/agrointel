import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  History,
  Search,
  Trash2,
  Copy,
  Check,
  Edit3,
  Download,
  Clock,
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { HistoryEntry } from '../types';
import { LayoutContextType } from '../components/layout/AppLayout';
import { CATEGORIES } from '../data/categories';

export const HistoryView: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useOutletContext<LayoutContextType>();

  const [historyList, setHistoryList] = useState<HistoryEntry[]>(() => storageService.getHistory());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyPrompt = async (id: string, promptText: string) => {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopiedId(id);
      showToast('success', 'Prompt Copiado!', 'Cole no Claude ou Gemini para executar a análise.');
      setTimeout(() => setCopiedId(null), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteItem = (id: string) => {
    storageService.removeHistory(id);
    setHistoryList(prev => prev.filter(item => item.id !== id));
    showToast('info', 'Item Removido', 'O registro foi excluído do histórico local.');
  };

  const handleClearAll = () => {
    if (window.confirm('Tem certeza de que deseja apagar todo o histórico de prompts gerados?')) {
      storageService.clearHistory();
      setHistoryList([]);
      showToast('info', 'Histórico Limpo', 'Todos os registros foram removidos.');
    }
  };

  const handleExportCSV = () => {
    if (historyList.length === 0) return;
    const headers = ['ID', 'Data', 'Ferramenta', 'Categoria', 'Modelo', 'Resumo'];
    const rows = historyList.map(h => [
      h.id,
      new Date(h.timestamp).toLocaleString('pt-BR'),
      `"${h.skillName.replace(/"/g, '""')}"`,
      h.categoryLabel,
      h.targetModel,
      `"${(h.summaryLabel || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `agrointel-historico-${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('success', 'Histórico Exportado', 'Arquivo CSV gerado com sucesso.');
  };

  const filtered = historyList.filter(item => {
    if (filterCategory !== 'all' && item.category !== filterCategory) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchSkill = item.skillName.toLowerCase().includes(q);
      const matchLabel = item.summaryLabel?.toLowerCase().includes(q);
      const matchCategory = item.categoryLabel.toLowerCase().includes(q);
      return matchSkill || matchLabel || matchCategory;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(255,255,255,0.08)]">
        <div>
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-[#34D399]" />
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Histórico de Prompts</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Todos os comandos e parâmetros preenchidos são salvos no armazenamento local do seu navegador.
          </p>
        </div>

        {historyList.length > 0 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportCSV}
              className="btn-agro-secondary py-1.5 px-3 text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar CSV</span>
            </button>
            <button
              onClick={handleClearAll}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-semibold transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar Tudo</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Pesquisar por fazenda, cultura ou ferramenta..."
            className="sales-input w-full pl-10 text-xs sm:text-sm"
          />
        </div>

        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="sales-input text-xs sm:text-sm cursor-pointer"
        >
          <option value="all" className="bg-[#071A12] text-white">Todas as Categorias</option>
          {CATEGORIES.map(c => (
            <option key={c.id} value={c.id} className="bg-[#071A12] text-white">
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* History Items */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center sales-card">
          <History className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">Nenhum registro encontrado</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Ao preencher qualquer formulário no AgroIntel PRO, uma cópia do prompt gerado e seus parâmetros será guardada aqui.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(entry => {
            const isCopied = copiedId === entry.id;
            return (
              <div
                key={entry.id}
                className="sales-card p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-white">{entry.skillName}</span>
                    <span className="badge-agro">
                      {entry.categoryLabel}
                    </span>
                    <span className="badge-agro-gold uppercase font-mono">
                      {entry.targetModel}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-1 truncate">
                    {entry.summaryLabel}
                  </p>

                  <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-1 font-mono">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{new Date(entry.timestamp).toLocaleString('pt-BR')}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0 w-full md:w-auto justify-end">
                  {/* Re-copy button */}
                  <button
                    onClick={() => handleCopyPrompt(entry.id, entry.generatedPrompt)}
                    className={`btn-agro-primary text-xs py-1.5 px-3.5 ${
                      isCopied ? 'from-emerald-400 to-emerald-600' : ''
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white" />
                        <span>Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-white" />
                        <span>Copiar Prompt</span>
                      </>
                    )}
                  </button>

                  {/* Re-edit in form */}
                  <button
                    onClick={() => navigate(`/skills/${entry.skillId}`, { state: { initialValues: entry.inputs } })}
                    className="btn-agro-secondary text-xs py-1.5 px-3"
                    title="Recarregar valores no formulário"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Reabrir</span>
                  </button>

                  {/* Delete entry */}
                  <button
                    onClick={() => handleDeleteItem(entry.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Excluir do histórico"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
