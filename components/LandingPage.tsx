import React, { useState } from 'react';
import { CheckCircle2, Factory, Store, Briefcase, Search, ArrowRight, Lock, Users, ChevronDown } from 'lucide-react';
import { Footer } from './Footer';

interface LandingPageProps {
  onStart: (teamSize: string) => void;
}

const TEAM_SIZE_OPTIONS = [
  "Não possuo equipe",
  "Tenho 1 a 4 funcionários",
  "Tenho 5 a 10 funcionários",
  "Tenho de 11 a 30 funcionários",
  "Tenho de 31 a 100 funcionários",
  "Tenho de 101 a 300 funcionários",
  "Tenho mais de 300 funcionários"
];

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [selectedType, setSelectedType] = useState<string>('');
  const [market, setMarket] = useState<string>('');
  const [niche, setNiche] = useState<string>('');
  const [segment, setSegment] = useState<string>('B2B - Vendas para Empresas');
  const [teamSize, setTeamSize] = useState<string>('');

  const isFormValid = selectedType && market && segment && niche && teamSize;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      onStart(teamSize);
    } else {
      alert("Por favor, responda todas as perguntas para continuar.");
    }
  };

  // Lógica para sugestões dinâmicas baseadas na seleção do tipo de negócio
  const getPlaceholders = () => {
    switch (selectedType) {
      case 'Serviços':
        return {
          market: "Ex: Tecnologia, Marketing, Advocacia, Saúde",
          niche: "Ex: Desenvolvimento de Software, Clínica Odontológica, Consultoria Tributária"
        };
      case 'Indústria':
        return {
          market: "Ex: Metalúrgica, Têxtil, Alimentícia, Moveleira",
          niche: "Ex: Fabricação de Peças Automotivas, Móveis Planejados, Confecção de Uniformes"
        };
      case 'Varejo':
        return {
          market: "Ex: Vestuário, Eletrônicos, Supermercado, Farmácia",
          niche: "Ex: Moda Feminina, E-commerce de Acessórios, Loja de Materiais de Construção"
        };
      default:
        return {
          market: "Ex: Tecnologia, Saúde, Agronegócio",
          niche: "Ex: Moda íntima feminina, Consultoria Empresarial"
        };
    }
  };

  const placeholders = getPlaceholders();

  return (
    <div className="flex flex-col min-h-screen">
      <div className="max-w-[1200px] mx-auto px-6 py-12 flex-grow">

        {/* Hero Section */}
        <div className="max-w-[960px] mx-auto mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6">
              <h1 className="text-5xl font-black leading-[1.1] tracking-tight text-slate-900">
                Descubra o grau de maturidade da sua empresa e <span className="text-primary">destrave seu crescimento.</span>
              </h1>
              <div className="flex gap-4 p-4 rounded-xl bg-primary/5 border-l-4 border-primary">
                <div className="p-2 bg-primary/10 rounded-lg h-fit">
                  <Briefcase className="text-primary w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-primary">Educação que Vende</p>
                  <p className="text-sm text-slate-600">Nossa metodologia proprietária combina gestão de alto nível com educação estratégica de vendas.</p>
                </div>
              </div>
              <p className="text-lg text-slate-600 leading-relaxed">
                Complete este diagnóstico de 5 minutos para receber um roteiro personalizado gerado por nossa inteligência de negócios especializada.
              </p>
            </div>

            <div className="relative group h-[400px] flex items-center justify-center">
              <div className="absolute -inset-4 bg-primary/10 rounded-2xl blur-xl group-hover:bg-primary/20 transition-all"></div>

              {/* Premium Mockup Compilation */}
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Action Plan - Bottom Layer */}
                <div
                  className="absolute w-[80%] aspect-[4/3] bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden transform rotate-[-6deg] translate-x-[-15%] translate-y-[10%] transition-transform group-hover:rotate-[-4deg] group-hover:translate-x-[-12%]"
                  style={{
                    backgroundImage: 'url("/assets/reports/action_plan.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'top'
                  }}
                />

                {/* SWOT - Middle Layer */}
                <div
                  className="absolute w-[80%] aspect-[4/3] bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden transform rotate-[4deg] translate-x-[15%] translate-y-[-10%] transition-transform group-hover:rotate-[2deg] group-hover:translate-x-[12%]"
                  style={{
                    backgroundImage: 'url("/assets/reports/swot.png")',
                    backgroundSize: 'cover'
                  }}
                />

                {/* Radar Chart - Top Layer */}
                <div
                  className="absolute w-[75%] aspect-[4/3] bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white p-2 transform transition-transform group-hover:scale-[1.02]"
                  style={{ zIndex: 10 }}
                >
                  <div
                    className="w-full h-full rounded-lg overflow-hidden"
                    style={{
                      backgroundImage: 'url("/assets/reports/radar.png")',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />
                  {/* Glassmorphism Badge */}
                  <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-md border border-white/50 px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Raio-X 360° em Tempo Real</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="flex flex-col items-center gap-2 mt-8 animate-bounce group cursor-pointer" onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}>
            <span className="text-[15px] font-bold text-primary uppercase tracking-[0.2em] transition-colors">Role para iniciar</span>
            <ChevronDown className="text-primary w-6 h-6 transition-colors" />
          </div>
        </div>

        {/* Progress Header - Moved above form */}
        <div className="max-w-[960px] mx-auto mb-8">
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-primary font-bold text-xs tracking-wider uppercase mb-1">Progresso Atual</p>
                <h3 className="text-xl font-bold">Passo 1 de 5: Integração e Coleta de Contexto</h3>
              </div>
              <p className="text-lg font-bold text-slate-900">0%</p>
            </div>
            <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full w-[0%] transition-all duration-1000"></div>
            </div>
            <div className="flex items-center gap-2 text-slate-500 text-sm italic">
              <CheckCircle2 className="text-[#d4af37] w-4 h-4" />
              A IA está analisando suas respostas em tempo real
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="max-w-[960px] mx-auto bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-12 mb-20">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold mb-2">Vamos começar seu Diagnóstico Empresarial</h2>
            <p className="text-slate-500">Isso ajuda nossa IA a calibrar o diagnóstico para a sua realidade específica.</p>
          </div>

          <form className="space-y-10" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <label className="text-lg font-bold block">Sua empresa atua em qual desses ramos? <span className="text-sm font-normal text-slate-500">[Escolha abaixo]</span></label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedType('Serviços')}
                  className={`group relative flex flex-col items-center gap-4 p-6 rounded-xl border-2 transition-all text-center ${selectedType === 'Serviços' ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-primary hover:bg-primary/5'}`}
                >
                  <Briefcase className={`w-10 h-10 transition-colors ${selectedType === 'Serviços' ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`} />
                  <span className={`font-bold ${selectedType === 'Serviços' ? 'text-primary' : ''}`}>Serviços</span>
                  {selectedType === 'Serviços' && (
                    <div className="absolute top-2 right-2 text-primary">
                      <CheckCircle2 className="w-6 h-6 fill-primary text-white" />
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedType('Indústria')}
                  className={`group relative flex flex-col items-center gap-4 p-6 rounded-xl border-2 transition-all text-center ${selectedType === 'Indústria' ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-primary hover:bg-primary/5'}`}
                >
                  <Factory className={`w-10 h-10 transition-colors ${selectedType === 'Indústria' ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`} />
                  <span className={`font-bold ${selectedType === 'Indústria' ? 'text-primary' : ''}`}>Indústria</span>
                  {selectedType === 'Indústria' && (
                    <div className="absolute top-2 right-2 text-primary">
                      <CheckCircle2 className="w-6 h-6 fill-primary text-white" />
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedType('Varejo')}
                  className={`group relative flex flex-col items-center gap-4 p-6 rounded-xl border-2 transition-all text-center ${selectedType === 'Varejo' ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-primary hover:bg-primary/5'}`}
                >
                  <Store className={`w-10 h-10 transition-colors ${selectedType === 'Varejo' ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`} />
                  <span className={`font-bold ${selectedType === 'Varejo' ? 'text-primary' : ''}`}>Varejo</span>
                  {selectedType === 'Varejo' && (
                    <div className="absolute top-2 right-2 text-primary">
                      <CheckCircle2 className="w-6 h-6 fill-primary text-white" />
                    </div>
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-slate-500">Mercado</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    value={market}
                    onChange={(e) => setMarket(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 bg-background-light focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder={placeholders.market}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-slate-500">Nicho de Atuação</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 bg-background-light focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder={placeholders.niche}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-slate-500">Segmento</label>
                <select
                  value={segment}
                  onChange={(e) => setSegment(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-background-light focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  required
                >
                  <option>B2B - Vendas para Empresas</option>
                  <option>B2C - Vendas diretas ao consumidor final</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-slate-500">Tamanho da Equipe</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <select
                    value={teamSize}
                    onChange={(e) => setTeamSize(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 bg-background-light focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none ${!teamSize ? 'text-slate-400' : 'text-slate-900'}`}
                    required
                  >
                    <option value="" disabled>Selecione o tamanho da equipe</option>
                    {TEAM_SIZE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} className="text-slate-900">{opt}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-10 flex flex-col items-center gap-6">
              <button
                type="submit"
                disabled={!isFormValid}
                className={`w-full md:w-[400px] h-14 rounded-xl text-lg font-bold transition-all shadow-xl flex items-center justify-center gap-3 ${isFormValid ? 'bg-primary hover:bg-primary/90 text-white shadow-primary/30 cursor-pointer' : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'}`}
              >
                Continuar para o Passo 2
                <ArrowRight className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Lock className="w-4 h-4" />
                Seus dados são criptografados e usados apenas para fins de diagnóstico.
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};