import React from 'react';
import { Hexagon, LayoutDashboard, FileText, BarChart2, Bell, User } from 'lucide-react';
import { PageState } from '../types';

interface NavbarProps {
  currentPage: PageState;
  onNavigate: (page: PageState) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const isAppMode = currentPage !== 'landing';
  const whatsappLink = "https://wa.me/5521972070247?text=Eu%20quero%20falar%20com%20um%20especialista,%20estava%20no%20Diagn%C3%B3stico%20Efraim";

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className={`mx-auto px-6 h-20 flex items-center justify-between ${isAppMode ? 'max-w-[1440px]' : 'max-w-[1200px]'}`}>
        
        {/* Logo Area */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigate('landing')}>
          <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-blue-700 rounded-xl shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
            <Hexagon className="w-7 h-7 text-white fill-white/20" strokeWidth={2.5} />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-accent-gold rounded-full border-2 border-white"></div>
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-xl font-black tracking-tight leading-none text-slate-900">
              Efraim<span className="text-primary">Gestão</span>
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-0.5">
              Diagnóstico de Maturidade
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-8">
          {isAppMode ? (
            // App Mode Navigation
            <>
              {/* Navigation links removed as requested */}
              
              <div className="flex items-center gap-3 pl-6">
                 <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="hidden lg:flex items-center justify-center h-10 px-5 bg-[#25D366] text-white text-sm font-bold rounded-lg shadow-lg hover:bg-[#20bd5a] transition-all gap-2 hover:-translate-y-0.5"
                 >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                    Falar com Especialista
                </a>
                <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                  <Bell size={20} />
                </button>
                <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
                  <img src="https://picsum.photos/seed/user/100/100" alt="User" className="w-full h-full object-cover" />
                </div>
              </div>
            </>
          ) : (
            // Landing Mode Navigation
            <>
            </>
          )}
        </div>
      </div>
    </header>
  );
};