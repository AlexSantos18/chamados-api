import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { buildUploadUrl } from '../services/api';
import { FiArchive, FiFileText, FiLayout, FiPlusSquare, FiShield, FiTrash2, FiUser, FiUsers, FiX } from 'react-icons/fi';

const Sidebar = () => {
  const { isAdmin, isSidebarOpen, setIsSidebarOpen, user } = useAuth();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <FiLayout />, admin: false },
    { name: 'Novo chamado', path: '/chamados/novo', icon: <FiPlusSquare />, admin: false },
    { name: 'Consultar chamados', path: '/chamados', icon: <FiFileText />, admin: false },
    { name: 'Clientes', path: '/clientes', icon: <FiUsers />, admin: false },
    { name: 'Lixeira de notas', path: '/trash', icon: <FiTrash2 />, admin: true },
    { name: 'Lixeira de chamados', path: '/trash/tickets', icon: <FiArchive />, admin: true }
  ];

  const isActive = (path) => {
    if (path === '/chamados') return location.pathname === '/chamados' || (location.pathname.startsWith('/chamados/') && location.pathname !== '/chamados/novo');
    return location.pathname === path;
  };

  const handleNavigate = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Fechar menu"
          className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-2 left-2 z-50 w-[260px] rounded-2xl border border-white/10 bg-slate-950 px-3 py-3 text-stone-100
          shadow-[0_24px_60px_rgba(15,23,42,0.34)] transition-transform duration-300
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-[120%]'}
          md:sticky md:top-2 md:h-[calc(100vh-16px)] md:translate-x-0
        `}
      >
        <div className="flex h-full flex-col">
          <div className="mb-5 flex items-center justify-between px-2">
            <Link to="/dashboard" onClick={handleNavigate} className="group">
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-stone-400">Painel</p>
              <h2 className="mt-1 text-xl font-black tracking-tight text-blue-100 transition group-hover:text-white">CHAMADOS</h2>
            </Link>
            <button onClick={() => setIsSidebarOpen(false)} className="rounded-2xl p-2 text-stone-400 transition hover:bg-white/10 hover:text-white md:hidden">
              <FiX size={20} />
            </button>
          </div>

          <Link to="/profile" onClick={handleNavigate} className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-3 transition hover:bg-white/10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-sm font-bold text-white">
                {user?.avatar ? (
                  <img src={buildUploadUrl(user.avatar)} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  user?.name?.charAt(0) || <FiUser />
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-stone-50">{user?.name || 'Operador'}</p>
                <p className="mt-1 flex items-center gap-1 text-xs uppercase tracking-[0.18em] text-stone-400">
                  <FiShield size={12} /> {isAdmin ? 'Admin' : 'Usuario'}
                </p>
              </div>
            </div>
          </Link>

          <nav className="flex-1 space-y-2 overflow-y-auto pr-1">
            {menuItems.map((item) => {
              if (item.admin && !isAdmin) return null;

              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={handleNavigate}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-all ${
                    active
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-900/20'
                      : 'text-stone-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className={`flex h-8 w-8 items-center justify-center rounded-xl text-base transition ${
                    active ? 'bg-white/15 text-white' : 'bg-white/5 text-stone-300 group-hover:bg-white/10'
                  }`}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 rounded-2xl border border-emerald-200/10 bg-gradient-to-br from-emerald-500/18 to-cyan-500/10 p-3">
            <p className="text-xs uppercase tracking-[0.28em] text-emerald-100/80">Resumo</p>
            <p className="mt-2 text-[13px] leading-5 text-stone-200">
              Centralize chamados, clientes e auditoria em um fluxo mais limpo e rapido.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
