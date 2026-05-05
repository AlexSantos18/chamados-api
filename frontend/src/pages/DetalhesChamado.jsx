import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { buildUploadUrl } from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../AuthContext';
import {
  FiActivity,
  FiArrowLeft,
  FiBriefcase,
  FiCalendar,
  FiClock,
  FiFileText,
  FiInfo,
  FiMail,
  FiMessageSquare,
  FiPaperclip,
  FiPhone,
  FiRefreshCw,
  FiSend,
  FiTrash2,
  FiUser
} from 'react-icons/fi';
import DeleteModal from './DeleteModal';
import DetalhesSkeleton from './DetalhesSkeleton';

const statusLabels = {
  aberto: 'Aberto',
  em_andamento: 'Em andamento',
  concluido: 'Concluido',
  cancelado: 'Cancelado'
};

const statusStyles = {
  aberto: 'bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-500/15 dark:text-sky-200 dark:border-sky-400/20',
  em_andamento: 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-200 dark:border-indigo-400/20',
  concluido: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-200 dark:border-emerald-400/20',
  cancelado: 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-200 dark:border-rose-400/20'
};

const DetalhesChamado = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [sendingComment, setSendingComment] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState(null);

  const { user: currentUser } = useAuth();

  const fetchDetalhes = async () => {
    try {
      const response = await api.get(`/chamados/${id}`);
      setData(response.data);
    } catch (err) {
      toast.error('Erro ao carregar detalhes do chamado');
      navigate('/chamados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetalhes();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      await api.put(`/chamados/${id}`, { status: newStatus });
      toast.success('Status atualizado com sucesso!');
      fetchDetalhes();
    } catch (err) {
      toast.error('Erro ao atualizar status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSendingComment(true);
    try {
      await api.post(`/chamados/${id}/comments`, { text: commentText });
      toast.success('Nota interna adicionada');
      setCommentText('');
      fetchDetalhes();
    } catch (err) {
      toast.error('Erro ao adicionar comentario');
    } finally {
      setSendingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    setCommentIdToDelete(commentId);
    setIsDeleteModalOpen(true);
  };

  const confirmCommentDelete = async (reason) => {
    try {
      await api.delete(`/chamados/${id}/comments/${commentIdToDelete}`, { data: { reason } });
      toast.success('Nota removida com sucesso');
      fetchDetalhes();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao remover nota');
    }
  };

  if (loading) return <DetalhesSkeleton />;
  if (!data) return null;

  const { chamado, logs } = data;
  const comments = chamado.comments || [];
  const attachments = chamado.attachments || [];

  return (
    <div className="px-1 py-4 md:py-5">
      <div className="mx-auto max-w-7xl space-y-6">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white/70 px-3 py-2 text-xs font-bold text-stone-600 transition hover:border-blue-200 hover:text-blue-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
          <FiArrowLeft /> Voltar para a lista
        </button>

        <section className="surface-card slide-up overflow-hidden rounded-2xl dark:bg-slate-900 dark:border dark:border-white/10">
          <div className="grid gap-4 p-5 md:p-6 xl:grid-cols-[1.25fr_0.75fr] xl:items-center">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg">
                <FiFileText size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-stone-400 dark:text-slate-400">Detalhes</p>
                <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-white md:text-3xl">{chamado.title}</h1>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase ${statusStyles[chamado.status] || statusStyles.aberto}`}>
                    {statusLabels[chamado.status] || chamado.status}
                  </span>
                  <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold uppercase text-stone-500 dark:bg-white/10 dark:text-slate-300">
                    Prioridade {chamado.priority || 'media'}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-500 dark:bg-white/10 dark:text-slate-300">
                    <FiCalendar size={12} /> {new Date(chamado.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-stone-200/70 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">Notas</p>
                <p className="mt-1 text-xl font-black text-slate-900 dark:text-white">{comments.length}</p>
              </div>
              <div className="rounded-xl border border-stone-200/70 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">Anexos</p>
                <p className="mt-1 text-xl font-black text-slate-900 dark:text-white">{attachments.length}</p>
              </div>
              <div className="rounded-xl border border-stone-200/70 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">Logs</p>
                <p className="mt-1 text-xl font-black text-slate-900 dark:text-white">{logs.length}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.5fr_0.8fr]">
          <div className="space-y-6">
            <section className="surface-card rounded-2xl p-5 md:p-6">
              <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-stone-400 dark:text-slate-400">
                <FiInfo size={14} /> Descricao
              </p>
              <p className="text-[13px] leading-6 text-stone-600 dark:text-slate-300">{chamado.description || 'Nenhuma descricao fornecida.'}</p>
            </section>

            <section className="surface-card rounded-2xl p-5 md:p-6">
              <h2 className="flex items-center gap-2 text-xl font-black tracking-tight text-slate-900 dark:text-white">
                <FiMessageSquare className="text-blue-600" /> Notas internas
              </h2>

              <form onSubmit={handleAddComment} className="mt-5">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Adicione uma nota interna importante sobre este chamado..."
                  className="w-full rounded-xl border border-stone-200 bg-white/70 px-3 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-500/10"
                  rows="3"
                />
                <div className="mt-2 flex justify-end">
                  <button disabled={sendingComment} className="rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
                    <span className="inline-flex items-center gap-2">
                      {sendingComment ? <FiRefreshCw className="animate-spin" size={14} /> : <FiSend size={14} />}
                      {sendingComment ? 'Enviando...' : 'Adicionar nota'}
                    </span>
                  </button>
                </div>
              </form>

              <div className="mt-5 space-y-4">
                {comments.map((comment) => (
                  <div key={comment._id} className="rounded-2xl border border-blue-200 bg-blue-50/70 p-4 dark:border-blue-400/20 dark:bg-blue-500/10">
                    <p className="text-[13px] leading-6 text-slate-700 dark:text-slate-200">{comment.text}</p>
                    <div className="mt-3 flex flex-col gap-2 text-xs font-medium text-blue-800 dark:text-blue-200 md:flex-row md:items-center md:justify-between">
                      <div className="flex flex-wrap items-center gap-3">
                        <span>Por: {comment.user?.name || 'Usuario'}</span>
                        {(currentUser?.role === 'admin' || currentUser?._id === comment.user?._id) && (
                          <button onClick={() => handleDeleteComment(comment._id)} className="inline-flex items-center gap-1 text-rose-600 transition hover:text-rose-700 dark:text-rose-300">
                            <FiTrash2 size={12} /> Excluir
                          </button>
                        )}
                      </div>
                      <span>{new Date(comment.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
                {comments.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-stone-300 bg-white/40 px-6 py-8 text-center text-[13px] text-stone-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                    Nenhuma nota interna adicionada.
                  </div>
                )}
              </div>
            </section>

            <section className="surface-card rounded-2xl p-5 md:p-6">
              <h2 className="flex items-center gap-2 text-xl font-black tracking-tight text-slate-900 dark:text-white dark:bg-slate-900 dark:border dark:border-white/10">
                <FiActivity className="text-blue-600" /> Historico de auditoria
              </h2>
              <div className="mt-6 space-y-4">
                {logs.map((log) => ( // Compactação dos logs
                  <div key={log._id} className="rounded-2xl border border-stone-200/80 bg-white/70 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                    <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{log.action}</span>
                      <span className="inline-flex items-center gap-1 text-[10px] text-stone-400 dark:text-slate-400 uppercase tracking-wider">
                        <FiClock size={10} /> {new Date(log.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="mt-1 inline-flex items-center gap-2 text-xs text-stone-500 dark:text-slate-300">
                      <FiUser size={12} /> Realizado por: {log.user?.name || 'Sistema'}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="surface-card rounded-2xl p-5 dark:bg-slate-900 dark:border dark:border-white/10">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-stone-400">Alterar status</p>
              <select
                value={chamado.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={updatingStatus}
                className="mt-3 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-xs text-slate-800 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100 disabled:opacity-60 dark:border-white/10 dark:bg-slate-800 dark:text-white dark:[color-scheme:dark]"
              >
                <option value="aberto" className="dark:bg-slate-800">Aberto</option>
                <option value="em_andamento" className="dark:bg-slate-800">Em andamento</option>
                <option value="concluido" className="dark:bg-slate-800">Concluido</option>
                <option value="cancelado" className="dark:bg-slate-800">Cancelados</option>
              </select>
              {updatingStatus && (
                <p className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-200">
                  <FiRefreshCw className="animate-spin" size={14} /> Atualizando...
                </p>
              )}
            </section>

            <section className="surface-card rounded-2xl p-5 dark:bg-slate-900 dark:border dark:border-white/10">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-stone-400">Cliente</p>
              <div className="mt-3 space-y-2.5 text-xs text-stone-600 dark:text-slate-300">
                <p className="text-lg font-bold text-slate-900 dark:text-white">{chamado.cliente?.nome || 'Nao informado'}</p>
                <p className="inline-flex items-center gap-2"><FiBriefcase size={14} /> {chamado.cliente?.documento || 'Sem documento'}</p>
                <p className="inline-flex items-center gap-2"><FiMail size={14} /> {chamado.cliente?.email || 'Sem e-mail'}</p>
                <p className="inline-flex items-center gap-2"><FiPhone size={14} /> {chamado.cliente?.telefone || 'Sem telefone'}</p>
              </div>
            </section>

            <section className="surface-card rounded-2xl p-5 dark:bg-slate-900 dark:border dark:border-white/10">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-stone-400">Usuario responsavel</p>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 font-bold text-white text-xs">
                  {chamado.user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{chamado.user?.name || 'Usuario'}</p>
                  <p className="text-xs text-stone-500 dark:text-slate-300">{chamado.user?.email}</p>
                </div>
              </div>
            </section>

            <section className="surface-card rounded-2xl p-5 dark:bg-slate-900 dark:border dark:border-white/10">
              <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-stone-400">
                <FiPaperclip size={14} /> Anexos ({attachments.length})
              </p>
              <div className="flex flex-wrap gap-3">
                {attachments.map((file, idx) => (
                  <a key={idx} href={buildUploadUrl(file)} target="_blank" rel="noreferrer" className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs font-bold text-blue-700 transition hover:border-blue-200 hover:bg-blue-50 dark:border-white/10 dark:bg-white/5 dark:text-blue-200">
                    Arquivo {idx + 1}
                  </a>
                ))}
                {attachments.length === 0 && <span className="text-sm italic text-stone-400">Nenhum anexo enviado.</span>}
              </div>
            </section>
          </aside>
        </div>
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmCommentDelete}
        title="Excluir Nota Interna"
        message="Esta nota sera arquivada na lixeira de auditoria. Por que deseja remove-la?"
      />
    </div>
  );
};

export default DetalhesChamado;
