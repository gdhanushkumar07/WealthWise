import React, { useState } from 'react';
import { 
  TrendingUp, 
  ChevronRight, 
  Shield, 
  Zap, 
  Smartphone, 
  Database, 
  Lock, 
  Cpu, 
  Activity, 
  HelpCircle, 
  ChevronDown, 
  ArrowUpRight,
  TrendingDown,
  Sparkles,
  Award
} from 'lucide-react';

interface LandingPageProps {
  onLaunchApp: () => void;
  onLaunchLocalSandbox: () => void;
  isLoggedIn: boolean;
  userEmail: string | null;
}

export default function LandingPage({ onLaunchApp, onLaunchLocalSandbox, isLoggedIn, userEmail }: LandingPageProps) {
  // Interactive Simulator State
  const [monthlyIncome, setMonthlyIncome] = useState<number>(5000);
  const [savingsRate, setSavingsRate] = useState<number>(30);
  
  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Calculations for interactive tool
  const savingsTarget = Math.round(monthlyIncome * (savingsRate / 100));
  const disposableIncome = monthlyIncome - savingsTarget;
  const dailyAllowance = Math.round(disposableIncome / 30);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const faqs = [
    {
      question: "How does the Real-Time Secure Cloud Sync work?",
      answer: "WealthWise uses Google Cloud Firestore with standard user-level cryptographic rules. Your financial ledger can only be accessed by you, authenticated securely through Firebase Auth. Not even site administrators can view your transactions."
    },
    {
      question: "Can I use WealthWise completely offline?",
      answer: "Yes! If you do not want to configure a Firebase project, or prefer absolute data privacy, you can launch the 'Local Sandbox Mode'. This saves 100% of your data locally in your browser's private secure storage. No servers, no sign-ups, no data footprints."
    },
    {
      question: "Are there category-specific budget alerts?",
      answer: "Absolutely. You can set customized budget limits for different categories (e.g. Dining, Utilities, Shopping) or global limits. The application provides dynamic real-time progress bars and color warnings when you approach your cap."
    },
    {
      question: "What is the daily burn rate?",
      answer: "It is an advanced velocity metric that calculates your average spending speed per day for the current month. WealthWise analyzes your transaction patterns and warns you if your current spending velocity will cause you to breach your monthly savings target."
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      
      {/* 1. Center Floating Sticky Navbar */}
      <div className="fixed top-5 left-0 right-0 z-50 px-4">
        <nav className="max-w-4xl mx-auto bg-white/70 backdrop-blur-xl border border-zinc-200/80 rounded-2xl py-3 px-5 flex items-center justify-between shadow-lg shadow-zinc-200/50">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-8 h-8 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-md shadow-indigo-600/10">
              <TrendingUp size={18} className="stroke-[2.5]" />
            </div>
            <span className="font-extrabold text-sm tracking-tight text-zinc-950">WealthWise</span>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => scrollToSection('problem')} className="text-xs font-bold text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer">The Problem</button>
            <button onClick={() => scrollToSection('solution')} className="text-xs font-bold text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer">Our Solution</button>
            <button onClick={() => scrollToSection('features')} className="text-xs font-bold text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer">Features</button>
            <button onClick={() => scrollToSection('technology')} className="text-xs font-bold text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer">Technology</button>
          </div>

          {/* Call To Action */}
          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <button 
                onClick={onLaunchApp}
                className="px-4 py-2 bg-zinc-950 hover:bg-zinc-900 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1 cursor-pointer"
              >
                <span>Go to Dashboard</span>
                <ArrowUpRight size={13} />
              </button>
            ) : (
              <>
                <button 
                  onClick={onLaunchLocalSandbox}
                  className="hidden sm:inline-flex px-3.5 py-2 border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Local Sandbox
                </button>
                <button 
                  onClick={onLaunchApp}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
                >
                  Launch App
                </button>
              </>
            )}
          </div>
        </nav>
      </div>

      {/* 2. Hero Section */}
      <section className="pt-32 pb-20 px-6 max-w-6xl mx-auto flex flex-col items-center text-center relative">
        {/* Background Radial Glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        
        {/* Sparkle Tag */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-zinc-200 bg-white shadow-xs text-[10px] font-bold text-zinc-500 tracking-wider uppercase mb-6 animate-fade-in">
          <Sparkles size={11} className="text-yellow-500" />
          <span>Sovereign Personal Finance Sanctuary</span>
        </div>

        {/* Large Display Typography */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-zinc-950 tracking-tight leading-tight max-w-4xl mb-6">
          Securing your wealth starts with <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">deep clarity.</span>
        </h1>

        {/* Small Elegant Description */}
        <p className="text-sm sm:text-base md:text-lg text-zinc-500 max-w-2xl font-medium leading-relaxed mb-8">
          WealthWise is an intelligent, self-authoritative financial ledger that helps you orchestrate your monthly budgets, analyze spending velocity, and unlock absolute financial sovereignty.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 mb-16">
          <button 
            onClick={onLaunchApp}
            className="w-full sm:w-auto px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm tracking-wide rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Launch Ledger App</span>
            <ChevronRight size={16} />
          </button>
          <button 
            onClick={() => scrollToSection('solution')}
            className="w-full sm:w-auto px-7 py-3.5 bg-white border border-zinc-200 hover:bg-zinc-50 active:bg-zinc-100 text-zinc-700 font-bold text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Try Live Simulator</span>
          </button>
        </div>

        {/* Elegant Product Visualization */}
        <div className="w-full max-w-4xl bg-white border border-zinc-200 rounded-3xl p-4 sm:p-6 shadow-2xl shadow-zinc-200/50 relative overflow-hidden group">
          {/* Top Bar of Mock Browser */}
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-5">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-200"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-200"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-200"></span>
            </div>
            <div className="px-10 py-1 bg-zinc-50 rounded-lg text-[10px] text-zinc-400 font-mono flex items-center gap-1.5">
              <Lock size={10} />
              <span>wealthwise.com/dashboard</span>
            </div>
            <div className="w-4"></div>
          </div>

          {/* Visual Elements */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            {/* Mock Stat Card 1 */}
            <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-2xl">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Total Month Spend</p>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-zinc-950 font-mono">$1,452.80</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                  <TrendingDown size={10} /> 12% under
                </span>
              </div>
            </div>

            {/* Mock Stat Card 2 */}
            <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-2xl">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Assigned Budget</p>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-zinc-950 font-mono">$3,000.00</span>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">Active</span>
              </div>
            </div>

            {/* Mock Stat Card 3 */}
            <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-2xl">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Velocity Limit</p>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-zinc-950 font-mono">$48.42/day</span>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">Safe Speed</span>
              </div>
            </div>
          </div>

          {/* Simulated chart element */}
          <div className="mt-5 p-5 bg-zinc-50 border border-zinc-100 rounded-2xl flex flex-col gap-3 text-left">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-zinc-800">Dynamic Spend Velocity</span>
                <p className="text-[10px] text-zinc-400 font-semibold">Comparing actual accumulation against daily ceiling</p>
              </div>
              <span className="text-[10px] font-bold text-indigo-600 font-mono bg-white px-2.5 py-1 rounded-lg border border-zinc-100">July 2026</span>
            </div>
            {/* Visual representation of lines */}
            <div className="h-28 flex items-end gap-1.5 pt-4">
              <div className="h-[20%] w-full bg-zinc-200 rounded-md"></div>
              <div className="h-[25%] w-full bg-zinc-200 rounded-md"></div>
              <div className="h-[35%] w-full bg-zinc-200 rounded-md"></div>
              <div className="h-[42%] w-full bg-indigo-600/70 rounded-md"></div>
              <div className="h-[38%] w-full bg-indigo-600/70 rounded-md"></div>
              <div className="h-[48%] w-full bg-indigo-600 rounded-md"></div>
              <div className="h-[55%] w-full bg-indigo-600 rounded-md"></div>
              <div className="h-[62%] w-full bg-indigo-600 rounded-md"></div>
              <div className="h-[58%] w-full bg-zinc-200 rounded-md"></div>
              <div className="h-[68%] w-full bg-indigo-600 rounded-md"></div>
              <div className="h-[75%] w-full bg-indigo-600 rounded-md animate-pulse"></div>
            </div>
          </div>

          {/* Floating interactive element overlay */}
          <div className="absolute -bottom-2 -right-2 bg-white border border-zinc-200 rounded-2xl p-3 shadow-xl flex items-center gap-2 transform translate-x-[-15px] translate-y-[-15px] hover:scale-105 transition-transform hidden md:flex">
            <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Sparkles size={14} />
            </div>
            <div>
              <p className="text-[9px] text-zinc-400 font-bold uppercase leading-none">Automated Advice</p>
              <p className="text-[10px] text-zinc-800 font-bold leading-tight mt-0.5">Under budget limit. High saving velocity!</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Problem Section */}
      <section id="problem" className="py-20 bg-zinc-100/50 border-y border-zinc-200/60 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">The Challenge</h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
              Why traditional expense tracking fails
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 font-medium max-w-xl mx-auto mt-2">
              Writing down digits on basic spreadsheets or bloated trackers creates secondary challenges that harm your financial peace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Challenge 1 */}
            <div className="bg-white border border-zinc-200 p-6 rounded-2xl shadow-xs">
              <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-4">
                <Shield size={20} />
              </div>
              <h4 className="text-sm font-bold text-zinc-900 mb-1.5">No Real Privacy</h4>
              <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                Most popular financial apps sell your aggregated spending habits to advertising corporations, turning your data into a product.
              </p>
            </div>

            {/* Challenge 2 */}
            <div className="bg-white border border-zinc-200 p-6 rounded-2xl shadow-xs">
              <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4">
                <Database size={20} />
              </div>
              <h4 className="text-sm font-bold text-zinc-900 mb-1.5">Siloed & Fragmented</h4>
              <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                Manually pasting amounts into random notes leads to zero organization, missing categories, and lost historical perspectives.
              </p>
            </div>

            {/* Challenge 3 */}
            <div className="bg-white border border-zinc-200 p-6 rounded-2xl shadow-xs">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Activity size={20} />
              </div>
              <h4 className="text-sm font-bold text-zinc-900 mb-1.5">Lack of Real Guidance</h4>
              <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                Static historic charts only tell you how you failed *last* month, rather than calculating active daily burn speed to guide you *now*.
              </p>
            </div>
          </div>

          {/* Quick Stat Highlight */}
          <div className="mt-12 bg-zinc-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-indigo-400 text-xs font-extrabold uppercase tracking-widest mb-1">Financial Friction</p>
              <h4 className="text-lg sm:text-xl font-bold max-w-lg leading-snug">
                Over 64% of people fail their budgets because logging is tedious or lacks immediate tactical feedback.
              </h4>
            </div>
            <div className="flex gap-8 shrink-0">
              <div className="text-center">
                <p className="text-2xl font-black text-indigo-400 font-mono">64%</p>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-0.5">Abandon Rate</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-indigo-400 font-mono">&lt; 3s</p>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-0.5">Interaction Time</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Interactive Budget Simulator */}
      <section id="solution" className="py-20 px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-5">
            <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest mb-2 block">Live Playground</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight leading-tight mb-4">
              Determine your daily allowance speed
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 font-medium leading-relaxed mb-6">
              Adjust the values to instantly see your disposable savings targets. WealthWise translates abstract monthly numbers into a clear, tactical daily spend speed limit.
            </p>

            {/* Simulated feedback badge */}
            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-start gap-3">
              <Sparkles size={18} className="text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-indigo-950">Intelligent Burn Ceiling</p>
                <p className="text-[11px] text-indigo-700 font-medium mt-0.5">By limiting spending to <strong className="font-bold">${dailyAllowance}/day</strong>, you comfortably hit your <strong className="font-bold">${savingsTarget}</strong> monthly saving cap.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-xl shadow-zinc-200/30">
            <h4 className="text-sm font-bold text-zinc-900 mb-6 flex items-center gap-2 border-b border-zinc-100 pb-4">
              <Award size={16} className="text-indigo-600" />
              <span>Sovereignty Simulator</span>
            </h4>

            <div className="space-y-6">
              {/* Slider 1: Income */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-zinc-600">Monthly Net Income</label>
                  <span className="text-sm font-black font-mono text-zinc-950">${monthlyIncome.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="1000" 
                  max="20000" 
                  step="500"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                  className="w-full h-1.5 bg-zinc-100 accent-indigo-600 rounded-lg cursor-pointer"
                />
              </div>

              {/* Slider 2: Savings Rate */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-zinc-600">Target Savings Rate</label>
                  <span className="text-sm font-black font-mono text-indigo-600">{savingsRate}%</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="80" 
                  step="5"
                  value={savingsRate}
                  onChange={(e) => setSavingsRate(Number(e.target.value))}
                  className="w-full h-1.5 bg-zinc-100 accent-indigo-600 rounded-lg cursor-pointer"
                />
              </div>

              {/* Dynamic Outcomes Grid */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-zinc-100">
                <div className="text-center">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Monthly Savings</p>
                  <p className="text-lg font-black font-mono text-zinc-950">${savingsTarget}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Spend Budget</p>
                  <p className="text-lg font-black font-mono text-zinc-950">${disposableIncome}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">Daily Cap</p>
                  <p className="text-lg font-black font-mono text-indigo-600">${dailyAllowance}</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 5. Features Section */}
      <section id="features" className="py-20 bg-zinc-100/50 border-t border-zinc-200/60 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2 block">Interactive Capabilities</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
              Designed for visual precision and absolute security
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 font-medium max-w-xl mx-auto mt-2">
              WealthWise combines elegant structural interfaces with durable cloud persistence so your ledger remains private, organized, and beautifully legible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1 */}
            <div className="bg-white border border-zinc-200 p-5 rounded-2xl shadow-xs hover:shadow-md hover:border-zinc-300 transition-all">
              <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
                <Lock size={18} />
              </div>
              <h4 className="text-xs font-extrabold text-zinc-950 uppercase tracking-wider mb-1.5">Secure Cloud Auth</h4>
              <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                Access your database from any device. Encrypted passwords and isolated schemas shield transactions from unauthorized visibility.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-zinc-200 p-5 rounded-2xl shadow-xs hover:shadow-md hover:border-zinc-300 transition-all">
              <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
                <Database size={18} />
              </div>
              <h4 className="text-xs font-extrabold text-zinc-950 uppercase tracking-wider mb-1.5">Firestore Sync</h4>
              <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                Durable document-level state updates instantly. Your records are persistent, avoiding the fragility of local-only storage cache clearing.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-zinc-200 p-5 rounded-2xl shadow-xs hover:shadow-md hover:border-zinc-300 transition-all">
              <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
                <Zap size={18} />
              </div>
              <h4 className="text-xs font-extrabold text-zinc-950 uppercase tracking-wider mb-1.5">Category Budgets</h4>
              <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                Enforce budget limits by category. Elegant progress tracks and alerts warn you prior to exceeding targets.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white border border-zinc-200 p-5 rounded-2xl shadow-xs hover:shadow-md hover:border-zinc-300 transition-all">
              <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
                <Activity size={18} />
              </div>
              <h4 className="text-xs font-extrabold text-zinc-950 uppercase tracking-wider mb-1.5">Velocity Analytics</h4>
              <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                Calculates and graphs daily burn rate against targets, warning you when velocity is too high for safe navigation.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Technology Section */}
      <section id="technology" className="py-20 px-6 max-w-5xl mx-auto">
        <div className="border border-zinc-200 rounded-3xl p-6 sm:p-10 bg-white shadow-xl shadow-zinc-200/20 relative overflow-hidden">
          {/* Radial light */}
          <div className="absolute -top-20 -right-20 w-[300px] h-[300px] bg-indigo-600/5 rounded-full blur-2xl pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2 block">Sovereign Architecture</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight leading-tight mb-4">
                Powered by a world-class technology stack
              </h3>
              <p className="text-xs sm:text-sm text-zinc-500 font-medium leading-relaxed mb-6">
                WealthWise is structured as a robust client-first Single Page Application with absolute database isolation, instant rendering speeds, and strict type safety.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 mt-1.5"></div>
                  <div>
                    <strong className="text-xs font-bold text-zinc-800 block">React 18 & Vite</strong>
                    <span className="text-[11px] text-zinc-500 font-medium">Ultra-fast hot boots and instant interface updates.</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 mt-1.5"></div>
                  <div>
                    <strong className="text-xs font-bold text-zinc-800 block">Cloud Firestore</strong>
                    <span className="text-[11px] text-zinc-500 font-medium">Real-time reactive subscription state with offline support.</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 mt-1.5"></div>
                  <div>
                    <strong className="text-xs font-bold text-zinc-800 block">Firebase Auth</strong>
                    <span className="text-[11px] text-zinc-500 font-medium">Industry-standard secure user isolation protocols.</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 mt-1.5"></div>
                  <div>
                    <strong className="text-xs font-bold text-zinc-800 block">TypeScript Type-Safety</strong>
                    <span className="text-[11px] text-zinc-500 font-medium">Robust data-schema validation to prevent transaction state corruption.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-5 bg-zinc-50 border border-zinc-100 p-6 rounded-2xl">
              <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-widest mb-4 flex items-center gap-1.5 border-b border-zinc-200/60 pb-3">
                <Cpu size={14} className="text-zinc-500" />
                <span>Core Ecosystem Spec</span>
              </h4>
              <ul className="space-y-3.5 font-mono text-xs">
                <li className="flex justify-between items-center text-zinc-500">
                  <span>Runtime Client:</span>
                  <strong className="font-bold text-zinc-800">React + TS</strong>
                </li>
                <li className="flex justify-between items-center text-zinc-500">
                  <span>Storage Engine:</span>
                  <strong className="font-bold text-zinc-800">Firestore v9</strong>
                </li>
                <li className="flex justify-between items-center text-zinc-500">
                  <span>Auth Mechanism:</span>
                  <strong className="font-bold text-zinc-800">Firebase Auth</strong>
                </li>
                <li className="flex justify-between items-center text-zinc-500">
                  <span>Graph Renderer:</span>
                  <strong className="font-bold text-zinc-800">Recharts</strong>
                </li>
                <li className="flex justify-between items-center text-zinc-500">
                  <span>Style Standard:</span>
                  <strong className="font-bold text-zinc-800">Tailwind CSS</strong>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQs */}
      <section className="py-20 bg-zinc-100/50 border-t border-zinc-200/60 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2 block">Common Inquiries</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white border border-zinc-200 rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full py-4.5 px-5 flex items-center justify-between text-left font-bold text-sm text-zinc-900 cursor-pointer hover:bg-zinc-50/50"
                >
                  <span>{faq.question}</span>
                  <ChevronDown 
                    size={16} 
                    className={`text-zinc-500 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`} 
                  />
                </button>
                {openFaq === index && (
                  <div className="px-5 pb-5 pt-1 border-t border-zinc-100">
                    <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Call To Action Footer Card */}
      <section className="py-20 px-6 max-w-4xl mx-auto text-center">
        <div className="bg-indigo-600 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl shadow-indigo-600/10">
          {/* Accent light decoration */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl pointer-events-none" />

          <h3 className="text-3xl font-extrabold tracking-tight mb-4 text-white">
            Take command of your wealth today.
          </h3>
          <p className="text-indigo-100 text-sm max-w-lg mx-auto font-medium mb-8">
            Access absolute data transparency and elegant budgeting controls. Register an encrypted cloud ledger, or preview instantly.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={onLaunchApp}
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-indigo-600 hover:bg-zinc-100 font-bold text-xs tracking-wider uppercase rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Launch Ledger App</span>
              <ChevronRight size={14} className="stroke-[2.5]" />
            </button>
            <button
              onClick={onLaunchLocalSandbox}
              className="w-full sm:w-auto px-8 py-3.5 bg-indigo-700 hover:bg-indigo-800 text-white border border-indigo-500 font-bold text-xs tracking-wider uppercase rounded-xl transition-all cursor-pointer"
            >
              Start Local Sandbox
            </button>
          </div>
        </div>

        {/* Brand sign-off */}
        <p className="mt-16 text-[11px] font-mono text-zinc-400">
          &copy; 2026 WealthWise. All data isolated, secured and private.
        </p>
      </section>

    </div>
  );
}
