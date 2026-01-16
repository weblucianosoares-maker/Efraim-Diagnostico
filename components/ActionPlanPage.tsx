import React, { useEffect, useMemo } from 'react';
import { 
  Rocket, CheckCircle, Clock, BarChart, MessageCircle, AlertTriangle, ArrowRight, ShieldCheck, UserCheck 
} from 'lucide-react';
import { Footer } from './Footer';
import { FloatingCTA } from './FloatingCTA';
import { QUIZ_DATA } from './quizData';

interface ActionPlanPageProps {
  onRestart: () => void;
  answers: Record<string, number>;
}

export const ActionPlanPage: React.FC<ActionPlanPageProps> = ({ onRestart, answers }) => {
  
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const whatsappLink = "https://wa.me/5521972070247?text=Eu%20quero%20falar%20com%20um%20especialista,%20vi%20o%20plano%20de%20ação%20e%20preciso%20de%20ajuda";

  // Recalculate scores to identify critical areas
  const areaScores = useMemo(() => {
    return QUIZ_DATA.map(section => {
      const sectionAnswers = section.questions
        .map(q => answers[q.id])
        .filter(val => val !== undefined);
      
      const totalPossible = sectionAnswers.length * 10;
      const totalScore = sectionAnswers.reduce((a, b) => a + b, 0);
      const percentage = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0;

      return {
        id: section.id,
        name: section.title,
        score: percentage,
        isSkipped: sectionAnswers.length === 0
      };
    }).filter(a => !a.isSkipped);
  }, [answers]);

  // Sort areas by lowest score first to prioritize plan
  const criticalAreas = useMemo(() => {
    return [...areaScores].sort((a, b) => a.score - b.score);
  }, [areaScores]);

  // Generate 5 Strategic Phases based on the 5 lowest scoring areas
  // If fewer than 5 areas, we fill with generic growth steps
  const strategicPhases = useMemo(() => {
    const phases = [];
    const areasToFix = criticalAreas.slice(0, 5); // Take up to top 5 worst areas
    
    // Phase 1: Immediate Correction (Worst Area)
    if (areasToFix[0]) {
       phases.push({
         title: "Fase 1: Estancar Sangramento",
         period: "0 - 30 dias",
         focus: areasToFix[0].name,
         action: `Implementar auditoria imediata e processo de controle rigoroso em ${areasToFix[0].name}.`,
         goal: "Eliminar o risco crítico que ameaça a continuidade da operação."
       });
    }

    // Phase 2: Stabilization (2nd Worst Area)
    if (areasToFix[1]) {
       phases.push({
         title: "Fase 2: Estabilização",
         period: "30 - 60 dias",
         focus: areasToFix[1].name,
         action: `Reestruturar os processos de ${areasToFix[1].name} definindo responsáveis e KPIs.`,
         goal: "Garantir que a operação básica rode sem apagar incêndios diariamente."
       });
    }

    // Phase 3: Efficiency (3rd Worst Area)
    if (areasToFix[2]) {
       phases.push({
         title: "Fase 3: Eficiência Operacional",
         period: "60 - 90 dias",
         focus: areasToFix[2].name,
         action: `Otimizar ${areasToFix[2].name} com tecnologia ou melhores práticas de gestão.`,
         goal: "Fazer mais com menos recursos e aumentar a margem."
       });
    }

    // Phase 4: Growth Foundation (4th Worst Area or Generic)
    if (areasToFix[3]) {
       phases.push({
         title: "Fase 4: Fundação de Crescimento",
         period: "90 - 120 dias",
         focus: areasToFix[3].name,
         action: `Profissionalizar a gestão de ${areasToFix[3].name} preparando para escala.`,
         goal: "Criar estrutura robusta para suportar o dobro do faturamento."
       });
    } else {
       phases.push({
         title: "Fase 4: Preparação para Escala",
         period: "90 - 120 dias",
         focus: "Expansão",
         action: "Revisar modelo de negócios para identificar alavancas de crescimento.",
         goal: "Preparar o terreno para vendas agressivas."
       });
    }

    // Phase 5: High Performance (5th Worst Area or Generic)
    if (areasToFix[4]) {
       phases.push({
         title: "Fase 5: Alta Performance",
         period: "120+ dias",
         focus: areasToFix[4].name,
         action: `Atingir excelência em ${areasToFix[4].name} através de melhoria contínua.`,
         goal: "Tornar-se referência de mercado neste quesito."
       });
    } else {
       phases.push({
         title: "Fase 5: Alta Performance",
         period: "120+ dias",
         focus: "Liderança de Mercado",
         action: "Implementar rituais de inovação e cultura de alta performance.",
         goal: "Consolidar a liderança no seu nicho."
       });
    }

    return phases;
  }, [criticalAreas]);

  // Sales Copy Content Generation based on Top 3 Critical Pains
  const salesPains = criticalAreas.slice(0, 3).map(area => {
     let copy = { pain: "", consequence: "", desire: "", solutions: [] as string[] };
     
     switch(area.id) {
        case 'financeiro':
           copy = { 
             pain: "Seu dinheiro parece desaparecer no final do mês?", 
             consequence: "Sem controle financeiro, você corre o risco de quebrar mesmo vendendo muito.", 
             desire: "Imagine ter previsibilidade de caixa e dormir tranquilo sabendo que há lucro real.",
             solutions: [
               "Auditoria completa de Fluxo de Caixa",
               "Implementação de DRE Gerencial",
               "Trava de segurança para despesas"
             ]
           }; break;
        case 'comercial':
           copy = { 
             pain: "Depende de indicações ou da sorte para vender?", 
             consequence: "Se as vendas pararem, sua empresa para. A instabilidade impede você de planejar o futuro.", 
             desire: "Vamos construir uma máquina de vendas previsível que traz clientes todos os dias.",
             solutions: [
               "Criação de Scripts de Venda validados",
               "Implantação de CRM de alta performance",
               "Estruturação de metas e comissões"
             ]
           }; break;
        case 'cultura':
           copy = { 
             pain: "Sente que a equipe não veste a camisa?", 
             consequence: "Você acaba tendo que fazer tudo sozinho, virando escravo do próprio negócio.", 
             desire: "Tenha um time autogerenciável que entrega resultados sem você precisar cobrar o tempo todo.",
             solutions: [
               "Definição clara de papéis e responsabilidades",
               "Criação de rituais de gestão e feedback",
               "Alinhamento de cultura e propósito"
             ]
           }; break;
        case 'governanca':
           copy = { 
             pain: "Medo de processos trabalhistas ou brigas societárias?", 
             consequence: "Um único erro jurídico pode levar embora anos de lucro da sua empresa.", 
             desire: "Proteja seu patrimônio e blinde sua empresa contra riscos invisíveis.",
             solutions: [
               "Revisão do Acordo de Sócios",
               "Auditoria de passivos trabalhistas",
               "Compliance e gestão de riscos"
             ]
           }; break;
        case 'estrategia':
            copy = { 
              pain: "Trabalha muito e não vê a empresa crescer?", 
              consequence: "Sem estratégia, você está apenas correndo em círculos enquanto o concorrente avança.", 
              desire: "Tenha um mapa claro de onde chegar e como dobrar seu tamanho no próximo ano.",
              solutions: [
                "Planejamento Estratégico Anual",
                "Definição de OKRs (Metas) trimestrais",
                "Análise de modelo de negócios"
              ]
            }; break;
        case 'marketing':
            copy = { 
              pain: "Sua marca é invisível e não atrai clientes?", 
              consequence: "Depender só do boca a boca limita seu crescimento e te deixa vulnerável.", 
              desire: "Crie um imã de clientes qualificados que procuram sua empresa ativamente.",
              solutions: [
                "Estruturação de canais de aquisição",
                "Posicionamento de autoridade no digital",
                "Análise de ROI de campanhas"
              ]
            }; break;
        case 'tecnologia':
            copy = { 
              pain: "Processos manuais e lentos travam sua operação?", 
              consequence: "Sua equipe perde tempo com tarefas repetitivas em vez de gerar lucro.", 
              desire: "Automatize sua empresa para ela rodar rápida e eficiente como um relógio.",
              solutions: [
                "Diagnóstico de infraestrutura e sistemas",
                "Integração de ferramentas (ERP/CRM)",
                "Automação de fluxos de trabalho"
              ]
            }; break;
        case 'controladoria':
            copy = { 
              pain: "Dirigindo no escuro sem indicadores?", 
              consequence: "Você toma decisões baseadas em 'achismo' e pode errar feio a qualquer momento.", 
              desire: "Tenha um painel de controle com dados em tempo real para decidir com segurança.",
              solutions: [
                "Definição de KPIs estratégicos",
                "Relatórios gerenciais mensais",
                "Análise de margem por produto/serviço"
              ]
            }; break;
        case 'fiscal':
            copy = { 
              pain: "Pagando mais impostos do que deveria?", 
              consequence: "A ineficiência tributária corrói sua margem de lucro silenciosamente.", 
              desire: "Pague o mínimo possível dentro da lei e aumente sua lucratividade líquida.",
              solutions: [
                "Planejamento tributário estratégico",
                "Revisão fiscal e contábil",
                "Recuperação de créditos tributários"
              ]
            }; break;
        default:
            copy = { 
              pain: `Sente que a área de ${area.name} está travando seu negócio?`, 
              consequence: "Gargalos operacionais drenam sua energia e seu lucro.", 
              desire: "Transforme essa fraqueza em uma vantagem competitiva poderosa.",
              solutions: [
                "Diagnóstico profundo da causa raiz",
                "Implementação de processos validados",
                "Acompanhamento da execução"
              ]
            };
     }
     return { ...copy, areaName: area.name, score: area.score };
  });

  return (
    <div className="flex flex-col min-h-screen bg-background-light">
      <div className="flex-grow flex flex-col items-center py-10 px-4 md:px-10">
        <div className="flex flex-col max-w-[1000px] w-full gap-16">
          
          {/* Header */}
          <div className="flex flex-col gap-4 text-center">
             <div className="mx-auto bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider w-fit">
                Estratégia Personalizada
             </div>
             <h1 className="text-slate-900 text-3xl md:text-5xl font-black leading-tight">
                Plano Macro de Ação Estratégica
             </h1>
             <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                Baseado nos seus pontos mais críticos, desenhamos este roteiro de 5 fases para corrigir rotas e acelerar resultados.
             </p>
          </div>

          {/* 5-Phase Timeline */}
          <div className="relative flex flex-col gap-12 pl-4 md:pl-0">
             {/* Vertical Line (Mobile only left aligned, Desktop center or left depending on design choice - sticking to left for readability) */}
             <div className="absolute left-[27px] top-4 bottom-4 w-1 bg-slate-200 z-0"></div>

             {strategicPhases.map((phase, index) => (
                <div key={index} className="relative z-10 flex gap-6 md:gap-8 animate-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${index * 150}ms` }}>
                   <div className="flex-none w-14 h-14 rounded-full bg-white border-4 border-primary text-primary flex items-center justify-center shadow-lg">
                      <span className="text-2xl font-black">{index + 1}</span>
                   </div>
                   <div className="flex flex-col gap-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm w-full hover:shadow-md transition-shadow">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-2">
                         <h3 className="text-xl font-bold text-slate-900">{phase.title}</h3>
                         <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1">
                             <Clock className="w-3 h-3" /> {phase.period}
                         </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Foco Principal</p>
                            <p className="font-bold text-primary flex items-center gap-2">
                               <AlertTriangle className="w-4 h-4" /> {phase.focus}
                            </p>
                         </div>
                         <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Ação Chave</p>
                            <p className="text-slate-700 text-sm font-medium">{phase.action}</p>
                         </div>
                      </div>
                      
                      <div className="mt-2 bg-green-50 p-3 rounded-lg border border-green-100">
                         <p className="text-green-800 text-sm font-bold flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Resultado Esperado: <span className="font-normal">{phase.goal}</span>
                         </p>
                      </div>
                   </div>
                </div>
             ))}
          </div>

        </div>
      </div>

      {/* --- HIGH CONVERSION SALES SECTION (Seamless Transition) --- */}
      <div className="bg-white pt-20 pb-20 border-t border-slate-200">
         <div className="max-w-[1000px] mx-auto px-6">
            
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">
                  Você não chegou até aqui para <span className="text-primary">continuar na média.</span>
               </h2>
               <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                  O diagnóstico apontou exatamente onde sua empresa está sangrando. Agora você tem duas escolhas: ignorar e continuar com os mesmos problemas, ou agir com quem sabe resolver.
               </p>
            </div>

            {/* Pain Points Sections - Dynamically Generated */}
            <div className="flex flex-col gap-24">
               {salesPains.map((item, idx) => (
                  <div key={idx} className="flex flex-col md:flex-row items-center gap-12">
                     <div className="flex-1 space-y-6 order-1 md:order-1">
                        <div className="inline-block bg-red-100 text-red-600 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider mb-2">
                           Ponto Crítico Identificado: {item.areaName} ({item.score}%)
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 leading-tight">
                           {item.pain}
                        </h3>
                        <p className="text-lg text-slate-600 border-l-4 border-slate-200 pl-4 italic">
                           "{item.consequence}"
                        </p>
                        <p className="text-lg font-medium text-slate-800">
                           {item.desire}
                        </p>
                        <div className="pt-4">
                           <a 
                              href={whatsappLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all group text-lg"
                           >
                              Quero resolver isso agora <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                           </a>
                        </div>
                     </div>
                     <div className="flex-1 w-full order-2 md:order-2">
                        <div className="relative bg-slate-100 rounded-2xl p-8 md:p-12 border border-slate-200 shadow-xl transform hover:-translate-y-2 transition-transform duration-300">
                           <div className="absolute -top-6 -right-6 w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                              <AlertTriangle className="w-10 h-10 text-primary" />
                           </div>
                           <h4 className="text-xl font-bold mb-4">Como a Efraim resolve:</h4>
                           <ul className="space-y-4">
                              {item.solutions.map((solution, sIdx) => (
                                <li key={sIdx} className="flex items-start gap-3">
                                   <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                   <span className="text-slate-600">{solution}</span>
                                </li>
                              ))}
                           </ul>
                        </div>
                     </div>
                  </div>
               ))}
            </div>

            {/* Authority & Trust Section */}
            <div className="mt-32 bg-slate-900 rounded-3xl p-8 md:p-16 text-white text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
               <div className="relative z-10 max-w-4xl mx-auto space-y-8">
                  <div className="flex justify-center gap-4 mb-4">
                     <ShieldCheck className="w-12 h-12 text-[#25D366]" />
                     <UserCheck className="w-12 h-12 text-[#25D366]" />
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black leading-tight">
                     Você não precisa caminhar sozinho.
                  </h2>
                  <p className="text-xl text-slate-300 leading-relaxed">
                     Sou empresário e especialista em gestão com mais de 20 anos de mercado. Já vi empresas quebrarem por ignorarem os sinais que seu diagnóstico mostrou, e já vi empresas decolarem ao corrigirem a rota a tempo.
                  </p>
                  <p className="text-xl text-slate-300 font-medium">
                     Eu posso ser o parceiro estratégico que faltava para o seu negócio.
                  </p>
                  
                  <div className="pt-8 flex flex-col items-center gap-4">
                     <a 
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#25D366] hover:bg-[#20bd5a] text-white text-xl font-bold px-10 py-5 rounded-xl shadow-lg hover:shadow-green-500/30 hover:scale-105 transition-all flex items-center gap-3 w-full md:w-auto justify-center"
                     >
                        <MessageCircle className="w-7 h-7" />
                        Quero Falar com um Especialista Efraim
                     </a>
                     <p className="text-slate-400 text-sm">Sem compromisso. Apenas uma conversa franca sobre o seu futuro.</p>
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