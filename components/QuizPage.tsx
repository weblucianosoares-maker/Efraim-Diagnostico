import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  CheckCircle2, Circle, PlayCircle, Save,
  ArrowRight, ArrowLeft, Users, AlertCircle, Lock, Mail, Phone, Building2, User, Hexagon
} from 'lucide-react';
import { QUIZ_DATA } from './quizData'; // Import shared data
import { LeadData } from '../App';
import { Footer } from './Footer';

interface QuizPageProps {
  onFinish: (answers: Record<string, number>, leadData: LeadData) => void;
  teamSize: string;
}

const OPTIONS = [
  { value: 0, label: 'Não / Inexistente', description: 'Não fazemos ou é muito fraco.' },
  { value: 5, label: 'Parcial / Em Desenv.', description: 'Temos, mas não é consistente.' },
  { value: 10, label: 'Sim / Otimizado', description: 'Processo maduro e controlado.' },
];

export const QuizPage: React.FC<QuizPageProps> = ({ onFinish, teamSize }) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showLeadForm, setShowLeadForm] = useState(false);

  // Lead Form State
  const [leadName, setLeadName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  // Refs for auto-scrolling
  const questionRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Determina se tem equipe com base na seleção feita na LandingPage
  const hasTeam = teamSize !== "Não possuo equipe";

  const currentSection = QUIZ_DATA[currentSectionIndex];

  // Calcula o progresso visual considerando apenas seções que o usuário irá responder
  const visibleSections = useMemo(() => {
    if (hasTeam) return QUIZ_DATA;
    return QUIZ_DATA.filter(s => !s.skippable);
  }, [hasTeam]);

  // Encontra o índice relativo para a barra de progresso
  const currentVisibleIndex = visibleSections.findIndex(s => s.id === currentSection.id);
  const progressPercentage = Math.round(((currentVisibleIndex) / visibleSections.length) * 100);

  // Filtra as perguntas baseado na configuração de equipe
  const visibleQuestions = useMemo(() => {
    if (!currentSection) return [];
    if (currentSection.skippable && !hasTeam) return [];

    return currentSection.questions.filter(q => {
      if (q.requiresTeam && !hasTeam) return false;
      return true;
    });
  }, [currentSection, hasTeam]);

  // Rola para o topo ao mudar de seção
  useEffect(() => {
    if (!showLeadForm) {
      const mainContent = document.getElementById('main-content');
      if (mainContent) mainContent.scrollTop = 0;
    }
  }, [currentSectionIndex, showLeadForm]);

  const handleOptionSelect = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));

    // Auto-scroll logic
    const currentIndex = visibleQuestions.findIndex(q => q.id === questionId);
    if (currentIndex !== -1 && currentIndex < visibleQuestions.length - 1) {
      const nextQuestionId = visibleQuestions[currentIndex + 1].id;

      // Small delay to allow the user to see the selection interaction
      setTimeout(() => {
        const nextElement = questionRefs.current.get(nextQuestionId);
        if (nextElement) {
          nextElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  };

  const isSectionComplete = () => {
    if (visibleQuestions.length === 0) return true;
    return visibleQuestions.every(q => answers[q.id] !== undefined);
  };

  const getNextValidSectionIndex = (startIndex: number) => {
    let nextIndex = startIndex + 1;
    while (nextIndex < QUIZ_DATA.length) {
      const section = QUIZ_DATA[nextIndex];
      if (section.skippable && !hasTeam) {
        nextIndex++;
        continue;
      }
      return nextIndex;
    }
    return -1; // Fim do quiz
  };

  const getPrevValidSectionIndex = (startIndex: number) => {
    let prevIndex = startIndex - 1;
    while (prevIndex >= 0) {
      const section = QUIZ_DATA[prevIndex];
      if (section.skippable && !hasTeam) {
        prevIndex--;
        continue;
      }
      return prevIndex;
    }
    return -1;
  };

  const handleNext = () => {
    if (!isSectionComplete()) {
      alert("Por favor, responda todas as perguntas desta seção para continuar.");
      return;
    }

    const nextIndex = getNextValidSectionIndex(currentSectionIndex);

    if (nextIndex !== -1) {
      setCurrentSectionIndex(nextIndex);
    } else {
      // Quiz finished, show lead form
      setShowLeadForm(true);
    }
  };

  const handleBack = () => {
    if (showLeadForm) {
      setShowLeadForm(false);
      return;
    }
    const prevIndex = getPrevValidSectionIndex(currentSectionIndex);
    if (prevIndex !== -1) {
      setCurrentSectionIndex(prevIndex);
    }
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (leadName && companyName && email && whatsapp) {
      onFinish(answers, {
        name: leadName,
        companyName,
        email,
        whatsapp
      });
    }
  };

  if (showLeadForm) {
    return (
      <div className="flex flex-col h-full bg-background-light overflow-y-auto">
        <div className="flex-1 flex flex-col items-center justify-center p-4 py-12">
          <div className="bg-white max-w-lg w-full rounded-2xl shadow-xl border border-slate-200 p-8 animate-in fade-in zoom-in-95 duration-300">
            <div className="text-center mb-8">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Diagnóstico Finalizado!</h2>
              <p className="text-slate-500 mt-2">
                Nossa IA já processou suas respostas. Preencha seus dados para acessar o relatório completo e o plano de ação.
              </p>
            </div>

            <form onSubmit={handleLeadSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Nome da Empresa</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="Ex: Efraim Gestão"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Seu Nome</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    required
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="Ex: João Silva"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">WhatsApp</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="tel"
                      required
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">E-mail</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full h-14 bg-primary text-white rounded-xl font-bold text-lg shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                >
                  Ver Resultado Completo
                  <ArrowRight className="w-5 h-5" />
                </button>
                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-400">
                  <Lock className="w-3 h-3" />
                  Seus dados são criptografados e usados apenas para fins de diagnóstico.
                </div>
              </div>

              <button
                type="button"
                onClick={handleBack}
                className="w-full py-2 text-slate-400 font-medium hover:text-slate-600 transition-colors"
              >
                Voltar para revisar respostas
              </button>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto hidden lg:flex custom-scrollbar">
        <div className="p-6">
          {/* Logo removed to prevent duplication with global Navbar */}

          <div className="mb-6 p-3 bg-slate-50 rounded-lg border border-slate-100">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-slate-700 uppercase">Perfil da Equipe</span>
            </div>
            <p className="text-xs text-slate-500 font-medium truncate" title={teamSize}>{teamSize}</p>
          </div>

          <nav className="space-y-1">
            {QUIZ_DATA.map((section, index) => {
              // Se não tem equipe, não renderiza na sidebar as seções que serão puladas
              if (!hasTeam && section.skippable) return null;

              const isActive = index === currentSectionIndex;
              const isCompleted = index < currentSectionIndex;

              if (isActive) {
                return (
                  <div key={section.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary text-white shadow-md transition-all">
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                    <p className="text-xs font-bold tracking-wide truncate">{section.title}</p>
                  </div>
                );
              }

              if (isCompleted) {
                return (
                  <div key={section.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-green-700 bg-green-50 transition-all">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <p className="text-xs font-semibold truncate">{section.title}</p>
                  </div>
                );
              }

              return (
                <div key={section.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 transition-colors opacity-60">
                  <Circle className="w-4 h-4 shrink-0" />
                  <p className="text-xs font-medium truncate">{section.title}</p>
                </div>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main id="main-content" className="flex-1 overflow-y-auto flex flex-col relative bg-background-light scroll-smooth">
        {/* Sticky Sub-header */}
        <header className="sticky top-0 z-20 bg-background-light/95 backdrop-blur-md px-6 md:px-12 py-3 flex items-center justify-between border-b border-slate-200">
          <div className="flex flex-col">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
              Área {currentVisibleIndex + 1} de {visibleSections.length}
            </span>
            <h2 className="text-slate-900 text-lg font-black leading-none">{currentSection.title}</h2>
          </div>
          <div className="flex items-center gap-4 w-1/3 max-w-[200px]">
            <div className="flex flex-col flex-1 gap-1">
              <div className="flex justify-between items-end">
                <span className="text-xs font-bold text-primary">{progressPercentage}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500 ease-out"
                  style={{ width: `${Math.max(progressPercentage, 5)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 max-w-[1000px] mx-auto w-full px-6 md:px-12 py-4 flex flex-col gap-5">

          {/* Section Header & Description */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <p className="text-slate-600 text-sm leading-relaxed">{currentSection.description}</p>
            </div>
          </div>

          {/* Questions List */}
          {visibleQuestions.length > 0 ? (
            <div className="flex flex-col gap-4">
              {visibleQuestions.map((q, index) => (
                <div
                  key={q.id}
                  ref={(el) => {
                    if (el) questionRefs.current.set(q.id, el);
                    else questionRefs.current.delete(q.id);
                  }}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{q.subArea}</span>
                    {answers[q.id] !== undefined && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                  </div>
                  <div className="p-5 md:p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-1.5 leading-snug">{q.question}</h3>
                    <p className="text-xs text-slate-500 mb-4 font-normal leading-relaxed">{q.explanation}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {OPTIONS.map((opt) => {
                        const isSelected = answers[q.id] === opt.value;
                        return (
                          <button
                            key={opt.value}
                            onClick={() => handleOptionSelect(q.id, opt.value)}
                            className={`relative flex flex-col items-start p-4 rounded-xl border-2 transition-all text-left ${isSelected
                              ? 'border-primary bg-primary/5 shadow-md'
                              : 'border-slate-100 hover:border-primary/30 hover:bg-slate-50'
                              }`}
                          >
                            <div className={`w-3.5 h-3.5 rounded-full border-2 mb-2 flex items-center justify-center ${isSelected ? 'border-primary' : 'border-slate-300'}`}>
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>}
                            </div>
                            <span className={`text-[13px] font-bold mb-0.5 ${isSelected ? 'text-primary' : 'text-slate-900'}`}>{opt.label}</span>
                            <span className="text-[11px] text-slate-500 leading-tight">{opt.description}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-200 border-dashed">
              <div className="bg-slate-100 p-4 rounded-full mb-4">
                <Users className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Esta seção foi pulada automaticamente</h3>
              <p className="text-slate-500 text-center max-w-md mt-2">Baseado no seu perfil de equipe, esta área não se aplica ao seu diagnóstico atual.</p>
            </div>
          )}

          {/* Navigation Footer */}
          <div className="mt-4 p-5 bg-white border border-slate-200 rounded-xl shadow-sm flex justify-between items-center">
            <button
              onClick={handleBack}
              disabled={currentSectionIndex === 0}
              className={`flex items-center gap-2 px-4 md:px-6 h-12 font-bold transition-colors ${currentSectionIndex === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden md:inline">Anterior</span>
            </button>

            <div className="flex items-center gap-4">
              {!isSectionComplete() && (
                <span className="text-xs font-medium text-orange-600 bg-orange-50 px-3 py-1 rounded-full flex items-center gap-1 animate-pulse">
                  <AlertCircle className="w-3 h-3" />
                  Responda tudo para avançar
                </span>
              )}
              <button
                onClick={handleNext}
                disabled={!isSectionComplete()}
                className={`px-6 md:px-8 h-12 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2 ${isSectionComplete()
                  ? 'bg-primary text-white shadow-primary/30 active:scale-95 hover:bg-primary/90'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  }`}
              >
                <span>{getNextValidSectionIndex(currentSectionIndex) === -1 ? 'Finalizar' : 'Próxima Área'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
};