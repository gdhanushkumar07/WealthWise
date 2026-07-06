export interface Expense {
  id: string;
  userId: string;
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
  description: string;
  createdAt: number;
}

export interface Budget {
  id: string; // Firestore ID
  userId: string;
  category: string; // "all" for global or specific category name
  amount: number;
  month: string; // YYYY-MM
}

export interface Category {
  id: string;
  name: string;
  color: string; // Tailwind color class (e.g., "bg-rose-500", "text-rose-500")
  hexColor: string; // Hex code for recharts or canvas elements
  icon: string; // Lucide icon name
}

export const CATEGORIES: Category[] = [
  { id: 'food', name: 'Food & Dining', color: 'bg-amber-500', hexColor: '#f59e0b', icon: 'Utensils' },
  { id: 'shopping', name: 'Shopping', color: 'bg-blue-500', hexColor: '#3b82f6', icon: 'ShoppingBag' },
  { id: 'housing', name: 'Housing & Rent', color: 'bg-emerald-500', hexColor: '#10b981', icon: 'Home' },
  { id: 'utilities', name: 'Utilities', color: 'bg-yellow-500', hexColor: '#eab308', icon: 'Zap' },
  { id: 'transportation', name: 'Transportation', color: 'bg-indigo-500', hexColor: '#6366f1', icon: 'Car' },
  { id: 'entertainment', name: 'Entertainment', color: 'bg-pink-500', hexColor: '#ec4899', icon: 'Film' },
  { id: 'health', name: 'Health & Medical', color: 'bg-rose-500', hexColor: '#f43f5e', icon: 'HeartPulse' },
  { id: 'education', name: 'Education', color: 'bg-teal-500', hexColor: '#14b8a6', icon: 'BookOpen' },
  { id: 'travel', name: 'Travel', color: 'bg-sky-500', hexColor: '#0ea5e9', icon: 'Plane' },
  { id: 'other', name: 'Other', color: 'bg-slate-500', hexColor: '#64748b', icon: 'Archive' },
];
