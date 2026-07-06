import React, { useState, useEffect } from 'react';
import { Expense, Budget, CATEGORIES } from './types';
import ExpenseForm from './components/ExpenseForm';
import BudgetSettings from './components/BudgetSettings';
import ExpenseList from './components/ExpenseList';
import ExpenseCharts from './components/ExpenseCharts';
import FinanceInsights from './components/FinanceInsights';
import AuthScreen from './components/AuthScreen';
import LandingPage from './components/LandingPage';

import { 
  DollarSign, 
  Wallet, 
  Calendar, 
  TrendingUp, 
  ListChecks, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  RefreshCw,
  Plus,
  LogOut,
  User as UserIcon
} from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<any>(() => {
    const stored = localStorage.getItem('wealthwise_local_user');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [currentMonth, setCurrentMonth] = useState<string>('2026-07'); // Default to current workspace month
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [landingViewActive, setLandingViewActive] = useState<boolean>(() => {
    return !localStorage.getItem('wealthwise_local_user');
  });

  // 1. Local Storage Sync / Load (when user is active)
  useEffect(() => {
    if (!user) {
      setExpenses([]);
      setBudgets([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const userKeyPrefix = `wealthwise_${user.uid}`;

    // Load offline expenses for this specific user
    const localExpensesRaw = localStorage.getItem(`${userKeyPrefix}_expenses`);
    let localExpenses: Expense[] = [];
    if (localExpensesRaw) {
      try {
        // Parse and filter out any existing seed demo transactions so the user starts completely fresh
        localExpenses = JSON.parse(localExpensesRaw).filter((e: Expense) => !e.id.startsWith('seed-exp-'));
      } catch (e) {
        console.error("Failed to parse local expenses:", e);
      }
    } else {
      localExpenses = [];
      localStorage.setItem(`${userKeyPrefix}_expenses`, JSON.stringify(localExpenses));
    }
    setExpenses(localExpenses);

    // Load offline budgets for this specific user
    const localBudgetsRaw = localStorage.getItem(`${userKeyPrefix}_budgets`);
    let localBudgets: Budget[] = [];
    if (localBudgetsRaw) {
      try {
        // Parse and filter out any existing seed demo budgets so the user starts completely fresh
        localBudgets = JSON.parse(localBudgetsRaw).filter((b: Budget) => !b.id.startsWith('seed-budget-'));
      } catch (e) {
        console.error("Failed to parse local budgets:", e);
      }
    } else {
      localBudgets = [];
      localStorage.setItem(`${userKeyPrefix}_budgets`, JSON.stringify(localBudgets));
    }
    setBudgets(localBudgets);

    setLoading(false);
  }, [user, currentMonth]);

  // --- Date / Month Navigation ---
  const handlePrevMonth = () => {
    const [year, month] = currentMonth.split('-').map(Number);
    const prevDate = new Date(year, month - 2, 1);
    const prevYearStr = prevDate.getFullYear();
    const prevMonthStr = String(prevDate.getMonth() + 1).padStart(2, '0');
    setCurrentMonth(`${prevYearStr}-${prevMonthStr}`);
  };

  const handleNextMonth = () => {
    const [year, month] = currentMonth.split('-').map(Number);
    const nextDate = new Date(year, month, 1);
    const nextYearStr = nextDate.getFullYear();
    const nextMonthStr = String(nextDate.getMonth() + 1).padStart(2, '0');
    setCurrentMonth(`${nextYearStr}-${nextMonthStr}`);
  };

  const getMonthName = (yearMonthStr: string) => {
    const [year, month] = yearMonthStr.split('-').map(Number);
    const date = new Date(year, month - 1, 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // --- Local Storage Mutation Handlers ---
  const handleAddOrUpdateExpense = async (expenseData: Omit<Expense, 'id' | 'createdAt' | 'userId'>) => {
    if (!user) return;

    const userKeyPrefix = `wealthwise_${user.uid}`;
    const updatedExpenses = [...expenses];

    if (editingExpense) {
      const index = updatedExpenses.findIndex(e => e.id === editingExpense.id);
      if (index !== -1) {
        updatedExpenses[index] = {
          ...editingExpense,
          ...expenseData,
          userId: user.uid,
        };
      }
      setEditingExpense(null);
    } else {
      const newExpense: Expense = {
        ...expenseData,
        id: 'local-exp-' + Date.now(),
        createdAt: Date.now(),
        userId: user.uid,
      };
      updatedExpenses.unshift(newExpense);
    }

    updatedExpenses.sort((a, b) => b.date.localeCompare(a.date));
    setExpenses(updatedExpenses);
    localStorage.setItem(`${userKeyPrefix}_expenses`, JSON.stringify(updatedExpenses));
    setIsFormOpen(false);
  };

  const handleDeleteExpense = async (expenseId: string) => {
    if (window.confirm("Are you sure you want to permanently delete this transaction?")) {
      if (!user) return;
      const userKeyPrefix = `wealthwise_${user.uid}`;
      const updated = expenses.filter(e => e.id !== expenseId);
      setExpenses(updated);
      localStorage.setItem(`${userKeyPrefix}_expenses`, JSON.stringify(updated));
      if (editingExpense?.id === expenseId) {
        setEditingExpense(null);
      }
    }
  };

  const handleSaveBudget = async (budgetData: Omit<Budget, 'id' | 'userId'>) => {
    if (!user) return;

    const userKeyPrefix = `wealthwise_${user.uid}`;
    const newBudget: Budget = {
      ...budgetData,
      id: 'local-budget-' + Date.now(),
      userId: user.uid,
    };
    let updated = [...budgets];
    const existingIdx = updated.findIndex(b => b.month === budgetData.month && b.category === budgetData.category);
    if (existingIdx !== -1) {
      updated[existingIdx] = { ...updated[existingIdx], amount: budgetData.amount };
    } else {
      updated.push(newBudget);
    }
    setBudgets(updated);
    localStorage.setItem(`${userKeyPrefix}_budgets`, JSON.stringify(updated));
  };

  const handleDeleteBudget = async (budgetId: string) => {
    if (!user) return;
    const userKeyPrefix = `wealthwise_${user.uid}`;
    const updated = budgets.filter(b => b.id !== budgetId);
    setBudgets(updated);
    localStorage.setItem(`${userKeyPrefix}_budgets`, JSON.stringify(updated));
  };

  const handleSignOut = async () => {
    localStorage.removeItem('wealthwise_local_user');
    setUser(null);
    setLandingViewActive(true);
  };

  // --- Statistics Calculations ---
  const thisMonthExpenses = expenses.filter(e => e.date.startsWith(currentMonth));
  const totalSpent = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  
  const currentBudgetObj = budgets.find(b => b.month === currentMonth && b.category === 'all');
  const totalBudget = currentBudgetObj ? currentBudgetObj.amount : 0;
  
  const remainingBudget = totalBudget - totalSpent;
  const totalTransactions = thisMonthExpenses.length;

  // 1. Landing Page Homepage Gate
  if (landingViewActive) {
    return (
      <LandingPage 
        onLaunchApp={() => setLandingViewActive(false)} 
        onLaunchLocalSandbox={() => {
          const sandboxUser = {
            uid: 'sandbox-user',
            email: 'sandbox@wealthwise.local',
            isAnonymous: true,
          };
          localStorage.setItem('wealthwise_local_user', JSON.stringify(sandboxUser));
          setUser(sandboxUser);
          setLandingViewActive(false);
        }}
        isLoggedIn={!!user}
        userEmail={user ? user.email : null}
      />
    );
  }

  // 2. Authenticated Gate
  if (!user) {
    return (
      <AuthScreen 
        onUserLogin={(email: string, provider?: string) => {
          const cleanEmail = email.trim();
          const rawId = cleanEmail.toLowerCase().replace(/[^a-z0-9]/g, '_');
          const cleanId = provider ? `${provider}_${rawId}` : rawId;
          const newUser = {
            uid: cleanId,
            email: cleanEmail,
            isAnonymous: false,
          };
          localStorage.setItem('wealthwise_local_user', JSON.stringify(newUser));
          setUser(newUser);
          setLandingViewActive(false);
        }}
        onGuestAccess={() => {
          const guestUser = {
            uid: 'guest-user',
            email: 'guest@wealthwise.local',
            isAnonymous: true,
          };
          localStorage.setItem('wealthwise_local_user', JSON.stringify(guestUser));
          setUser(guestUser);
          setLandingViewActive(false);
        }}
        onBackToLanding={() => setLandingViewActive(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-800 flex flex-col font-sans">
      
      {/* Top Header Navigation */}
      <header id="app-header" className="sticky top-0 z-40 bg-white border-b border-zinc-200 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-sm">
              <TrendingUp size={20} className="stroke-[2.5]" />
            </div>
            <div>
              <h1 className="font-sans font-bold text-zinc-900 tracking-tight text-lg">WealthWise</h1>
              <p className="text-[10px] text-zinc-400 font-semibold tracking-wider uppercase flex items-center gap-1.5">
                <span>Private Local Ledger</span>
                <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
                <span>DB: Local Device</span>
              </p>
            </div>
          </div>

          {/* Controls Alignment Wrapper */}
          <div className="flex flex-wrap items-center gap-4 self-start sm:self-center">
            {/* Month Navigator controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevMonth}
                className="p-2 hover:bg-zinc-100 text-zinc-600 rounded-xl transition-all border border-zinc-200 bg-white shadow-xs cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="px-5 py-2 bg-zinc-900 text-white rounded-xl text-xs font-bold font-mono tracking-wider text-center min-w-[140px] shadow-sm">
                {getMonthName(currentMonth)}
              </div>
              <button
                onClick={handleNextMonth}
                className="p-2 hover:bg-zinc-100 text-zinc-600 rounded-xl transition-all border border-zinc-200 bg-white shadow-xs cursor-pointer"
                title="Next Month"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* User Profile & Sign Out controls */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2 px-3 py-1.5 border rounded-xl bg-emerald-50/70 border-emerald-200/60">
                <UserIcon size={14} className="text-emerald-600" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-extrabold uppercase tracking-wider leading-none text-emerald-500">
                    {user.isAnonymous ? 'Local Sandbox' : 'Private Account'}
                  </span>
                  <span className="text-xs font-bold leading-tight max-w-[140px] truncate text-emerald-800">
                    {user.email || 'Local Device'}
                  </span>
                </div>
              </div>
              
              <button
                onClick={handleSignOut}
                className="p-2 hover:bg-rose-50 text-zinc-500 hover:text-rose-600 rounded-xl border border-zinc-200 hover:border-rose-100 bg-white shadow-xs transition-colors flex items-center justify-center cursor-pointer"
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* Main Content Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 space-y-6">

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <RefreshCw size={32} className="animate-spin text-indigo-600 mb-3" />
            <p className="text-zinc-500 font-medium text-sm">Synchronizing live ledger data...</p>
          </div>
        ) : (
          <>
            {/* 1. Quick Stats Grid - Custom Bento Arrangement */}
            <div id="dashboard-stats-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* This Month's Spending - Styled as a Solid Indigo Premium Stat Card */}
              <div className="bg-indigo-600 p-6 rounded-3xl text-white flex flex-col justify-between shadow-sm min-h-[140px]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-100 block mb-1">
                    Monthly Spending
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-extrabold font-mono tracking-tight">
                      ${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
                <div className="text-[10px] text-indigo-200 font-medium tracking-wide mt-3">
                  Ledger active for {getMonthName(currentMonth)}
                </div>
              </div>

              {/* Set Budget Limit */}
              <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm flex flex-col justify-between min-h-[140px]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-1">
                    Set Budget Limit
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-extrabold font-mono text-zinc-900 tracking-tight">
                      {totalBudget > 0 ? `$${totalBudget.toLocaleString('en-US')}` : 'No Limit'}
                    </span>
                  </div>
                </div>
                {totalBudget > 0 ? (
                  <div className="w-full mt-3">
                    <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          (totalSpent / totalBudget) > 1 ? 'bg-rose-500' : 'bg-indigo-600'
                        }`} 
                        style={{ width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%` }} 
                      />
                    </div>
                    <span className="text-[9px] font-mono text-zinc-500 mt-1 block text-right font-bold">
                      {((totalSpent / totalBudget) * 100).toFixed(0)}% used
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-zinc-400 mt-3 font-medium">
                    Unrestricted spending
                  </span>
                )}
              </div>

              {/* Remaining Balance */}
              <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm flex flex-col justify-between min-h-[140px]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-1">
                    Remaining Budget
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    {totalBudget > 0 ? (
                      <span className={`text-3xl font-extrabold font-mono tracking-tight ${remainingBudget >= 0 ? 'text-indigo-600' : 'text-rose-500'}`}>
                        {remainingBudget < 0 ? '-' : ''}${Math.abs(remainingBudget).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    ) : (
                      <span className="text-3xl font-extrabold font-mono text-zinc-300">N/A</span>
                    )}
                  </div>
                </div>
                <span className="text-xs font-semibold text-zinc-400 mt-3">
                  {totalBudget > 0 
                    ? (remainingBudget >= 0 ? "Under spending limits" : "Limit Exceeded!") 
                    : "No budget targets specified"}
                </span>
              </div>

              {/* Total Transactions */}
              <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm flex flex-col justify-between min-h-[140px]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-1">
                    Transactions Count
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-extrabold font-mono text-zinc-900 tracking-tight">
                      {totalTransactions}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-zinc-400 mt-3">
                  Recorded transactions this month
                </span>
              </div>

            </div>

            {/* 2. Interactive Charts Section */}
            <ExpenseCharts expenses={expenses} budgets={budgets} currentMonth={currentMonth} />

            {/* 3. Action Deck & Main Ledger Forms */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Form Trigger or active forms */}
              <div className="lg:col-span-1 space-y-6">
                
                {/* Form controls/switchers */}
                {!isFormOpen && !editingExpense ? (
                  <button
                    onClick={() => setIsFormOpen(true)}
                    className="w-full py-5 px-6 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-3xl font-sans font-bold text-sm tracking-wide transition-all shadow-sm flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <Plus size={18} className="transition-transform group-hover:rotate-90" />
                    Record An Expense
                  </button>
                ) : (
                  <ExpenseForm
                    onSubmit={handleAddOrUpdateExpense}
                    onCancel={() => {
                      setIsFormOpen(false);
                      setEditingExpense(null);
                    }}
                    editingExpense={editingExpense}
                  />
                )}

                {/* Monthly budgets configurator */}
                <BudgetSettings
                  budgets={budgets}
                  currentMonth={currentMonth}
                  onSaveBudget={handleSaveBudget}
                  onDeleteBudget={handleDeleteBudget}
                />
              </div>

              {/* Center / Right Column: Live ledger items & smart recommendations insights */}
              <div className="lg:col-span-2 space-y-6 flex flex-col justify-between h-full">
                
                {/* Smart financial insights */}
                <FinanceInsights expenses={expenses} budgets={budgets} currentMonth={currentMonth} />

              </div>

            </div>

            {/* 4. Complete Expense list table ledger */}
            <div id="full-ledger-block">
              <ExpenseList
                expenses={expenses}
                onEditExpense={(expense) => {
                  setEditingExpense(expense);
                  setIsFormOpen(false); // Close create form to show edit form
                  // Scroll smoothly to form block
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                onDeleteExpense={handleDeleteExpense}
              />
            </div>
          </>
        )}

      </main>

      {/* Humble simple footer with no margin clutter */}
      <footer className="bg-white border-t border-zinc-200 py-6 px-6 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-400">
          <span>WealthWise &copy; 2026</span>
          <span className="flex items-center gap-1 font-semibold">
            Securely saved & isolated on this local device
          </span>
        </div>
      </footer>

    </div>
  );
}
