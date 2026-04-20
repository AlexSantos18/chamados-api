import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { FiLayout, FiFileText, FiUsers, FiTrash2, FiArchive, FiPlusSquare, FiX } from 'react-icons/fi';

const Sidebar = () => {
  const { isAdmin, isSidebarOpen, setIsSidebarOpen, user } = useAuth();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <FiLayout />, admin: true },
    { name: 'Novo Chamado', path: '/chamados/novo', icon: <FiPlusSquare />, admin: false },
    { name: 'Consultar Chamados', path: '/chamados', icon: <FiFileText />, admin: false },
    { name: 'Clientes', path: '/clientes', icon: <FiUsers />, admin: false },
    { name: 'Lixeira de Notas', path: '/trash', icon: <FiTrash2 />, admin: true },
    { name: 'Lixeira de Chamados', path: '/trash/tickets', icon: <FiArchive />, admin: true },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Fechar menu"
          className="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-3 left-3 z-50 w-[288px] rounded-[28px] border border-white/60 bg-stone-950 px-4 py-4 text-stone-100
          shadow-[0_24px_60px_rgba(15,23,42,0.28)] transition-transform duration-300 transform
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-[120%]'}
          md:sticky md:top-3 md:h-[calc(100vh-24px)] md:translate-x-0
        `}
      >
        <div className="flex h-full flex-col">
          <div className="mb-6 flex items-center justify-between px-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-stone-400">Painel</p>
              <h2 className="mt-2 text-2xl font-black italic tracking-tight text-amber-100">CHAMADOS.io</h2>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="rounded-full p-2 text-stone-400 transition hover:bg-white/10 hover:text-white md:hidden">
              <FiX size={20} />
            </button>
          </div>

          <div className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.28em] text-stone-400">Sessao</p>
            <p className="mt-3 text-base font-semibold text-stone-50">{user?.name || 'Operador'}</p>
            <p className="text-sm text-stone-400">{isAdmin ? 'Administrador' : 'Usuario padrao'}</p>
          </div>

          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => {
              if (item.admin && !isAdmin) return null;

              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all ${
                    active
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-[0_14px_28px_rgba(234,88,12,0.32)]'
                      : 'text-stone-300 hover:bg-white/8 hover:text-white'
                  }`}
                >
                  <span className={`flex h-10 w-10 items-center justify-center rounded-2xl text-lg transition ${
                    active ? 'bg-white/15 text-white' : 'bg-white/6 text-stone-300 group-hover:bg-white/10'
                  }`}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 rounded-3xl border border-emerald-200/10 bg-gradient-to-br from-emerald-500/18 to-cyan-500/10 p-4">
            <p className="text-xs uppercase tracking-[0.28em] text-emerald-100/80">Resumo</p>
            <p className="mt-3 text-sm leading-6 text-stone-200">
              Centralize chamados, clientes e auditoria em um fluxo mais limpo e rapido.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
