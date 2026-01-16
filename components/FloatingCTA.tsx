import React from 'react';
import { MessageCircle } from 'lucide-react';

export const FloatingCTA: React.FC = () => {
  const whatsappLink = "https://wa.me/5521972070247?text=Eu%20quero%20falar%20com%20um%20especialista,%20estava%20no%20Diagn%C3%B3stico%20Efraim";

  return (
    <a 
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center bg-[#25D366] text-white rounded-full shadow-xl hover:bg-[#20bd5a] transition-all duration-300 group overflow-hidden h-14 w-14 hover:w-auto hover:px-6 hover:shadow-2xl"
    >
      <MessageCircle className="w-6 h-6 shrink-0 fill-white text-white" />
      
      <span className="max-w-0 overflow-hidden opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-3 transition-all duration-300 whitespace-nowrap font-bold text-base">
        Falar com Especialista
      </span>
      
      {/* Notification Dot */}
      <div className="absolute top-3 right-3 w-3 h-3 bg-red-500 rounded-full border-2 border-[#25D366] group-hover:hidden transition-opacity"></div>
    </a>
  );
};