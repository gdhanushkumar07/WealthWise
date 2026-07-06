import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Expense, Budget, CATEGORIES } from '../types';
import { Wallet, AlertCircle, TrendingUp } from 'lucide-react';

interface ExpenseChartsProps {
  expenses: Expense[];
  budgets: Budget[];
  currentMonth: string; // YYYY-MM
}

export default function ExpenseCharts({ expenses, budgets, currentMonth }: ExpenseChartsProps) {
  // Filter expenses for current month
  const thisMonthExpenses = expenses.filter(e => e.date.startsWith(currentMonth));

  // 1. Calculate category data
  const categoryTotals = thisMonthExpenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(categoryTotals).map(([catId, amount]) => {
    const category = CATEGORIES.find(c => c.id === catId) || CATEGORIES[CATEGORIES.length - 1];
    return {
      name: category.name,
      value: Number(amount.toFixed(2)),
      color: category.hexColor,
    };
  }).filter(item => item.value > 0);

  // 2. Budget vs Actual data
  const budgetData = budgets
    .filter(b => b.month === currentMonth)
    .map(budget => {
      const actual = thisMonthExpenses
        .filter(e => {
          if (budget.category === 'all') return true;
          // find category ID of the expense or use it directly
          const cat = CATEGORIES.find(c => c.name === e.category || c.id === e.category);
          const budgetCat = CATEGORIES.find(c => c.id === budget.category);
          return cat?.id === budgetCat?.id;
        })
        .reduce((sum, e) => sum + e.amount, 0);

      const categoryName = budget.category === 'all' 
        ? 'Total Budget' 
        : (CATEGORIES.find(c => c.id === budget.category)?.name || budget.category);

      return {
        name: categoryName,
        budget: budget.amount,
        spent: Number(actual.toFixed(2)),
        percentage: budget.amount > 0 ? (actual / budget.amount) * 100 : 0,
      };
    });

  // Sort budgetData so Total is first, or by percentage exceeded
  budgetData.sort((a, b) => (a.name === 'Total Budget' ? -1 : b.name === 'Total Budget' ? 1 : b.percentage - a.percentage));

  // 3. Daily trend data for current month
  const getDaysInMonth = (yearMonthStr: string) => {
    const [year, month] = yearMonthStr.split('-').map(Number);
    return new Date(year, month, 0).getDate();
  };

  const daysCount = getDaysInMonth(currentMonth);
  const dailyData = Array.from({ length: daysCount }, (_, i) => {
    const day = String(i + 1).padStart(2, '0');
    const dateStr = `${currentMonth}-${day}`;
    const amount = thisMonthExpenses
      .filter(e => e.date === dateStr)
      .reduce((sum, e) => sum + e.amount, 0);

    return {
      day: parseInt(day),
      dateStr,
      Amount: Number(amount.toFixed(2)),
    };
  });

  // Custom tooltips
  const CustomTooltipPie = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-800 shadow-xl text-xs font-sans">
          <p className="font-semibold text-slate-200">{payload[0].name}</p>
          <p className="font-mono text-sm font-bold text-emerald-400 mt-1">
            ${payload[0].value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomTooltipBar = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-800 shadow-xl text-xs font-sans">
          <p className="font-semibold text-slate-200">Day {payload[0].payload.day}</p>
          <p className="font-mono text-sm font-bold text-amber-400 mt-1">
            Spent: ${payload[0].value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Category Pie Chart */}
      <div id="chart-category-card" className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm flex flex-col h-[400px]">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <TrendingUp size={18} />
          </div>
          <div>
            <h3 className="font-sans font-bold text-zinc-800 text-sm">Expenses by Category</h3>
            <p className="text-xs text-zinc-500 font-medium">Distribution of this month's spending</p>
          </div>
        </div>

        <div className="flex-1 min-h-0 relative flex items-center justify-center">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltipPie />} />
                <Legend 
                  layout="vertical" 
                  align="right" 
                  verticalAlign="middle" 
                  iconType="circle"
                  iconSize={8}
                  formatter={(value, entry: any) => {
                    const percentStr = entry.payload?.percent 
                      ? ` (${(entry.payload.percent * 100).toFixed(0)}%)` 
                      : '';
                    return (
                      <span className="text-xs font-sans text-zinc-600 font-semibold">
                        {value}{percentStr}
                      </span>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 flex flex-col items-center justify-center h-full">
              <p className="text-zinc-400 text-sm font-semibold">No spending recorded this month</p>
              <p className="text-zinc-300 text-xs mt-1">Add expenses to see the breakdown</p>
            </div>
          )}
        </div>
      </div>

      {/* Daily Spending Trend */}
      <div id="chart-trend-card" className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm flex flex-col h-[400px]">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
            <TrendingUp size={18} />
          </div>
          <div>
            <h3 className="font-sans font-bold text-zinc-800 text-sm">Daily Spending Trend</h3>
            <p className="text-xs text-zinc-500 font-medium">Daily transaction activity during this month</p>
          </div>
        </div>

        <div className="flex-1 min-h-0">
          {thisMonthExpenses.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="day" 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fontSize: 10, fill: '#71717a', fontFamily: 'monospace' }}
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fontSize: 10, fill: '#71717a', fontFamily: 'monospace' }}
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip content={<CustomTooltipBar />} cursor={{ fill: '#f4f4f5', opacity: 0.6 }} />
                <Bar dataKey="Amount" fill="#4f46e5" radius={[4, 4, 0, 0]}>
                  {dailyData.map((entry, index) => {
                    // highlight high spending days with warmer colors
                    let color = '#818cf8'; // dynamic soft blue
                    if (entry.Amount > 150) color = '#f43f5e'; // critical red
                    else if (entry.Amount > 75) color = '#f59e0b'; // warning amber
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 flex flex-col items-center justify-center h-full">
              <p className="text-zinc-400 text-sm font-semibold">No daily data available</p>
              <p className="text-zinc-300 text-xs mt-1">Daily trend details will render once transactions are added</p>
            </div>
          )}
        </div>
      </div>

      {/* Budgets Progress Meter (Full-width block below the row if desired, or can be in dashboard cards) */}
      {budgetData.length > 0 && (
        <div id="budgets-progress-card" className="col-span-1 lg:col-span-2 bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Wallet size={18} />
            </div>
            <div>
              <h3 className="font-sans font-bold text-zinc-800 text-sm">Budget vs. Actual Progress</h3>
              <p className="text-xs text-zinc-500 font-medium">Monitor set budget limits against active expenses</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {budgetData.map((budget, idx) => {
              const isOver = budget.spent > budget.budget;
              const percent = Math.min(budget.percentage, 100);
              
              // Get progress bar color
              let barColor = 'bg-emerald-500';
              if (budget.percentage > 100) barColor = 'bg-rose-500 animate-pulse';
              else if (budget.percentage > 85) barColor = 'bg-amber-500';
              
              return (
                <div key={idx} className="p-4 rounded-2xl border border-zinc-100 bg-zinc-50/50 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-xs font-bold text-zinc-800">{budget.name}</span>
                      {isOver && (
                        <span className="ml-2 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-100">
                          <AlertCircle size={10} /> Over limit
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono font-bold text-zinc-500">
                      {budget.percentage.toFixed(0)}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden mb-2">
                    <div className={`h-full rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${percent}%` }} />
                  </div>

                  <div className="flex justify-between items-center text-[11px] font-mono mt-1 text-zinc-500">
                    <span>Spent: <strong className="text-zinc-700">${budget.spent.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></span>
                    <span>Budget: <strong className="text-zinc-700">${budget.budget.toLocaleString('en-US')}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
