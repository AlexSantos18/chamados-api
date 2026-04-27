import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FiLayout, FiList, FiClock, FiActivity, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState(7);

  useEffect(() => {
    // O range alimenta tanto os cards agregados quanto a série temporal do gráfico.
    const fetchStats = async () => {
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

  if (loading) {
    return (
      <div className="px-1 py-4 md:py-5">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="surface-card h-40 rounded-[30px]" />
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="surface-card h-36 rounded-[28px]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const cards = [
    { title: 'Total', value: stats?.total, icon: <FiList size={22} />, tint: 'from-slate-500 to-slate-700' },
    { title: 'Abertos', value: stats?.abertos, icon: <FiClock size={22} />, tint: 'from-sky-500 to-blue-700' },
    { title: 'Em Andamento', value: stats?.em_andamento, icon: <FiActivity size={22} />, tint: 'from-amber-400 to-orange-600' },
    { title: 'Concluidos', value: stats?.concluidos, icon: <FiCheckCircle size={22} />, tint: 'from-emerald-500 to-green-700' },
    { title: 'Cancelados', value: stats?.cancelados, icon: <FiXCircle size={22} />, tint: 'from-rose-500 to-red-700' },
  ];

  const pieData = [
    { name: 'Abertos', value: stats?.abertos, color: '#3b82f6' },
    { name: 'Progresso', value: stats?.em_andamento, color: '#f59e0b' },
    { name: 'Concluidos', value: stats?.concluidos, color: '#22c55e' },
    { name: 'Cancelados', value: stats?.cancelados, color: '#ef4444' },
  ].filter((d) => d.value > 0);

  const handleExportPDF = async () => {
    const input = document.getElementById('dashboard-content');
    if (!input) {
      toast.error('Conteudo do dashboard nao encontrado para exportacao.');
      return;
    }

    setLoading(true);
    try {
      // Captura o dashboard completo como imagem antes de paginar manualmente no PDF.
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
      setLoading(false);
    }
  };

  return (
    <div className="px-1 py-4 md:py-5">
      <div id="dashboard-content" className="mx-auto max-w-7xl">
        <section className="surface-card slide-up overflow-hidden rounded-[34px]">
          <div className="flex flex-col gap-6 px-6 py-7 md:px-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-stone-400">Visao geral</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-[0_16px_32px_rgba(234,88,12,0.28)]">
                  <FiLayout size={28} />
                </div>
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-slate-800 md:text-4xl">Dashboard</h1>
                  <p className="mt-1 text-sm text-stone-500">Acompanhe volume, status e ritmo operacional em um so lugar.</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleExportPDF}
              disabled={loading}
              className="brand-button rounded-2xl px-5 py-3 font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Gerando PDF...' : 'Exportar para PDF'}
            </button>
          </div>
        </section>

        <section className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">
          {cards.map((card) => (
            <article key={card.title} className="surface-card rounded-[28px] p-5 transition-transform hover:-translate-y-1">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${card.tint} text-white shadow-lg`}>
                {card.icon}
              </div>
              <div className="mt-6">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-400">{card.title}</p>
                <p className="mt-3 text-4xl font-black tracking-tight text-slate-800">{card.value ?? 0}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.55fr_0.95fr]">
          <div className="surface-card rounded-[32px] p-6 md:p-8">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800">
                  <FiActivity className="text-orange-600" /> Evolucao de chamados
                </h2>
                <p className="mt-2 text-sm text-stone-500">Leitura rapida do fluxo recente dos chamados.</p>
              </div>

              <div className="inline-flex rounded-2xl border border-stone-200 bg-stone-100/80 p-1">
                <button
                  onClick={() => setRange(7)}
                  className={`rounded-2xl px-4 py-2 text-xs font-bold transition ${range === 7 ? 'bg-white text-orange-700 shadow-sm' : 'text-stone-500'}`}
                >
                  7 Dias
                </button>
                <button
                  onClick={() => setRange(30)}
                  className={`rounded-2xl px-4 py-2 text-xs font-bold transition ${range === 30 ? 'bg-white text-orange-700 shadow-sm' : 'text-stone-500'}`}
                >
                  30 Dias
                </button>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7dfd5" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#8f7d6b', fontSize: 12 }} dy={10} />
                  <YAxis hide />
                  <Tooltip
                    cursor={{ fill: '#f6efe7' }}
                    contentStyle={{ borderRadius: '18px', border: '1px solid #eadfce', boxShadow: '0 18px 40px rgba(90, 63, 42, 0.12)' }}
                  />
                  <Bar dataKey="chamados" fill="#b85c38" radius={[10, 10, 0, 0]} barSize={38} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-6">
            <div className="surface-card rounded-[32px] p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-800">Distribuicao atual</h2>
              <p className="mt-2 text-sm text-stone-500">Status no momento.</p>
              <div className="mt-6 h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} innerRadius={62} outerRadius={86} paddingAngle={5} dataKey="value">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-3">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between rounded-2xl bg-white/65 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm font-medium text-slate-700">{item.name}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-800">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] bg-gradient-to-br from-slate-900 via-stone-900 to-orange-900 px-6 py-7 text-white shadow-[0_24px_60px_rgba(30,41,59,0.22)] md:px-8">
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-orange-200/75">Operacao</p>
              <h3 className="mt-4 text-2xl font-black tracking-tight">Painel pronto para acompanhar o dia.</h3>
              <p className="mt-3 max-w-md text-sm leading-7 text-stone-200">
                Use o menu lateral para abrir chamados, revisar clientes e navegar pelo historico com mais clareza.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
