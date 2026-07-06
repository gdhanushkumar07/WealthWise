import React, { useState } from 'react';
import { Expense, CATEGORIES } from '../types';
import * as Icons from 'lucide-react';
import { Search, Filter, Trash2, Edit3, ArrowUpDown, RefreshCw, Calendar, Tag } from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (expenseId: string) => void;
}

const CategoryIcon = ({ name, className }: { name: string; className?: string }) => {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) return <Icons.Archive className={className} />;
  return <IconComponent className={className} />;
};

type SortKey = 'date' | 'amount';
type SortOrder = 'asc' | 'desc';

export default function ExpenseList({ expenses, onEditExpense, onDeleteExpense }: ExpenseListProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // 1. Filter expenses
  const filteredExpenses = expenses.filter((exp) => {
    const matchesSearch = exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (CATEGORIES.find(c => c.id === exp.category)?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || exp.category === selectedCategory;
    
    const matchesStartDate = !startDate || exp.date >= startDate;
    const matchesEndDate = !endDate || exp.date <= endDate;

    return matchesSearch && matchesCategory && matchesStartDate && matchesEndDate;
  });

  // 2. Sort expenses
  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    if (sortKey === 'date') {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    } else {
      return sortOrder === 'desc' ? b.amount - a.amount : a.amount - b.amount;
    }
  });

  // Toggle sort direction
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  // Reset all filters
  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setStartDate('');
    setEndDate('');
    setSortKey('date');
    setSortOrder('desc');
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-sans font-bold text-zinc-800 text-base">Transaction Ledger</h3>
          <p className="text-xs text-zinc-500 font-medium">Search, filter, and modify recorded expenses</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 rounded-xl text-xs font-bold text-zinc-600 transition-colors cursor-pointer"
          >
            <RefreshCw size={13} /> Reset Filters
          </button>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5 p-4 rounded-2xl border border-zinc-100 bg-zinc-50/40">
        {/* Search */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
            Search Notes
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
              <Search size={14} />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by keyword..."
              className="block w-full pl-8 pr-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-700 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
            Category
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
              <Tag size={14} />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full pl-8 pr-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-700 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
            From Date
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
              <Calendar size={14} />
            </div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="block w-full pl-8 pr-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-700 font-bold font-mono focus:outline-none"
            />
          </div>
        </div>

        {/* End Date */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
            To Date
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
              <Calendar size={14} />
            </div>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="block w-full pl-8 pr-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-700 font-bold font-mono focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Transaction Table / List */}
      <div className="overflow-x-auto rounded-2xl border border-zinc-200">
        <table className="min-w-full divide-y divide-zinc-200 text-left text-sm font-sans">
          <thead className="bg-zinc-50 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            <tr>
              <th scope="col" className="px-5 py-3 cursor-pointer select-none hover:bg-zinc-100 hover:text-zinc-700 transition-colors" onClick={() => handleSort('date')}>
                <span className="flex items-center gap-1">
                  Date
                  <ArrowUpDown size={11} className={sortKey === 'date' ? 'text-zinc-600' : 'text-zinc-400'} />
                </span>
              </th>
              <th scope="col" className="px-5 py-3">Category</th>
              <th scope="col" className="px-5 py-3">Description</th>
              <th scope="col" className="px-5 py-3 cursor-pointer select-none hover:bg-zinc-100 hover:text-zinc-700 transition-colors" onClick={() => handleSort('amount')}>
                <span className="flex items-center gap-1">
                  Amount
                  <ArrowUpDown size={11} className={sortKey === 'amount' ? 'text-zinc-600' : 'text-zinc-400'} />
                </span>
              </th>
              <th scope="col" className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 bg-white">
            {sortedExpenses.length > 0 ? (
              sortedExpenses.map((exp) => {
                const categoryData = CATEGORIES.find((c) => c.id === exp.category) || CATEGORIES[CATEGORIES.length - 1];

                return (
                  <tr key={exp.id} className="hover:bg-zinc-50/50 group transition-colors">
                    {/* Date */}
                    <td className="whitespace-nowrap px-5 py-4 font-mono text-xs text-zinc-500 font-semibold">
                      {exp.date}
                    </td>

                    {/* Category tag */}
                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg text-white ${categoryData.color}`}>
                          <CategoryIcon name={categoryData.icon} className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-bold text-zinc-800 text-xs">
                          {categoryData.name}
                        </span>
                      </div>
                    </td>

                    {/* Description */}
                    <td className="px-5 py-4 text-zinc-600 font-semibold max-w-[200px] truncate" title={exp.description}>
                      {exp.description}
                    </td>

                    {/* Amount */}
                    <td className="whitespace-nowrap px-5 py-4 font-mono text-sm font-bold text-zinc-900">
                      ${exp.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    {/* Actions */}
                    <td className="whitespace-nowrap px-5 py-4 text-right text-xs">
                      <div className="flex justify-end gap-1.5 opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEditExpense(exp)}
                          className="p-1.5 hover:bg-indigo-50 text-zinc-400 hover:text-indigo-600 rounded-lg transition-all"
                          title="Edit Transaction"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => onDeleteExpense(exp.id)}
                          className="p-1.5 hover:bg-rose-50 text-zinc-400 hover:text-rose-600 rounded-lg transition-all"
                          title="Delete Transaction"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-zinc-400 text-sm font-bold">No transactions found</p>
                    <p className="text-zinc-300 text-xs mt-0.5 font-semibold">Try widening search criteria or reset filter values</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Transaction counter / status */}
      <div className="flex justify-between items-center text-[11px] font-mono text-zinc-400 mt-4 font-semibold">
        <span>Showing {filteredExpenses.length} of {expenses.length} records</span>
        {filteredExpenses.length > 0 && (
          <span>Total filter spend: <strong>${filteredExpenses.reduce((s, e) => s + e.amount, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></span>
        )}
      </div>
    </div>
  );
}
