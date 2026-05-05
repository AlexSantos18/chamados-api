import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { buildUploadUrl } from '../services/api';
import { FiBell, FiCheckCircle, FiLogOut, FiMenu, FiMoon, FiSun, FiUser } from 'react-icons/fi';

const pageTitles = {
  '/dashboard': ['Dashboard', 'Visao geral da operacao'],
  '/profile': ['Meu perfil', 'Dados da conta e seguranca'],
  '/clientes': ['Clientes', 'Base de empresas e contatos'],
  '/chamados': ['Consultar chamados', 'Listagem e filtros de atendimento'],
  '/chamados/novo': ['Novo chamado', 'Abertura de atendimento'],
  '/trash': ['Lixeira de notas', 'Auditoria e restauracao'],
  '/trash/tickets': ['Lixeira de chamados', 'Chamados removidos']
};

const Header = () => {
  const {
    user,
    logout,
    notifications,
    unreadCount,
    markNotificationsAsRead,
    clearNotifications,
    darkMode,
    toggleDarkMode,
    isSidebarOpen,
    setIsSidebarOpen
  } = useAuth();
  const [showNotif, setShowNotif] = useState(false);
  const location = useLocation();

  const routeTitle = pageTitles[location.pathname] || (
    location.pathname.startsWith('/chamados/') ? ['Detalhes do chamado', 'Historico e notas internas'] : ['Central de chamados', 'Espaco de trabalho']
  );

  const handleToggleNotif = () => {
    if (!showNotif && unreadCount > 0) markNotificationsAsRead();
    setShowNotif(!showNotif);
  };

  return (
    <header className="sticky top-0 z-30 px-3 pt-3 md:px-5">
      <div className="surface-card relative flex items-center justify-between gap-3 rounded-2xl px-3 py-3 md:px-5 dark:bg-slate-900 dark:border dark:border-white/10">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            aria-label="Abrir menu"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:border-blue-200 hover:text-blue-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 md:hidden"
          >
            <FiMenu size={20} />
          </button>

          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-400">Espaco de trabalho</p>
            <h1 className="truncate text-base font-black text-slate-900 dark:text-white">{routeTitle[0]}</h1>
            <p className="hidden text-xs text-slate-500 dark:text-slate-300 md:block">{routeTitle[1]}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            type="button"
            aria-label={darkMode ? 'Ativar tema claro' : 'Ativar tema escuro'}
            onClick={toggleDarkMode}
            className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 transition hover:border-blue-200 hover:text-blue-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
          >
            {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>

          <div className="relative">
            <button
              type="button"
              aria-label="Abrir notificacoes"
              onClick={handleToggleNotif}
              className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 transition hover:border-blue-200 hover:text-blue-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
            >
              <FiBell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotif && (
              <div className="surface-card absolute right-0 mt-3 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-3xl shadow-xl dark:bg-slate-900 dark:border dark:border-white/10"> {/* Já estava correto */}
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 dark:border-white/10">
                  <div>
                    <span className="text-sm font-black text-slate-900 dark:text-white">Notificacoes</span>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{notifications.length} registro(s)</p>
                  </div>
                  <button onClick={clearNotifications} className="text-xs font-bold text-blue-700 transition hover:text-blue-900 dark:text-blue-200">
                    Limpar tudo
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-300">
                      <FiCheckCircle className="mx-auto mb-3 text-emerald-500" size={24} />
                      Sem notificacoes no momento.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div key={n._id} className="border-b border-slate-200 px-4 py-4 last:border-b-0 dark:border-white/10">
                        <p className="text-sm leading-6 text-slate-700 dark:text-slate-200">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <Link to="/profile" className="hidden items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-1.5 transition hover:border-blue-200 dark:border-white/10 dark:bg-white/5 md:flex">
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-xs font-bold text-white">
              {user?.avatar ? (
                <img src={buildUploadUrl(user.avatar)} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                user?.name?.charAt(0) || <FiUser />
              )}
            </div>
            <div>
              <p className="max-w-[120px] truncate text-xs font-bold text-slate-900 dark:text-white">{user?.name}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{user?.role}</p>
            </div>
          </Link>

          <button
            type="button"
            onClick={logout}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-500 transition hover:border-rose-200 hover:text-rose-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:text-rose-300"
          >
            <span className="inline-flex items-center gap-2">
              <FiLogOut />
              <span className="hidden md:inline">Sair</span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
