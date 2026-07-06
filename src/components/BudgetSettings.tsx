import React, { useState } from 'react';
import { Budget, CATEGORIES } from '../types';
import { Plus, Trash2, Wallet, Calendar, AlertCircle, Check, DollarSign } from 'lucide-react';

interface BudgetSettingsProps {
  budgets: Budget[];
  currentMonth: string; // YYYY-MM
  onSaveBudget: (budgetData: Omit<Budget, 'id' | 'userId'>) => void;
  onDeleteBudget: (budgetId: string) => void;
}

export default function BudgetSettings({ budgets, currentMonth, onSaveBudget, onDeleteBudget }: BudgetSettingsProps) {
  const [category, setCategory] = useState<string>('all');
  const [amount, setAmount] = useState<string>('');
  const [month, setMonth] = useState<string>(currentMonth);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const activeBudgets = budgets.filter(b => b.month === month);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a budget amount greater than $0');
      return;
    }

    if (!month) {
      setError('Please select a target month');
      return;
    }

    // Check if budget for this category and month already exists
    const existing = activeBudgets.find(b => b.category === category);
    if (existing) {
      setError(`A budget for ${category === 'all' ? 'Total' : CATEGORIES.find(c => c.id === category)?.name} already exists for ${month}. Please delete it first to set a new limit.`);
      return;
    }

    onSaveBudget({
      category,
      amount: parsedAmount,
      month,
    });

    setAmount('');
    setSuccess('Budget limit saved successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
          <Wallet size={18} />
        </div>
        <div>
          <h3 className="font-sans font-bold text-zinc-800 text-sm">Monthly Budget Targets</h3>
          <p className="text-xs text-zinc-500 font-medium">Set limits for specific categories or overall spending</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-medium flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl text-xs font-medium flex items-center gap-2">
            <Check size={16} />
            <span>{success}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Category */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
              Scope / Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="block w-full py-2 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-xs font-bold"
            >
              <option value="all">Overall (Total Budget)</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
              Limit ($)
            </label>
            <div className="relative rounded-xl shadow-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                <DollarSign size={14} />
              </div>
              <input
                type="number"
                step="1"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="500"
                className="block w-full pl-8 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-800 placeholder-zinc-400 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          {/* Target Month */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
              Target Month
            </label>
            <div className="relative rounded-xl shadow-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                <Calendar size={14} />
              </div>
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="block w-full pl-8 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-800 text-xs font-mono focus:outline-none"
                required
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-sans font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
        >
          <Plus size={14} /> Save Target Limit
        </button>
      </form>

      {/* Active Limits List */}
      <div className="flex-1 overflow-y-auto max-h-[220px] pr-1">
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
          Active Budget Targets ({month})
        </h4>
        {activeBudgets.length > 0 ? (
          <div className="space-y-2">
            {activeBudgets.map((b) => {
              const categoryName = b.category === 'all' 
                ? 'Overall Budget' 
                : (CATEGORIES.find(c => c.id === b.category)?.name || b.category);
              const categoryColor = b.category === 'all'
                ? 'bg-zinc-100 text-zinc-700 font-bold'
                : CATEGORIES.find(c => c.id === b.category)?.color + ' bg-opacity-10 text-zinc-800 font-bold';

              return (
                <div key={b.id} className="flex justify-between items-center p-2.5 rounded-xl border border-zinc-100 bg-zinc-50/50">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`px-2 py-1 rounded-lg text-[10px] truncate ${categoryColor}`}>
                      {categoryName}
                    </span>
                    <span className="text-xs font-mono font-bold text-zinc-600">
                      ${b.amount.toLocaleString('en-US')}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteBudget(b.id)}
                    className="p-1 hover:bg-rose-50 text-zinc-400 hover:text-rose-500 rounded-lg transition-all"
                    title="Delete Budget"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 border border-dashed border-zinc-200 rounded-xl bg-zinc-50/20">
            <p className="text-zinc-400 text-xs font-bold">No budgets defined for {month}</p>
            <p className="text-zinc-300 text-[10px] mt-0.5">Use the inputs above to specify targets</p>
          </div>
        )}
      </div>
    </div>
  );
}
