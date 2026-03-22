import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  User, 
  Building2, 
  ArrowRight, 
  Sparkles, 
  ChevronRight, 
  History,
  Info,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { SERVICES, categorizeRequest, ServiceCategory } from './services/gemini';
import { Ticket } from './components/Ticket';
import { cn } from './utils';

const AGENCY_NAME = "City Government Center";

export default function App() {
  const [step, setStep] = useState<'welcome' | 'input' | 'confirm' | 'ticket'>('welcome');
  const [userInput, setUserInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestedCategory, setSuggestedCategory] = useState<ServiceCategory | null>(null);
  const [aiReasoning, setAiReasoning] = useState('');
  const [generatedTicket, setGeneratedTicket] = useState<{
    number: string;
    category: string;
    timestamp: Date;
  } | null>(null);

  // Simple local storage for queue numbers (mocking a backend)
  const getNextNumber = (prefix: string) => {
    const key = `queue_${prefix}_${new Date().toDateString()}`;
    const current = parseInt(localStorage.getItem(key) || '100');
    const next = current + 1;
    localStorage.setItem(key, next.toString());
    return `${prefix}-${next}`;
  };

  const handleStart = () => setStep('input');

  const handleAnalyze = async () => {
    if (!userInput.trim()) return;
    
    setIsAnalyzing(true);
    const result = await categorizeRequest(userInput);
    setIsAnalyzing(false);

    const category = SERVICES.find(s => s.id === result.categoryId) || SERVICES[0];
    setSuggestedCategory(category);
    setAiReasoning(result.reasoning);
    setStep('confirm');
  };

  const handleGenerateTicket = (category: ServiceCategory) => {
    const ticket = {
      number: getNextNumber(category.prefix),
      category: category.name,
      timestamp: new Date(),
    };
    setGeneratedTicket(ticket);
    setStep('ticket');
  };

  const reset = () => {
    setStep('welcome');
    setUserInput('');
    setSuggestedCategory(null);
    setAiReasoning('');
    setGeneratedTicket(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="font-bold tracking-tight text-slate-800">{AGENCY_NAME}</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-sm text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Office is Open
            </span>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-20 px-6 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {step === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-8"
            >
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
                  Welcome to the <br />
                  <span className="text-emerald-600">Priority System</span>
                </h1>
                <p className="text-lg text-slate-500 max-w-md mx-auto leading-relaxed">
                  Get your priority number quickly. Just tell us what you need or select a service.
                </p>
              </div>

              <div className="grid gap-4 pt-4">
                <button
                  onClick={handleStart}
                  className="group relative w-full py-6 bg-emerald-600 text-white rounded-2xl font-bold text-xl shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-[0.98]"
                >
                  <span className="flex items-center justify-center gap-3">
                    Get My Number
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
                
                <div className="flex items-center gap-4 py-4">
                  <div className="h-px flex-1 bg-slate-200" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Available Services</span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {SERVICES.slice(0, 4).map((s) => (
                    <div key={s.id} className="p-4 bg-white border border-slate-200 rounded-xl text-left">
                      <p className="text-xs font-bold text-emerald-600 mb-1">{s.prefix}</p>
                      <p className="text-sm font-semibold text-slate-800">{s.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <button 
                  onClick={() => setStep('welcome')}
                  className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1"
                >
                  ← Back
                </button>
                <h2 className="text-3xl font-bold text-slate-900">How can we help you?</h2>
                <p className="text-slate-500">Describe your purpose in simple words. Our AI will guide you to the right lane.</p>
              </div>

              <div className="space-y-4">
                <div className="relative group">
                  <textarea
                    autoFocus
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="e.g., I want to pay my property tax, or I'm a senior citizen needing a new ID..."
                    className="w-full h-40 p-6 bg-white border-2 border-slate-200 rounded-2xl text-lg focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all resize-none placeholder:text-slate-300"
                  />
                  <div className="absolute bottom-4 right-4 flex items-center gap-2 text-xs font-bold text-slate-400">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    AI Assisted
                  </div>
                </div>

                <button
                  disabled={!userInput.trim() || isAnalyzing}
                  onClick={handleAnalyze}
                  className={cn(
                    "w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg",
                    userInput.trim() && !isAnalyzing
                      ? "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  )}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Continue
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <div className="pt-6">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Or select manually</p>
                  <div className="grid gap-2">
                    {SERVICES.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => handleGenerateTicket(s)}
                        className="w-full p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between hover:border-emerald-500 hover:bg-emerald-50 group transition-all"
                      >
                        <div className="text-left">
                          <p className="font-bold text-slate-800 group-hover:text-emerald-700">{s.name}</p>
                          <p className="text-xs text-slate-500">{s.description}</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-emerald-100">
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'confirm' && suggestedCategory && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-emerald-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900">Is this correct?</h2>
                <p className="text-slate-500">Based on your description, we recommend:</p>
              </div>

              <div className="bg-white border-2 border-emerald-500 rounded-3xl p-8 shadow-xl shadow-emerald-100 space-y-6">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Recommended Lane</p>
                  <h3 className="text-2xl font-bold text-slate-900">{suggestedCategory.name}</h3>
                </div>
                
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-sm text-slate-600 italic">"{aiReasoning}"</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleGenerateTicket(suggestedCategory)}
                    className="flex-1 py-4 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all"
                  >
                    Yes, Get Ticket
                  </button>
                  <button
                    onClick={() => setStep('input')}
                    className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all"
                  >
                    No, Change Service
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'ticket' && generatedTicket && (
            <Ticket
              number={generatedTicket.number}
              category={generatedTicket.category}
              timestamp={generatedTicket.timestamp}
              agencyName={AGENCY_NAME}
              onDone={reset}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Footer Info */}
      <footer className="fixed bottom-0 left-0 right-0 p-6 pointer-events-none">
        <div className="max-w-5xl mx-auto flex justify-between items-end">
          <div className="bg-white/80 backdrop-blur-md p-3 rounded-2xl border border-slate-200 shadow-lg pointer-events-auto hidden md:flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
              <Info className="w-5 h-5 text-slate-400" />
            </div>
            <div className="text-xs">
              <p className="font-bold text-slate-800">Need Help?</p>
              <p className="text-slate-500">Approach any staff member for assistance.</p>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-md p-3 rounded-2xl border border-slate-200 shadow-lg pointer-events-auto flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
              <History className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-xs text-right">
              <p className="font-bold text-slate-800">Average Wait</p>
              <p className="text-emerald-600 font-medium">~12 Minutes</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
