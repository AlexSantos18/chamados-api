import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import {
  FiActivity,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiDownload,
  FiFileText,
  FiList,
  FiRefreshCw,
  FiTrendingUp,
  FiXCircle
} from 'react-icons/fi';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useAuth } from '../AuthContext';

const statusConfig = [
  {
    key: 'total',
    label: 'Total',
    valueKey: 'total',
    icon: <FiList size={20} />,
    tone: 'from-slate-500 to-slate-800',
    accent: 'bg-slate-500'
  },
  {
    key: 'abertos',
    label: 'Abertos',
    valueKey: 'abertos',
    icon: <FiClock size={20} />,
    tone: 'from-sky-500 to-blue-700',
    accent: 'bg-sky-500'
  },
  {
    key: 'andamento',
    label: 'Em andamento',
    valueKey: 'em_andamento',
    icon: <FiActivity size={20} />,
    tone: 'from-yellow-400 to-yellow-600',
    accent: 'bg-yellow-500'
  },
  {
    key: 'concluidos',
    label: 'Concluidos',
    valueKey: 'concluidos',
    icon: <FiCheckCircle size={20} />,
    tone: 'from-emerald-500 to-green-700',
    accent: 'bg-emerald-500'
  },
  {
    key: 'cancelados',
    label: 'Cancelados',
    valueKey: 'cancelados',
    icon: <FiXCircle size={20} />,
    tone: 'from-rose-500 to-red-700',
    accent: 'bg-rose-500'
  }
];

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [range, setRange] = useState(7);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);

      try {
        const response = await api.get('/dashboard', { params: { days: range } });
        setStats(response.data);
      } catch (err) {
        toast.error('Erro ao carregar estatisticas do dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [range]);

  const computed = useMemo(() => {
    const total = stats?.total || 0;
    const closed = stats?.concluidos || 0;
    const active = (stats?.abertos || 0) + (stats?.em_andamento || 0);
    const cancelled = stats?.cancelados || 0;
    const chartData = stats?.chartData || [];
    const busiestDay = chartData.reduce(
      (current, item) => (item.chamados > current.chamados ? item : current),
      { name: '-', chamados: 0 }
    );

    return {
      total,
      active,
      closed,
      cancelled,
      completionRate: total ? Math.round((closed / total) * 100) : 0,
      cancellationRate: total ? Math.round((cancelled / total) * 100) : 0,
      avgPerDay: range ? (total / range).toFixed(1) : '0.0',
      busiestDay,
      chartData
    };
  }, [stats, range]);

  const pieData = [
    { name: 'Abertos', value: stats?.abertos || 0, color: '#38bdf8' },
    { name: 'Em andamento', value: stats?.em_andamento || 0, color: '#dae546' },
    { name: 'Concluidos', value: stats?.concluidos || 0, color: '#22c55e' },
    { name: 'Cancelados', value: stats?.cancelados || 0, color: '#f43f5e' }
  ].filter((d) => d.value > 0);

  const handleExportPDF = async () => {
    const input = document.getElementById('dashboard-content');
    if (!input) {
      toast.error('Conteudo do dashboard nao encontrado para exportacao.');
      return;
    }

    setExporting(true);
    try {
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        windowWidth: input.scrollWidth,
        windowHeight: input.scrollHeight
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('dashboard_chamados.pdf');
      toast.success('Dashboard exportado para PDF com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error('Erro ao exportar dashboard para PDF.');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="px-1 py-4 md:py-5">
        <div className="mx-auto max-w-7xl animate-pulse space-y-6">
          <div className="surface-card h-44 rounded-2xl dark:bg-slate-900 dark:border dark:border-white/10" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="surface-card h-32 rounded-2xl dark:bg-slate-900 dark:border dark:border-white/10" />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.5fr_0.9fr]">
            <div className="surface-card h-80 rounded-2xl" />
            <div className="surface-card h-80 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-1 py-4 md:py-5">
      <div id="dashboard-content" className="mx-auto max-w-7xl space-y-6">
        <section className="surface-card slide-up overflow-hidden rounded-2xl dark:bg-slate-900 dark:border dark:border-white/10">
          <div className="grid gap-4 p-5 md:p-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg">
                <FiTrendingUp size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400 dark:text-slate-400">
                  Visao operacional
                </p>
                <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-white md:text-3xl">
                  Dashboard de chamados
                </h1>
                <p className="mt-2 max-w-2xl text-[13px] leading-5 text-slate-500 dark:text-slate-300">
                  {isAdmin ? 'Acompanhamento completo da operacao.' : 'Acompanhamento dos seus chamados.'}
                  {' '}Ola, {user?.name || 'operador'}.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-white/5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Resolucao</p>
                <p className="mt-1 text-xl font-black text-slate-900 dark:text-white">{computed.completionRate}%</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-white/5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Ativos</p>
                <p className="mt-1 text-xl font-black text-slate-900 dark:text-white">{computed.active}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-white/5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Media/dia</p>
                <p className="mt-1 text-xl font-black text-slate-900 dark:text-white">{computed.avgPerDay}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          {statusConfig.map((card) => {
            const value = stats?.[card.valueKey] || 0; // Adicionado dark mode para o artigo do card
            const percent = computed.total ? Math.round((value / computed.total) * 100) : 0;

            return (
              <article key={card.key} className="surface-card rounded-2xl p-4 transition-transform hover:-translate-y-1">
                <div className="flex items-start justify-between gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${card.tone} text-white shadow-lg`}>
                    {card.icon}
                  </div>
                  <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                    {card.key === 'total' ? `${range} dias` : `${percent}%`}
                  </span>
                </div>
                <div className="mt-4">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-300">{card.label}</p>
                  <p className="mt-1 text-3xl font-black tracking-tight text-slate-900 dark:text-white">{value}</p>
                </div>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                  <div
                    className={`h-full rounded-full ${card.accent}`}
                    style={{ width: card.key === 'total' ? '100%' : `${percent}%` }}
                  />
                </div>
              </article>
            );
          })}
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_0.9fr]">
          <div className="surface-card rounded-3xl p-5 md:p-7 dark:bg-slate-900 dark:border dark:border-white/10">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-black text-slate-900 dark:text-white">
                  <FiActivity className="text-blue-600" /> Evolucao recente
                </h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
                  Chamados criados no periodo selecionado.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex rounded-2xl border border-slate-200 bg-slate-100 p-1 dark:border-white/10 dark:bg-white/5">
                  {[7, 30].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setRange(days)}
                      className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                        range === days
                          ? 'bg-white text-blue-700 shadow-sm dark:bg-white/15 dark:text-blue-200'
                          : 'text-slate-500 dark:text-slate-300'
                      }`}
                    >
                      {days} dias
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleExportPDF}
                  disabled={exporting}
                  className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {exporting ? <FiRefreshCw className="animate-spin" /> : <FiDownload />}
                  {exporting ? 'Gerando' : 'PDF'}
                </button>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={computed.chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                  <YAxis hide />
                  <Tooltip
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={{ borderRadius: '16px', border: '1px solid #cbd5e1', boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)' }}
                  />
                  <Bar dataKey="chamados" fill="#3b82f6" radius={[10, 10, 0, 0]} barSize={38} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-6">
            <div className="surface-card rounded-3xl p-5 md:p-7 dark:bg-slate-900 dark:border dark:border-white/10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">Distribuicao</h2>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">Status atual dos chamados.</p>
                </div>
                <FiFileText className="text-blue-600" size={22} />
              </div>

              <div className="mt-6 h-56 w-full">
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} innerRadius={58} outerRadius={82} paddingAngle={5} dataKey="value">
                        {pieData.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-300 text-sm text-slate-500 dark:border-white/10 dark:text-slate-300">
                    Sem dados no periodo.
                  </div>
                )}
              </div>

              <div className="mt-5 space-y-3">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 dark:bg-white/5">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{item.name}</span>
                    </div>
                    <span className="text-sm font-black text-slate-900 dark:text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-slate-950 p-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.22)]">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-200">
                  <FiAlertCircle size={22} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-200/75">Leitura rapida</p>
                  <h3 className="mt-3 text-2xl font-black tracking-tight">
                    Pico em {computed.busiestDay.name}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-blue-100">
                    {computed.busiestDay.chamados} chamados no dia de maior movimento. Taxa de cancelamento atual: {computed.cancellationRate}%.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
