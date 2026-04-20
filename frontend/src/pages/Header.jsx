import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import api from '../services/api';
import { FiBell, FiLogOut, FiSun, FiMoon, FiMenu } from 'react-icons/fi';

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

  const handleToggleNotif = () => {
    if (!showNotif && unreadCount > 0) markNotificationsAsRead();
    setShowNotif(!showNotif);
  };

  return (
    <header className="sticky top-0 z-30 px-3 pt-3 md:px-5">
      <div className="surface-card slide-up relative flex items-center justify-between gap-3 rounded-[28px] px-4 py-4 md:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="rounded-2xl border border-stone-200/80 bg-white/70 p-3 text-stone-600 transition hover:border-orange-200 hover:text-orange-700 md:hidden"
          >
            <FiMenu size={20} />
          </button>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-stone-400">Workspace</p>
            <h1 className="mt-1 text-lg font-bold text-slate-800">Central de chamados</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={toggleDarkMode}
            className="rounded-2xl border border-stone-200/80 bg-white/70 p-3 text-stone-500 transition hover:border-orange-200 hover:text-orange-700"
          >
            {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>

          <div className="relative">
            <button
              onClick={handleToggleNotif}
              className="relative rounded-2xl border border-stone-200/80 bg-white/70 p-3 text-stone-500 transition hover:border-orange-200 hover:text-orange-700"
            >
              <FiBell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-orange-600 px-1 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotif && (
              <div className="surface-card absolute right-0 mt-3 w-80 overflow-hidden rounded-3xl">
                <div className="flex items-center justify-between border-b border-stone-200/70 px-4 py-4">
                  <span className="text-sm font-bold text-slate-800">Notificacoes</span>
                  <button onClick={clearNotifications} className="text-xs font-semibold text-orange-700 transition hover:text-orange-900">
                    Limpar tudo
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-6 text-sm text-stone-500">Sem notificacoes no momento.</div>
                  ) : (
                    notifications.map((n) => (
                      <div key={n._id} className="border-b border-stone-200/60 px-4 py-4 last:border-b-0">
                        <p className="text-sm leading-6 text-slate-700">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="hidden items-center gap-3 rounded-2xl border border-stone-200/80 bg-white/70 px-3 py-2 md:flex">
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-sm font-bold text-white">
              {user?.avatar ? (
                <img
                  src={`${api.defaults.baseURL}/uploads/${user.avatar}`}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                user?.name?.charAt(0)
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">{user?.name}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-stone-400">{user?.role}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="rounded-2xl border border-stone-200/80 bg-white/70 px-4 py-3 text-sm font-semibold text-stone-500 transition hover:border-rose-200 hover:text-rose-600"
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
