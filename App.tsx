import React, { useState } from 'react';
import { AppState, GeneratedPortfolio, UserInput } from './types';
import { generatePortfolio } from './services/geminiService';
import { InputForm } from './components/InputForm';
import { PortfolioPreview } from './components/PortfolioPreview';
import { Sparkles, AlertCircle, Zap } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.INPUT);
  const [userData, setUserData] = useState<UserInput | null>(null);
  const [generatedData, setGeneratedData] = useState<GeneratedPortfolio | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (data: UserInput) => {
    setError(null);

    // Check for API Key if using premium model features (Image Gen)
    // The service requires the API Key to be available in process.env.API_KEY
    // The aistudio wrapper handles injection.
    try {
      // @ts-ignore
      if (window.aistudio && window.aistudio.hasSelectedApiKey) {
        // @ts-ignore
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
          // @ts-ignore
          await window.aistudio.openSelectKey();
          // We assume success after the dialog closes to prevent race conditions
        }
      }
    } catch (e) {
      console.warn("AI Studio key check failed, proceeding with env key if available", e);
    }

    setUserData(data);
    setAppState(AppState.GENERATING);

    try {
      const result = await generatePortfolio(data);
      setGeneratedData(result);
      setAppState(AppState.PREVIEW);
    } catch (err) {
      console.error(err);
      setError("We encountered an error contacting the AI architect. Please ensure you have selected a valid API Key with billing enabled for Gemini Pro Image models.");
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setAppState(AppState.INPUT);
    setUserData(null);
    setGeneratedData(null);
    setError(null);
  };

  if (appState === AppState.PREVIEW && userData && generatedData) {
    return <PortfolioPreview userData={userData} aiData={generatedData} onReset={handleReset} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden font-sans selection:bg-rust-500/30">
      
      {/* Animated Background Blobs - Updated Colors */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        {/* Blue Blob */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-60 animate-blob"></div>
        {/* Rust Blob */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-rust-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-60 animate-blob animation-delay-2000"></div>
        {/* Honey Blob */}
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-honey-500/15 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob animation-delay-4000"></div>
      </div>

      <header className="relative z-10 w-full p-6 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 to-rust-500 rounded-lg blur opacity-50 group-hover:opacity-100 transition duration-200"></div>
            <div className="relative p-2 bg-slate-900 rounded-lg border border-slate-700">
               <Zap size={24} className="text-white" />
            </div>
          </div>
          <span className="font-display font-bold text-2xl tracking-tight text-white">
            FolioGen<span className="text-rust-500">.ai</span>
          </span>
        </div>
      </header>

      <main className="relative z-10 flex-grow flex flex-col items-center justify-center p-6">
        
        {appState === AppState.INPUT && (
          <div className="w-full">
            <div className="text-center mb-12 max-w-3xl mx-auto animate-fade-in-up">
              <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-md text-brand-300 text-sm font-medium tracking-wide">
                AI-Based Portfolio Generator
              </div>
              <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
                Craft Your <span className="text-gradient">Digital Identity</span><br/> in Seconds
              </h1>
              <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                The ultimate AI-based portfolio generator. Transform raw notes into a stunning, professional website using Google Gemini 2.5 Flash & Nano Banana Pro.
              </p>
            </div>
            
            <InputForm onSubmit={handleFormSubmit} isGenerating={false} />
          </div>
        )}

        {appState === AppState.GENERATING && (
          <div className="text-center space-y-8 animate-fade-in">
            <div className="relative w-40 h-40 mx-auto">
              {/* Spinning rings with new palette */}
              <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-brand-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-4 border-4 border-t-rust-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin animation-delay-2000"></div>
              <div className="absolute inset-8 border-4 border-t-honey-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin animation-delay-4000"></div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                 <Sparkles className="text-white animate-pulse" size={48} />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white tracking-tight">Constructing Identity...</h2>
              <p className="text-slate-400 text-lg">AI is analyzing your profile and generating your portfolio.</p>
            </div>
          </div>
        )}

        {appState === AppState.ERROR && (
          <div className="glass max-w-md w-full border-rust-500/30 p-8 rounded-2xl text-center space-y-6 animate-fade-in">
            <div className="w-20 h-20 bg-rust-500/10 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-10 h-10 text-rust-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Generation Failed</h2>
              <p className="text-slate-400">{error}</p>
            </div>
            <button 
              onClick={() => setAppState(AppState.INPUT)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-medium transition-colors border border-slate-700 hover:border-slate-600"
            >
              Try Again
            </button>
          </div>
        )}

      </main>

      <footer className="relative z-10 py-8 text-center text-slate-500 text-sm font-medium">
        <p>Built with Google Gemini 2.5 Flash & React</p>
      </footer>
    </div>
  );
};

export default App;