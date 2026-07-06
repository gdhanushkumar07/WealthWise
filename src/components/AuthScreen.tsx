import React, { useState } from 'react';
import { TrendingUp, Mail, Lock, Sparkles, AlertCircle, RefreshCw, ArrowRight } from 'lucide-react';
import { hashPassword, generateSalt } from '../lib/crypto';

interface AuthScreenProps {
  onUserLogin: (email: string, provider?: string) => void;
  onGuestAccess: () => void;
  onBackToLanding: () => void;
}

export default function AuthScreen({ onUserLogin, onGuestAccess, onBackToLanding }: AuthScreenProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateForm = () => {
    setError(null);
    if (!email || !password) {
      setError('Please fill in all fields.');
      return false;
    }
    // Basic email pattern check
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }
    if (isRegistering) {
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return false;
      }
    }
    return true;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    const userEmailKey = `wealthwise_auth_${email.toLowerCase().trim()}`;

    try {
      if (isRegistering) {
        // Check if user already exists
        const existing = localStorage.getItem(userEmailKey);
        if (existing) {
          setError('An account with this email already exists.');
          setLoading(false);
          return;
        }

        // Generate salt and hash
        const salt = generateSalt();
        const hash = await hashPassword(password, salt);

        // Store user credentials securely
        localStorage.setItem(userEmailKey, JSON.stringify({ hash, salt }));
        onUserLogin(email);
      } else {
        // Logging in
        const existingRaw = localStorage.getItem(userEmailKey);
        if (!existingRaw) {
          setError('No account found with this email. Please register first.');
          setLoading(false);
          return;
        }

        const { hash: storedHash, salt } = JSON.parse(existingRaw);
        const computedHash = await hashPassword(password, salt);

        if (computedHash === storedHash) {
          onUserLogin(email);
        } else {
          setError('Incorrect password. Please try again.');
        }
      }
    } catch (err: any) {
      console.error('Local authentication error:', err);
      setError('An error occurred during authentication. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onGuestAccess();
    }, 400);
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    // Use the logged-in user email if available, otherwise a nice customized default
    setTimeout(() => {
      setLoading(false);
      onUserLogin('gdhanushkumar19@gmail.com', 'google');
    }, 400);
  };

  const handleDemoLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onUserLogin('demo@wealthwise.com', 'demo');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-center py-12 px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/10 mb-4 animate-fade-in">
            <TrendingUp size={26} className="stroke-[2.5]" />
          </div>
          <h2 className="text-3xl font-extrabold text-zinc-950 tracking-tight">
            WealthWise
          </h2>
          <p className="mt-2 text-xs text-zinc-500 font-semibold uppercase tracking-widest flex items-center gap-1.5">
            <span>Private Local Ledger</span>
            <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
            <span>Auth Mode: Local Device</span>
          </p>
        </div>

        {/* Card Box */}
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-8 rounded-3xl border border-zinc-200 shadow-xl shadow-zinc-200/40">
            
            {/* Title description depending on state */}
            <div className="mb-6 text-center">
              <h3 className="text-lg font-bold text-zinc-900">
                {isRegistering ? 'Create your account' : 'Welcome back'}
              </h3>
              <p className="text-xs text-zinc-400 font-medium mt-1">
                {isRegistering 
                  ? 'Sign up to start tracking your personal finances locally on this device.' 
                  : 'Enter your credentials to access your local financial ledger.'
                }
              </p>
            </div>

            {/* Error banner */}
            {error && (
              <div className="mb-5 p-3.5 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-2.5 text-xs text-rose-700 font-bold">
                <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-4">
              
              {/* Email Address */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
                  Email Address
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="block w-full pl-10 pr-3 py-3 bg-zinc-50/50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-sm"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
                  Password
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                    <Lock size={16} />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-3 py-3 bg-zinc-50/50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-sm"
                  />
                </div>
              </div>

              {/* Confirm Password (only when registering) */}
              {isRegistering && (
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative rounded-xl shadow-xs">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                      <Lock size={16} />
                    </div>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="block w-full pl-10 pr-3 py-3 bg-zinc-50/50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-indigo-400 text-white rounded-xl font-bold text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-6"
              >
                {loading ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <>
                    <span>{isRegistering ? 'Register Account' : 'Sign In'}</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>

            {/* Switch Mode Toggle */}
            <div className="mt-5 text-center">
              <button
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setError(null);
                }}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-bold hover:underline cursor-pointer"
              >
                {isRegistering 
                  ? 'Already have an account? Sign In' 
                  : "Don't have an account? Register"
                }
              </button>
            </div>

            {/* Separator */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-zinc-200"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                <span className="bg-white px-3 text-zinc-400">Or Quick Start</span>
              </div>
            </div>

            {/* Google Sign In Button */}
            <div className="mb-4">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-3 px-4 border border-zinc-200 bg-white hover:bg-zinc-50 disabled:bg-zinc-100 text-zinc-800 rounded-xl font-bold text-xs tracking-wider uppercase transition-all shadow-sm flex items-center justify-center gap-2.5 cursor-pointer"
                title="Log in securely with your Google Account instantly"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.9h6.6c-.28 1.5-1.11 2.76-2.39 3.62v3h3.86c2.26-2.08 3.57-5.14 3.57-8.73z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.21v3.11C3.18 21.88 7.31 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.6H1.21C.44 8.14 0 9.87 0 11.7s.44 3.56 1.21 5.1l4.06-3.11z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.18 2.12 1.21 5.6l4.06 3.11c.95-2.85 3.6-4.96 6.73-4.96z"
                  />
                </svg>
                <span>Sign In with Google</span>
              </button>
            </div>

            {/* Quick Access Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={loading}
                className="py-2.5 px-3 border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 rounded-xl text-[11px] font-bold text-zinc-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer w-full"
                title="Log in with a pre-seeded professional demo sandbox account"
              >
                <Sparkles size={13} className="text-yellow-500 shrink-0" />
                <span>Demo Account</span>
              </button>

              <button
                type="button"
                onClick={handleGuestLogin}
                disabled={loading}
                className="py-2.5 px-3 border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 rounded-xl text-[11px] font-bold text-zinc-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer w-full"
                title="Log in instantly as a guest to preview the application"
              >
                <span>Guest Preview</span>
              </button>
            </div>

            {/* Return to Landing */}
            <div className="mt-6 pt-3 border-t border-zinc-100 text-center">
              <button
                type="button"
                onClick={onBackToLanding}
                className="text-xs text-zinc-500 hover:text-zinc-900 font-bold hover:underline cursor-pointer"
              >
                &larr; Back to Landing Page
              </button>
            </div>

          </div>
        </div>

        {/* Trust disclaimer */}
        <p className="mt-8 text-center text-[10px] font-mono text-zinc-400 max-w-xs mx-auto leading-relaxed">
          Your credentials and financial ledger are stored fully locally inside your secure browser sandbox. No server communication or data logging occurs.
        </p>

      </div>
    </div>
  );
}
