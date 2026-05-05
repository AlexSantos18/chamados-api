import React from 'react';
import { FiActivity, FiCheckCircle, FiClock, FiShield } from 'react-icons/fi';

const AuthLayout = ({ eyebrow, title, description, children, compact = false }) => {
  const highlights = [
    { title: 'Fluxo', text: 'Chamados e comentarios em uma rotina mais simples.', icon: <FiActivity /> },
    { title: 'Controle', text: 'Auditoria e historico para acompanhar cada acao.', icon: <FiShield /> },
    { title: 'Visao', text: 'Indicadores para entender o que precisa de atencao.', icon: <FiClock /> }
  ];

  return (
    <div className="auth-mesh flex min-h-screen items-center justify-center px-4 py-6 md:py-10">
      <div className={`grid w-full max-w-6xl gap-6 ${compact ? 'lg:grid-cols-[0.95fr_520px]' : 'lg:grid-cols-[1.1fr_520px]'}`}>
        <section className="slide-up hidden overflow-hidden rounded-2xl border border-white/70 bg-white/55 p-6 md:p-8 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/55 lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-blue-700 dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-200">
              <FiCheckCircle size={12} />
              CHAMADOS
            </div>
            <h1 className="mt-5 max-w-xl text-4xl font-black leading-[1.05] tracking-tight text-slate-900 dark:text-white">
              Atendimento mais claro, rapido e confiavel.
            </h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-slate-600 dark:text-slate-300">
              Organize tickets, clientes e historico de auditoria em um painel unico com foco no que precisa ser resolvido agora.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {highlights.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-white/10 dark:bg-white/5">
                <div className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-200">
                  {item.icon}
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</p>
                <p className="mt-1.5 text-[13px] leading-5 text-slate-600 dark:text-slate-300">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="surface-card slide-up rounded-2xl p-5 md:p-8 lg:p-10 dark:bg-slate-900 dark:border dark:border-white/10">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-400">{eyebrow}</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-white">{title}</h2>
            <p className="mt-2 text-[13px] leading-5 text-slate-500 dark:text-slate-300">
              {description}
            </p>
          </div>

          {children}
        </section>
      </div>
    </div>
  );
};

export default AuthLayout;
