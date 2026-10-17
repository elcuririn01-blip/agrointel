import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Search,
  Trash2,
  Edit3,
  Copy,
  Check,
  Share2,
  Calendar,
  MapPin,
  Tag,
  X,
  Save,
  Download,
  AlertCircle,
  FileCode,
} from 'lucide-react';
import { useOutletContext, Link } from 'react-router-dom';
import { LayoutContextType } from '../components/layout/AppLayout';
import { storageService } from '../services/storageService';
import { NoteEntry } from '../types';

export const NotesView: React.FC = () => {
  const { showToast } = useOutletContext<LayoutContextType>();
  const [notes, setNotes] = useState<NoteEntry[]>(() => storageService.getNotes());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFarm, setFilterFarm] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal create/edit note state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteEntry | null>(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteFarm, setNoteFarm] = useState('');
  const [noteCulture, setNoteCulture] = useState('');
  const [noteTags, setNoteTags] = useState('');

  const reloadNotes = () => {
    setNotes(storageService.getNotes());
  };

  const openCreateModal = () => {
    setEditingNote(null);
    setNoteTitle('');
    setNoteContent('');
    setNoteFarm('');
    setNoteCulture('');
    setNoteTags('');
    setIsModalOpen(true);
  };

  const openEditModal = (note: NoteEntry) => {
    setEditingNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setNoteFarm(note.farmOrClient || '');
    setNoteCulture(note.culture || '');
    setNoteTags(note.tags ? note.tags.join(', ') : '');
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteContent.trim()) {
      showToast('error', 'Campos obrigatórios', 'Preencha o título e o conteúdo da anotação.');
      return;
    }

    const tagsArray = noteTags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    storageService.saveNote({
      id: editingNote?.id,
      title: noteTitle.trim(),
      content: noteContent.trim(),
      farmOrClient: noteFarm.trim() || undefined,
      culture: noteCulture.trim() || undefined,
      tags: tagsArray.length > 0 ? tagsArray : undefined,
      sourceSkillId: editingNote?.sourceSkillId,
      sourceSkillName: editingNote?.sourceSkillName,
    });

    setIsModalOpen(false);
    reloadNotes();
    showToast(
      'success',
      editingNote ? 'Anotação atualizada' : 'Anotação salva',
      'Salva na memória do seu celular/computador com sucesso.'
    );
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Tem certeza que deseja excluir a anotação "${title}"?`)) {
      storageService.deleteNote(id);
      reloadNotes();
      showToast('info', 'Anotação removida', 'O registro foi excluído do seu dispositivo.');
    }
  };

  const handleCopy = async (id: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      showToast('success', 'Conteúdo copiado', 'Pronto para colar no WhatsApp, e-mail ou IA.');
      setTimeout(() => setCopiedId(null), 2500);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const handleShareWhatsApp = (note: NoteEntry) => {
    const text = `*${note.title}*${note.farmOrClient ? `\nPropriedade: ${note.farmOrClient}` : ''}\n\n${note.content}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Distinct farms/clients for filter
  const farms = Array.from(new Set(notes.map(n => n.farmOrClient).filter(Boolean))) as string[];

  // Filtered notes
  const filteredNotes = notes.filter(n => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.farmOrClient && n.farmOrClient.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (n.culture && n.culture.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFarm = filterFarm === 'all' || n.farmOrClient === filterFarm;

    return matchesSearch && matchesFarm;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="sales-card p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 font-mono uppercase tracking-wider mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Memória Offline Persistente</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Minhas Anotações de Campo
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Suas notas técnicas, laudos gerados e observações de visitas ficam salvos{' '}
              <strong className="text-white">diretamente no seu celular</strong>, prontos para consultar mesmo sem internet no talhão.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={openCreateModal}
              className="btn-agro-primary py-2.5 px-4 text-xs sm:text-sm flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Anotação</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-6 pt-4 border-t border-white/8 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block">Total de Anotações</span>
            <strong className="text-white text-base font-mono">{notes.length} salvas</strong>
          </div>
          <div>
            <span className="text-slate-400 block">Propriedades Mapeadas</span>
            <strong className="text-white text-base font-mono">{farms.length} fazendas</strong>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="text-slate-400 block">Armazenamento</span>
            <strong className="text-emerald-400 text-base font-mono">100% no seu dispositivo</strong>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar por título, conteúdo, fazenda ou cultura..."
            className="w-full bg-[#081710] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-mono"
          />
        </div>

        {farms.length > 0 && (
          <select
            value={filterFarm}
            onChange={e => setFilterFarm(e.target.value)}
            className="bg-[#081710] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono shrink-0"
          >
            <option value="all">Todas as Propriedades ({notes.length})</option>
            {farms.map(f => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="sales-card p-12 text-center max-w-md mx-auto">
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Nenhuma anotação encontrada</h3>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            {searchQuery
              ? 'Tente mudar os termos da busca.'
              : 'Você ainda não criou nenhuma anotação. Use o botão acima ou gere qualquer relatório em uma Skill e clique em "Salvar nas Anotações".'}
          </p>
          <button
            onClick={openCreateModal}
            className="mt-4 btn-agro-gold py-2 px-4 text-xs inline-flex items-center space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Criar Primeira Anotação</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNotes.map(note => {
            const isCopied = copiedId === note.id;
            const dateStr = new Date(note.updatedAt || note.createdAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={note.id}
                className="sales-card p-5 flex flex-col justify-between hover:border-emerald-500/40 transition-all group"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-300 transition-colors truncate">
                        {note.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-400 font-mono">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3 text-emerald-400" />
                          <span>{dateStr}</span>
                        </span>
                        {note.farmOrClient && (
                          <span className="flex items-center space-x-1 text-amber-400">
                            <MapPin className="w-3 h-3" />
                            <span>{note.farmOrClient}</span>
                          </span>
                        )}
                        {note.culture && (
                          <span className="px-1.5 py-0.2 rounded bg-white/5 border border-white/10 text-slate-300">
                            {note.culture}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        onClick={() => openEditModal(note)}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                        title="Editar anotação"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(note.id, note.title)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-white/10 transition-colors"
                        title="Excluir anotação"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Card Preview */}
                  <div className="my-3 p-3 rounded-lg bg-black/40 border border-white/5 font-mono text-xs text-slate-300 max-h-36 overflow-y-auto whitespace-pre-wrap leading-relaxed select-text">
                    {note.content}
                  </div>

                  {/* Tags */}
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {note.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center space-x-1 text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        >
                          <Tag className="w-2.5 h-2.5" />
                          <span>{t}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-white/8 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400 font-mono">
                    {note.sourceSkillName ? `Origem: ${note.sourceSkillName}` : 'Nota de Campo'}
                  </span>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => handleShareWhatsApp(note)}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                      title="Enviar via WhatsApp"
                    >
                      <Share2 className="w-3 h-3" />
                      <span>WhatsApp</span>
                    </button>

                    <button
                      onClick={() => handleCopy(note.id, note.content)}
                      className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Criar / Editar Anotação */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#071A12] border border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="px-5 py-4 bg-[#081710] border-b border-white/8 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    {editingNote ? 'Editar Anotação de Campo' : 'Nova Anotação de Campo'}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Salva automaticamente na memória do seu celular/computador
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveModal} className="p-5 overflow-y-auto space-y-4 flex-1">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Título da Anotação *
                </label>
                <input
                  type="text"
                  value={noteTitle}
                  onChange={e => setNoteTitle(e.target.value)}
                  placeholder="Ex: Laudo Fitossanitário - Talhão 3 Fazenda Esperança"
                  className="w-full bg-[#081710] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Fazenda / Produtor / Talhão
                  </label>
                  <input
                    type="text"
                    value={noteFarm}
                    onChange={e => setNoteFarm(e.target.value)}
                    placeholder="Ex: Fazenda Santa Maria - Talhão 12"
                    className="w-full bg-[#081710] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Cultura Agrícola
                  </label>
                  <input
                    type="text"
                    value={noteCulture}
                    onChange={e => setNoteCulture(e.target.value)}
                    placeholder="Ex: Soja, Milho Safrinha, Café, Cana..."
                    className="w-full bg-[#081710] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Conteúdo / Observações Técnicas / Relatório *
                </label>
                <textarea
                  value={noteContent}
                  onChange={e => setNoteContent(e.target.value)}
                  placeholder="Escreva aqui suas observações de campo, recomendações de dosagem, anotações de pragas ou cole o laudo gerado pela IA..."
                  rows={8}
                  className="w-full bg-[#040D09] border border-white/10 rounded-xl p-3 text-xs text-emerald-300 placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-mono leading-relaxed"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Tags (separadas por vírgula)
                </label>
                <input
                  type="text"
                  value={noteTags}
                  onChange={e => setNoteTags(e.target.value)}
                  placeholder="Ex: Lagarta, Dano Econômico, Pulverização, Urgente"
                  className="w-full bg-[#081710] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-white/8 flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-[11px] text-emerald-400 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Salvo localmente no dispositivo</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-3 py-1.5 rounded-xl border border-white/10 text-xs font-semibold text-slate-300 hover:bg-white/5 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn-agro-primary py-2 px-4 text-xs font-bold flex items-center space-x-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Salvar no Celular</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
