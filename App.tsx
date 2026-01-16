import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { PageState } from './types';
import { Loader2 } from 'lucide-react';

// Lazy Load heavy components to improve initial load speed
const QuizPage = React.lazy(() => import('./components/QuizPage').then(module => ({ default: module.QuizPage })));
const ResultsPage = React.lazy(() => import('./components/ResultsPage').then(module => ({ default: module.ResultsPage })));
const ActionPlanPage = React.lazy(() => import('./components/ActionPlanPage').then(module => ({ default: module.ActionPlanPage })));

export interface LeadData {
  companyName: string;
  name: string;
  email: string;
  whatsapp: string;
}

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageState>('landing');
  const [teamSize, setTeamSize] = useState<string>('');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [leadData, setLeadData] = useState<LeadData | null>(null);

  // Handle Browser Back Button
  React.useEffect(() => {
    // Navigate function that updates History
    const handleNavigate = (page: PageState) => {
      window.history.pushState({ page }, '', `/#${page}`);
      setCurrentPage(page);
    };

    // Listen for back button clicks
    const handlePopState = (event: PopStateEvent) => {
      if (event.state?.page) {
        setCurrentPage(event.state.page);
      } else {
        setCurrentPage('landing');
      }
    };

    window.addEventListener('popstate', handlePopState);

    // Attach listener to custom navigation event safely
    (window as any).navigateTo = handleNavigate;

    return () => {
      window.removeEventListener('popstate', handlePopState);
      delete (window as any).navigateTo;
    };
  }, []);

  const navigateTo = (page: PageState) => {
    window.history.pushState({ page }, '', `/#${page}`);
    setCurrentPage(page);
  };
  const renderPage = () => {
    return (
      <React.Suspense fallback={
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      }>
        {currentPage === 'landing' && (
          <LandingPage
            onStart={(selectedTeamSize) => {
              setTeamSize(selectedTeamSize);
              navigateTo('quiz');
            }}
          />
        )}
        {currentPage === 'quiz' && (
          <QuizPage
            teamSize={teamSize}
            onFinish={(answers, lead) => {
              setQuizAnswers(answers);
              setLeadData(lead);
              navigateTo('results');
            }}
          />
        )}
        {currentPage === 'results' && (
          <ResultsPage
            answers={quizAnswers}
            leadData={leadData}
            onNavigateToPlan={() => navigateTo('plan')}
          />
        )}
        {currentPage === 'plan' && (
          <ActionPlanPage
            answers={quizAnswers}
            onRestart={() => navigateTo('landing')}
          />
        )}
      </React.Suspense>
    );
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans text-[#111318]`}>
      <Navbar currentPage={currentPage} onNavigate={navigateTo} />
      <main className="flex-grow relative">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;