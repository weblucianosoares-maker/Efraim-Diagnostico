import React, { useMemo } from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts';
import {
  Download, TrendingUp, AlertTriangle, CheckCircle, Brain, HelpCircle,
  ChevronRight, BarChart3, MessageCircle, Lightbulb, Shield, ArrowDown
} from 'lucide-react';
import { QUIZ_DATA, AREA_INSIGHTS } from './quizData';
import { LeadData } from '../App';
import { Footer } from './Footer';
import { FloatingCTA } from './FloatingCTA';

import { ActionPlanPage } from './ActionPlanPage';

interface ResultsPageProps {
  answers: Record<string, number>;
  leadData: LeadData | null;
  onNavigateToPlan: () => void;
}

interface AIAnalysis {
  executiveSummary: string;
  topCriticalAreas: { areaName: string; advice: string }[];
  closingMotivation: string;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({ answers, leadData, onNavigateToPlan }) => {
  const [aiAnalysis, setAiAnalysis] = React.useState<AIAnalysis | null>(null);
  const [loadingAI, setLoadingAI] = React.useState(true);

  // --- Calculation Logic ---

  const areaScores = useMemo(() => {
    return QUIZ_DATA.map(section => {
      const sectionAnswers = section.questions
        .map(q => answers[q.id])
        .filter(val => val !== undefined);

      const totalPossible = sectionAnswers.length * 10;
      const totalScore = sectionAnswers.reduce((a, b) => a + b, 0);

      const percentage = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0;

      const breakdown = section.questions.map(q => ({
        subject: q.subArea,
        A: answers[q.id] || 0,
        fullMark: 10
      })).filter(item => answers[item.subject] !== undefined || true);

      return {
        id: section.id,
        name: section.title,
        score: percentage,
        breakdown: breakdown,
        isSkipped: sectionAnswers.length === 0
      };
    });
  }, [answers]);

  const globalScore = useMemo(() => {
    const activeAreas = areaScores.filter(a => !a.isSkipped);
    if (activeAreas.length === 0) return 0;
    const sum = activeAreas.reduce((acc, curr) => acc + curr.score, 0);
    return Math.round(sum / activeAreas.length);
  }, [areaScores]);

  const maturityLevel = useMemo(() => {
    if (globalScore < 40) return { label: "Sobrevivência", color: "text-red-600", bg: "bg-red-50", border: "border-red-200" };
    if (globalScore < 70) return { label: "Em Desenvolvimento", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" };
    if (globalScore < 90) return { label: "Profissionalização", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" };
    return { label: "Alta Performance", color: "text-green-600", bg: "bg-green-50", border: "border-green-200" };
  }, [globalScore]);

  // Insights Logic: Show ALL active areas, sorted by score
  const allInsights = useMemo(() => {
    const active = areaScores.filter(a => !a.isSkipped);
    // Sort ascending (lowest first)
    return [...active].sort((a, b) => a.score - b.score).map(area => {
      const isCritical = area.score < 50;
      const isAttention = area.score >= 50 && area.score < 80;

      let text = AREA_INSIGHTS[area.id];
      let severity = "Crítico";

      if (!isCritical && !isAttention) {
        text = "Área com boa estruturação. Seus processos demonstram maturidade, continue monitorando os indicadores para manter a excelência.";
        severity = "Bom";
      } else if (isAttention) {
        severity = "Atenção";
      }

      return {
        areaName: area.name,
        score: area.score,
        text: text,
        severity: severity
      };
    });
  }, [areaScores]);

  // SWOT Logic
  const swotAnalysis = useMemo(() => {
    const active = areaScores.filter(a => !a.isSkipped);
    const sortedDesc = [...active].sort((a, b) => b.score - a.score);

    // Simple logic to distribute areas into SWOT based on scores
    return {
      strengths: sortedDesc.filter(a => a.score >= 80).slice(0, 3),
      weaknesses: sortedDesc.filter(a => a.score < 50).slice(0, 3),
      opportunities: sortedDesc.filter(a => a.score >= 50 && a.score < 80).slice(0, 3),
      threats: sortedDesc.filter(a => a.score < 40).slice(0, 3) // Severe weaknesses are threats
    };
  }, [areaScores]);

  // Data for Main Radar Chart
  const radarData = areaScores.map(area => ({
    subject: area.name,
    A: area.score, // User Score
    B: 100, // Benchmark Ideal
    fullMark: 100
  }));

  // AI Fetch Effect
  React.useEffect(() => {
    const fetchAIAnalysis = async () => {
      try {
        const areaData = areaScores.map(a => ({ name: a.name, score: a.score }));

        const response = await fetch('https://rxxoefxeevywqzruczib.supabase.co/functions/v1/analyze-diagnostic', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            answers,
            areas: areaData,
            globalScore,
            companyName: leadData?.companyName || "Sua Empresa",
            leadData: leadData // Pass full lead data for DB storage
          })
        });

        if (!response.ok) throw new Error("Falha na IA");

        const data = await response.json();
        setAiAnalysis(data);
      } catch (error) {
        console.error("Erro ao buscar análise IA:", error);
        // Fallback or just stop loading
      } finally {
        setLoadingAI(false);
      }
    };

    if (areaScores.length > 0) {
      fetchAIAnalysis();
    }
  }, [areaScores, globalScore, leadData]);

  const whatsappLink = "https://wa.me/5521972070247?text=Eu%20quero%20falar%20com%20um%20especialista,%20estava%20no%20Diagn%C3%B3stico%20Efraim";


  return (
    <div className="flex flex-col min-h-screen">
      {/* Custom Styles for Elegant Animations */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-150%); }
          50% { transform: translateX(150%); }
          100% { transform: translateX(150%); }
        }
        .btn-elegant-shimmer {
          position: relative;
          overflow: hidden;
        }
        .btn-elegant-shimmer::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          transform: translateX(-150%);
          animation: shimmer 3s infinite;
        }
        @keyframes shadow-pulse-green {
          0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
          100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }
        .btn-pulse-green {
          animation: shadow-pulse-green 2s infinite;
        }
      `}</style>

      <div className="max-w-[1440px] mx-auto px-6 py-8 flex-grow">

        {/* --- HEADER --- */}
        <div className="flex flex-col gap-8 mb-10 border-b border-slate-200 pb-8">
          {/* Prominent Maturity Display */}
          <div className={`p-8 rounded-2xl border-2 ${maturityLevel.bg} ${maturityLevel.border} flex flex-col items-center text-center relative overflow-hidden`}>
            {loadingAI && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6 text-center">
                <Brain className="w-12 h-12 text-primary animate-pulse mb-4" />
                <p className="text-lg font-bold text-slate-800 animate-pulse">A IA da Efraim está analisando seus dados...</p>
                <p className="text-sm text-slate-500">Gerando insights estratégicos personalizados.</p>
              </div>
            )}

            <p className="text-slate-500 font-bold tracking-widest uppercase mb-2 text-sm md:text-base">
              O NÍVEL DE MATURIDADE DA SUA EMPRESA É:
            </p>
            <h1 className={`text-4xl md:text-6xl font-black ${maturityLevel.color} tracking-tight leading-none mb-4`}>
              {maturityLevel.label.toUpperCase()}
            </h1>

            {aiAnalysis ? (
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm mt-4 max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center justify-center gap-2 mb-3 text-primary font-bold uppercase tracking-widest text-xs">
                  <Brain className="w-4 h-4" /> Análise Executiva da IA
                </div>
                <p className="text-slate-700 text-lg leading-relaxed italic">
                  "{aiAnalysis.executiveSummary}"
                </p>
              </div>
            ) : (
              <p className="text-slate-600 max-w-2xl text-lg mt-2">
                Com base na análise de {globalScore} pontos, sua empresa apresenta um perfil de {maturityLevel.label.toLowerCase()}.
              </p>
            )}
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-end gap-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {leadData?.companyName ? `Diagnóstico: ${leadData.companyName}` : 'Resultado do Diagnóstico'}
              </h2>
              <p className="text-slate-500">
                Visão consolidada dos 10 pilares de gestão.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onNavigateToPlan}
                className="btn-elegant-shimmer btn-pulse-green flex items-center gap-2 px-8 py-4 bg-green-600 text-white rounded-xl text-base font-bold hover:bg-green-700 transition-all shadow-lg active:scale-95 transform hover:-translate-y-1"
              >
                <Download className="w-5 h-5" />
                Gerar Plano de Ação
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">

          {/* --- MAIN COLUMN (Charts & KPIs) --- */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">

            {/* Main Radar Chart */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    Maturidade 360º
                    <div className="group relative">
                      <HelpCircle className="w-4 h-4 text-slate-400 cursor-help" />
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        O gráfico compara sua pontuação atual (Azul) com o cenário ideal de uma empresa de alta performance (Cinza pontilhado).
                      </div>
                    </div>
                  </h3>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-primary"></span>
                      <span>Sua Empresa</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-0.5 bg-slate-300 border-t-2 border-dotted border-slate-400"></span>
                      <span className="text-slate-400">Ideal (100%)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full h-[400px] md:h-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                    <PolarGrid gridType="circle" stroke="#e2e8f0" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: '#475569', fontSize: 11, fontWeight: 700 }}
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                      name="Sua Empresa"
                      dataKey="A"
                      stroke="#135bec"
                      strokeWidth={3}
                      fill="#135bec"
                      fillOpacity={0.25}
                    />
                    <Radar
                      name="Ideal"
                      dataKey="B"
                      stroke="#94a3b8"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      fill="transparent"
                      fillOpacity={0}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* SWOT Matrix Section (Moved from Action Plan) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-slate-700" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Análise SWOT Estratégica</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strengths */}
                <div className="bg-green-50/50 p-6 rounded-xl border border-green-100 flex flex-col gap-3">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <h4 className="font-bold text-green-800">Forças</h4>
                  </div>
                  {swotAnalysis.strengths.length > 0 ? (
                    <ul className="space-y-2">
                      {swotAnalysis.strengths.map(area => (
                        <li key={area.id} className="text-sm text-green-900 flex items-start gap-2">
                          <span className="font-bold text-green-600">•</span>
                          {area.name} ({area.score}%) - Bem estruturado.
                        </li>
                      ))}
                    </ul>
                  ) : <p className="text-sm text-slate-500 italic">Nenhuma força consolidada identificada.</p>}
                </div>

                {/* Weaknesses */}
                <div className="bg-red-50/50 p-6 rounded-xl border border-red-100 flex flex-col gap-3">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <h4 className="font-bold text-red-800">Fraquezas</h4>
                  </div>
                  {swotAnalysis.weaknesses.length > 0 ? (
                    <ul className="space-y-2">
                      {swotAnalysis.weaknesses.map(area => (
                        <li key={area.id} className="text-sm text-red-900 flex items-start gap-2">
                          <span className="font-bold text-red-600">•</span>
                          {area.name} ({area.score}%) - Requer correção urgente.
                        </li>
                      ))}
                    </ul>
                  ) : <p className="text-sm text-slate-500 italic">Nenhuma fraqueza crítica identificada.</p>}
                </div>

                {/* Opportunities */}
                <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 flex flex-col gap-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-5 h-5 text-blue-600" />
                    <h4 className="font-bold text-blue-800">Oportunidades</h4>
                  </div>
                  {swotAnalysis.opportunities.length > 0 ? (
                    <ul className="space-y-2">
                      {swotAnalysis.opportunities.map(area => (
                        <li key={area.id} className="text-sm text-blue-900 flex items-start gap-2">
                          <span className="font-bold text-blue-600">•</span>
                          Melhorar {area.name} para potencializar resultados.
                        </li>
                      ))}
                    </ul>
                  ) : <p className="text-sm text-slate-500 italic">Foque em corrigir as fraquezas para gerar oportunidades.</p>}
                </div>

                {/* Threats */}
                <div className="bg-orange-50/50 p-6 rounded-xl border border-orange-100 flex flex-col gap-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-orange-600" />
                    <h4 className="font-bold text-orange-800">Ameaças</h4>
                  </div>
                  {swotAnalysis.threats.length > 0 ? (
                    <ul className="space-y-2">
                      {swotAnalysis.threats.map(area => (
                        <li key={area.id} className="text-sm text-orange-900 flex items-start gap-2">
                          <span className="font-bold text-orange-600">•</span>
                          Baixa performance em {area.name} põe o negócio em risco.
                        </li>
                      ))}
                    </ul>
                  ) : <p className="text-sm text-slate-500 italic">Riscos externos minimizados.</p>}
                </div>
              </div>
            </div>

            {/* Detailed Area Breakdown (Raio-X) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Raio-X Detalhado por Área
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-100">
                {areaScores.filter(a => !a.isSkipped).map((area) => (
                  <div key={area.id} className="bg-white p-6 flex flex-col gap-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-slate-800">{area.name}</h4>
                      <span className={`text-sm font-bold px-2 py-0.5 rounded ${area.score < 50 ? 'bg-red-100 text-red-700' : area.score < 80 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                        {area.score}%
                      </span>
                    </div>

                    <div className="flex flex-col gap-3">
                      {area.breakdown.map((q, idx) => (
                        <div key={idx} className="flex flex-col gap-1">
                          <div className="flex justify-between text-xs text-slate-500">
                            <span>{q.subject}</span>
                            <span>{q.A}/10</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${q.A <= 4 ? 'bg-red-400' : q.A <= 7 ? 'bg-yellow-400' : 'bg-green-500'}`}
                              style={{ width: `${(q.A / 10) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Specialist Call to Action Section */}
            <div className="bg-slate-900 rounded-2xl p-10 md:p-14 text-center text-white shadow-xl flex flex-col items-center gap-6 relative overflow-hidden mx-auto w-full">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
              <div className="relative z-10 max-w-3xl flex flex-col items-center">
                <h2 className="text-2xl md:text-4xl font-black mb-6 leading-tight uppercase tracking-tight">
                  PRECISA DE AJUDA PARA DESTRAVAR O CRESCIMENTO DA SUA EMPRESA?
                </h2>
                <p className="text-slate-300 text-lg mb-8 max-w-xl">
                  Nossos especialistas podem analisar este diagnóstico com você e traçar um plano de correção imediato.
                </p>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all transform hover:scale-105 shadow-lg shadow-green-900/20"
                >
                  <MessageCircle className="w-6 h-6" />
                  Falar com um Especialista Agora
                </a>
              </div>
            </div>

          </div>

          {/* --- SIDEBAR (Insights) --- */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl flex flex-col shadow-sm">
              <div className="p-6 border-b border-slate-200 bg-slate-50">
                <div className="flex items-center gap-2 mb-1">
                  <Brain className="text-primary w-5 h-5" />
                  <h2 className="text-lg font-bold">Diagnóstico & Pontos Críticos</h2>
                </div>
                <p className="text-xs text-slate-500 leading-normal">
                  Análise completa de todas as 10 áreas avaliadas.
                </p>
              </div>

              <div className="p-4 space-y-4">
                {allInsights.map((insight, idx) => (
                  <div key={idx} className={`p-5 rounded-xl border-l-4 shadow-sm ${insight.severity === 'Crítico' ? 'bg-red-50/50 border-red-500' :
                    insight.severity === 'Atenção' ? 'bg-orange-50/50 border-orange-400' :
                      'bg-green-50/50 border-green-500'
                    }`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${insight.severity === 'Crítico' ? 'bg-red-500 text-white' :
                        insight.severity === 'Atenção' ? 'bg-orange-400 text-white' :
                          'bg-green-500 text-white'
                        }`}>
                        {insight.areaName}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500">Nota: {(insight.score / 10).toFixed(1)}</span>
                    </div>
                    <h4 className="text-sm font-bold mb-1 text-slate-900">
                      {insight.severity === 'Bom' ? 'Ponto Forte' : insight.severity === 'Crítico' ? 'Falha Crítica' : 'Ponto de Atenção'}
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      "{insight.text}"
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-6 border-t border-slate-200 bg-white">
                <div className="mb-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-4 rounded-xl relative overflow-hidden group">
                  <div className="absolute -right-2 -top-2 w-12 h-12 bg-blue-100 rounded-full opacity-50 blur-xl"></div>
                  <p className="text-sm text-slate-700 font-medium leading-relaxed relative z-10">
                    {aiAnalysis ? `"${aiAnalysis.closingMotivation}"` : "Não deixe esses pontos travarem seu negócio."}
                    <span className="block mt-1 text-primary font-black animate-pulse flex items-center gap-1">
                      Gere seu plano de correção agora
                      <ArrowDown className="w-4 h-4 animate-bounce" />
                    </span>
                  </p>
                </div>

                <button
                  onClick={onNavigateToPlan}
                  className="w-full btn-elegant-shimmer btn-pulse-green bg-green-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 shadow-lg active:scale-95 transition-all transform hover:-translate-y-1"
                >
                  Gerar Plano de Ação
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <FloatingCTA />
    </div>
  );
};