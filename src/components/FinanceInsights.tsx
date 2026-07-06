import React from 'react';
import { Expense, Budget, CATEGORIES } from '../types';
import { BrainCircuit, AlertTriangle, Lightbulb, Sparkles, TrendingDown, DollarSign } from 'lucide-react';

interface FinanceInsightsProps {
  expenses: Expense[];
  budgets: Budget[];
  currentMonth: string; // YYYY-MM
}

export default function FinanceInsights({ expenses, budgets, currentMonth }: FinanceInsightsProps) {
  const thisMonthExpenses = expenses.filter(e => e.date.startsWith(currentMonth));
  
  // Calculations
  const totalSpent = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalBudgetObj = budgets.find(b => b.month === currentMonth && b.category === 'all');
  const totalBudget = totalBudgetObj ? totalBudgetObj.amount : 0;

  // 1. Calculate category counts and amounts
  const categoryStats = thisMonthExpenses.reduce((acc, exp) => {
    if (!acc[exp.category]) {
      acc[exp.category] = { amount: 0, count: 0 };
    }
    acc[exp.category].amount += exp.amount;
    acc[exp.category].count += 1;
    return acc;
  }, {} as Record<string, { amount: number; count: number }>);

  // Find top category by amount
  let topCategoryAmount = 0;
  let topCategoryId = '';
  let highestSingleExpense: Expense | null = null;

  thisMonthExpenses.forEach(exp => {
    if (!highestSingleExpense || exp.amount > highestSingleExpense.amount) {
      highestSingleExpense = exp;
    }
  });

  Object.entries(categoryStats).forEach(([catId, stats]) => {
    if (stats.amount > topCategoryAmount) {
      topCategoryAmount = stats.amount;
      topCategoryId = catId;
    }
  });

  const topCategoryName = topCategoryId 
    ? (CATEGORIES.find(c => c.id === topCategoryId)?.name || topCategoryId)
    : '';

  // 2. Budget status
  const budgetAlerts: string[] = [];
  let isOverallOverBudget = false;

  if (totalBudget > 0) {
    const percent = (totalSpent / totalBudget) * 100;
    if (percent > 100) {
      isOverallOverBudget = true;
      budgetAlerts.push(`You have exceeded your total monthly budget of $${totalBudget.toLocaleString()} by $${(totalSpent - totalBudget).toFixed(2)}.`);
    } else if (percent > 85) {
      budgetAlerts.push(`Heads up! You have utilized ${percent.toFixed(0)}% of your total monthly budget ($${totalSpent.toFixed(0)} / $${totalBudget}).`);
    }
  }

  // Category specific budget check
  budgets
    .filter(b => b.month === currentMonth && b.category !== 'all')
    .forEach(budget => {
      const catSpent = thisMonthExpenses
        .filter(e => e.category === budget.category)
        .reduce((sum, e) => sum + e.amount, 0);

      if (catSpent > budget.amount) {
        const catName = CATEGORIES.find(c => c.id === budget.category)?.name || budget.category;
        budgetAlerts.push(`Your spending in '${catName}' ($${catSpent.toFixed(0)}) has exceeded your limit of $${budget.amount}.`);
      }
    });

  // 3. Dynamic savings tips based on category
  const getSavingsTip = (catId: string) => {
    switch (catId) {
      case 'food':
        return "Food & Dining is your top spending category. Try meal prepping on weekends or setting a weekly restaurant allowance to keep this in check.";
      case 'shopping':
        return "Shopping is high this month. Consider adopting the 24-hour rule: wait a full day before buying non-essential items to curb impulse spending.";
      case 'housing':
        return "Housing costs form a major part of your expenses. While hard to reduce immediately, keep utilities optimized to lower household bills.";
      case 'utilities':
        return "Utilities are higher. Small adjustments like energy-efficient bulbs, smart thermostat settings, or unplugging idle electronics can add up.";
      case 'transportation':
        return "Transportation cost is up. Consider carpooling, combining errands, or checking public transport rates for regular commutes.";
      case 'entertainment':
        return "Entertainment is high. Explore free local events, look for streaming bundle discounts, or host a game night at home instead of going out.";
      case 'travel':
        return "Travel is a significant cost. Plan trips off-season, book at least 6 weeks in advance, and track flight promotions to save.";
      case 'health':
        return "Health & Medical costs are higher. Ensure you are maximizing insurance benefits and check if your employer offers wellness rebates.";
      default:
        return "Track your small daily expenses. Subscriptions and minor purchases ('coffee effect') can quietly accumulate over time.";
    }
  };

  const currentTip = topCategoryId ? getSavingsTip(topCategoryId) : "A stable budget is built on consistent daily tracking. Categorize your expenses immediately to gain clear visibility.";

  // 4. Run-rate / Daily average
  const today = new Date('2026-07-06');
  const elapsedDays = today.getDate();
  const dailyAverage = elapsedDays > 0 ? (totalSpent / elapsedDays) : totalSpent;

  return (
    <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <BrainCircuit size={18} />
          </div>
          <div>
            <h3 className="font-sans font-bold text-zinc-800 text-sm">Smart Financial Insights</h3>
            <p className="text-xs text-zinc-500 font-medium">Automated patterns and actions from your ledger</p>
          </div>
        </div>

        {/* Budget Alerts section */}
        {budgetAlerts.length > 0 ? (
          <div className="space-y-2 mb-4">
            {budgetAlerts.map((alert, i) => (
              <div key={i} className="p-3 bg-amber-50 border border-amber-100/50 rounded-xl flex items-start gap-2.5 text-xs text-amber-800 font-bold">
                <AlertTriangle size={15} className="mt-0.5 shrink-0 text-amber-600" />
                <span>{alert}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-3 bg-emerald-50 border border-emerald-100/50 rounded-xl flex items-start gap-2.5 text-xs text-emerald-800 font-bold mb-4">
            <Sparkles size={15} className="mt-0.5 shrink-0 text-emerald-600" />
            <span>All spending ranges are currently within your target thresholds. Excellent job tracking your limits!</span>
          </div>
        )}

        {/* Core Stats Overview */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Daily average */}
          <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-100 flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Daily Average</span>
            <span className="text-sm font-mono font-bold text-zinc-800 mt-1">
              ${dailyAverage.toFixed(2)}
            </span>
            <span className="text-[9px] text-zinc-400 mt-0.5 font-semibold">Based on {elapsedDays} days elapsed</span>
          </div>

          {/* Highest Single Expense */}
          <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-100 flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Highest Spend</span>
            {highestSingleExpense ? (
              <>
                <span className="text-sm font-mono font-bold text-zinc-800 mt-1 truncate">
                  ${(highestSingleExpense as Expense).amount.toLocaleString('en-US')}
                </span>
                <span className="text-[9px] text-zinc-400 mt-0.5 truncate font-semibold">
                  {(highestSingleExpense as Expense).description}
                </span>
              </>
            ) : (
              <>
                <span className="text-sm font-mono font-bold text-zinc-300 mt-1">N/A</span>
                <span className="text-[9px] text-zinc-400 mt-0.5 font-semibold">No entries recorded</span>
              </>
            )}
          </div>
        </div>

        {/* Dynamic Highlight Card */}
        {topCategoryName && (
          <div className="p-3.5 rounded-2xl border border-indigo-50 bg-indigo-50/20 mb-4 flex flex-col">
            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">Top Spending Category</span>
            <div className="flex justify-between items-baseline mt-1">
              <span className="text-sm font-bold text-zinc-800">{topCategoryName}</span>
              <span className="text-sm font-mono font-bold text-indigo-600">${topCategoryAmount.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
            </div>
          </div>
        )}
      </div>

      {/* Savings Recommendation Tip Card */}
      <div className="p-4 rounded-2xl bg-zinc-900 text-white flex gap-3 shadow-sm mt-2">
        <Lightbulb size={20} className="text-yellow-400 shrink-0 mt-0.5" />
        <div className="flex flex-col">
          <span className="text-[10px] font-bold tracking-wide uppercase text-zinc-400">Savings Tip</span>
          <p className="text-xs text-zinc-300 mt-1 leading-relaxed font-semibold">{currentTip}</p>
        </div>
      </div>
    </div>
  );
}
