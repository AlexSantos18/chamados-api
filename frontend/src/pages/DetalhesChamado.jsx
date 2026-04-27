import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { buildUploadUrl } from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../AuthContext';
import { FiArrowLeft, FiClock, FiUser, FiInfo, FiPaperclip, FiActivity, FiMessageSquare, FiSend, FiTrash2, FiBriefcase } from 'react-icons/fi';
import DeleteModal from './DeleteModal';
import DetalhesSkeleton from './DetalhesSkeleton';

const DetalhesChamado = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [sendingComment, setSendingComment] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState(null);

  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchDetalhes();
  }, [id]);

  const fetchDetalhes = async () => {
    try {
      // A API já devolve o chamado com logs de auditoria para montar a visão completa da tela.
      const response = await api.get(`/chamados/${id}`);
      setData(response.data);
    } catch (err) {
      toast.error('Erro ao carregar detalhes do chamado');
      navigate('/chamados');
    } finally {
      setLoading(false);
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
      // O motivo acompanha a exclusão para preservar contexto na lixeira de auditoria.
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

  return (
    <div className="px-1 py-4 md:py-5">
      <div className="mx-auto max-w-7xl">
        <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-2 rounded-2xl border border-stone-200 bg-white/70 px-4 py-3 text-sm font-semibold text-stone-600 transition hover:border-orange-200 hover:text-orange-700">
          <FiArrowLeft /> Voltar para a lista
        </button>

        <div className="grid gap-6 xl:grid-cols-[1.5fr_0.8fr]">
          <div className="space-y-6">
            <section className="surface-card slide-up rounded-[34px] p-6 md:p-8">
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.35em] text-stone-400">Detalhes</p>
                  <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-800 md:text-4xl">{chamado.title}</h1>
                </div>
                <span className="rounded-full border border-sky-200 bg-sky-100 px-4 py-2 text-xs font-bold uppercase text-sky-700">
                  {chamado.status.replace('_', ' ')}
                </span>
              </div>

              <div className="mt-6 space-y-5">
                <div className="rounded-[28px] border border-stone-200/80 bg-white/70 p-5">
                  <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-stone-400">
                    <FiInfo size={14} /> Descricao
                  </p>
                  <p className="text-sm leading-7 text-stone-600">{chamado.description || 'Nenhuma descricao fornecida.'}</p>
                </div>

                <div className="rounded-[28px] border border-stone-200/80 bg-white/70 p-5">
                  <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-stone-400">
                    <FiPaperclip size={14} /> Anexos ({chamado.attachments.length})
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {chamado.attachments.map((file, idx) => (
                      <a key={idx} href={buildUploadUrl(file)} target="_blank" rel="noreferrer" className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-semibold text-orange-700 transition hover:border-orange-200 hover:bg-orange-50">
                        Arquivo {idx + 1}
                      </a>
                    ))}
                    {chamado.attachments.length === 0 && <span className="text-sm italic text-stone-400">Nenhum anexo enviado.</span>}
                  </div>
                </div>
              </div>
            </section>

            <section className="surface-card rounded-[34px] p-6 md:p-8">
              <h2 className="flex items-center gap-2 text-2xl font-black tracking-tight text-slate-800">
                <FiMessageSquare className="text-orange-600" /> Notas internas
              </h2>

              <form onSubmit={handleAddComment} className="mt-6">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Adicione uma nota interna importante sobre este chamado..."
                  className="w-full rounded-[28px] border border-stone-200 bg-white/70 px-4 py-4 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                  rows="4"
                />
                <div className="mt-3 flex justify-end">
                  <button disabled={sendingComment} className="brand-button rounded-2xl px-5 py-3 font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60">
                    <span className="inline-flex items-center gap-2">
                      <FiSend /> {sendingComment ? 'Enviando...' : 'Adicionar nota'}
                    </span>
                  </button>
                </div>
              </form>

              <div className="mt-6 space-y-4">
                {chamado.comments?.map((comment) => (
                  <div key={comment._id} className="rounded-[28px] border border-amber-200 bg-amber-50/70 p-5">
                    <p className="text-sm leading-7 text-slate-700">{comment.text}</p>
                    <div className="mt-3 flex flex-col gap-2 text-xs font-medium text-amber-800 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-3">
                        <span>Por: {comment.user?.name}</span>
                        {(currentUser.role === 'admin' || currentUser._id === comment.user?._id) && (
                          <button onClick={() => handleDeleteComment(comment._id)} className="inline-flex items-center gap-1 text-rose-600 transition hover:text-rose-700">
                            <FiTrash2 size={12} /> Excluir
                          </button>
                        )}
                      </div>
                      <span>{new Date(comment.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
                {chamado.comments?.length === 0 && <p className="text-sm text-stone-500">Nenhuma nota interna adicionada.</p>}
              </div>
            </section>

            <section className="surface-card rounded-[34px] p-6 md:p-8">
              <h2 className="flex items-center gap-2 text-2xl font-black tracking-tight text-slate-800">
                <FiActivity className="text-orange-600" /> Historico de auditoria
              </h2>
              <div className="mt-6 space-y-5">
                {logs.map((log) => (
                  <div key={log._id} className="relative rounded-[28px] border border-stone-200/80 bg-white/70 px-5 py-4">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <span className="font-bold text-slate-800">{log.action}</span>
                      <span className="inline-flex items-center gap-1 text-xs text-stone-400">
                        <FiClock /> {new Date(log.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="mt-2 inline-flex items-center gap-2 text-sm text-stone-500">
                      <FiUser size={14} /> Realizado por: {log.user?.name}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="surface-card rounded-[34px] p-6">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-stone-400">Cliente</p>
              <div className="mt-4 space-y-3 text-sm text-stone-600">
                <p className="text-xl font-bold text-slate-800">{chamado.cliente?.nome}</p>
                <p className="inline-flex items-center gap-2"><FiBriefcase size={14} /> {chamado.cliente?.documento}</p>
                <p>{chamado.cliente?.email}</p>
                <p>{chamado.cliente?.telefone}</p>
              </div>
            </section>

            <section className="surface-card rounded-[34px] p-6">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-stone-400">Usuario responsavel</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white font-bold">
                  {chamado.user?.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-800">{chamado.user?.name}</p>
                  <p className="text-sm text-stone-500">{chamado.user?.email}</p>
                </div>
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
