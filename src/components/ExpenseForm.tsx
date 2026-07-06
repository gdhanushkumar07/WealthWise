import React, { useState, useEffect } from 'react';
import { Expense, CATEGORIES } from '../types';
import * as Icons from 'lucide-react';
import { Plus, Check, Calendar, DollarSign, Tag, FileText, X } from 'lucide-react';

interface ExpenseFormProps {
  onSubmit: (expenseData: Omit<Expense, 'id' | 'createdAt' | 'userId'>) => void;
  onCancel?: () => void;
  editingExpense?: Expense | null;
}

// Icon renderer helper
const CategoryIcon = ({ name, className }: { name: string; className?: string }) => {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) return <Icons.Archive className={className} />;
  return <IconComponent className={className} />;
};

export default function ExpenseForm({ onSubmit, onCancel, editingExpense }: ExpenseFormProps) {
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>(CATEGORIES[0].id);
  // Default to 2026-07-06 (the provided user time) or fallback to system date
  const [date, setDate] = useState<string>('2026-07-06');
  const [description, setDescription] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (editingExpense) {
      setAmount(editingExpense.amount.toString());
      setCategory(editingExpense.category);
      setDate(editingExpense.date);
      setDescription(editingExpense.description);
    } else {
      setAmount('');
      setCategory(CATEGORIES[0].id);
      setDate('2026-07-06');
      setDescription('');
    }
  }, [editingExpense]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid amount greater than $0');
      return;
    }

    if (!date) {
      setError('Please select a valid transaction date');
      return;
    }

    if (!description.trim()) {
      setError('Please provide a short description or note');
      return;
    }

    onSubmit({
      amount: parsedAmount,
      category,
      date,
      description: description.trim(),
    });

    if (!editingExpense) {
      // Clear form on create
      setAmount('');
      setDescription('');
      setCategory(CATEGORIES[0].id);
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-sans font-bold text-zinc-800 text-base">
          {editingExpense ? 'Edit Transaction' : 'Record New Expense'}
        </h3>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-medium flex items-center gap-2">
            <Icons.AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Amount */}
        <div>
          <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
            Amount ($)
          </label>
          <div className="relative rounded-xl shadow-xs">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
              <DollarSign size={18} className="stroke-[2.5]" />
            </div>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="block w-full pl-10 pr-4 py-3 bg-zinc-50/50 border border-zinc-200 rounded-xl text-zinc-800 placeholder-zinc-400 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-base"
              required
            />
          </div>
        </div>

        {/* Category Picker with elegant Grid Selector */}
        <div>
          <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
            Select Category
          </label>
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-[190px] overflow-y-auto pr-1">
            {CATEGORIES.map((cat) => {
              const isSelected = category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? `${cat.color} bg-opacity-10 border-indigo-500/50 text-zinc-800 font-bold ring-1 ring-indigo-500/10`
                      : 'bg-white border-zinc-100 hover:border-zinc-300 text-zinc-600 hover:bg-zinc-50'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg text-white ${cat.color}`}>
                    <CategoryIcon name={cat.icon} className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] truncate leading-tight font-semibold">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Date */}
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
              Date
            </label>
            <div className="relative rounded-xl shadow-xs">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
                <Calendar size={16} />
              </div>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="block w-full pl-10 pr-4 py-2.5 bg-zinc-50/50 border border-zinc-200 rounded-xl text-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-sm font-mono"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
              Description
            </label>
            <div className="relative rounded-xl shadow-xs">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
                <FileText size={16} />
              </div>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Rent, Dinner, Fuel..."
                className="block w-full pl-10 pr-4 py-2.5 bg-zinc-50/50 border border-zinc-200 rounded-xl text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-sm"
                required
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2.5 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded-xl font-sans font-bold text-xs transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl font-sans font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            {editingExpense ? (
              <>
                <Check size={16} /> Save Changes
              </>
            ) : (
              <>
                <Plus size={16} /> Add Expense
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
