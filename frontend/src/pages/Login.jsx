import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { HexagonLogo, MailIcon, LockIcon, EyeIcon, EyeOffIcon, ArrowRightIcon } from '../components/Icons.jsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [clientErrors, setClientErrors] = useState({});

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect onward to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const errors = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      errors.password = 'Password is required.';
    }

    setClientErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await login(email.trim(), password);
      navigate('/dashboard');
    } catch (err) {
      setErrorMessage(err.message || 'Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] relative flex items-center justify-center p-4 sm:p-6 overflow-hidden select-none">
      {/* Ambient background concentric rings */}
      <div className="absolute w-[600px] h-[600px] rounded-full border border-stone-200/40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none -z-10" />
      <div className="absolute w-[900px] h-[900px] rounded-full border border-stone-200/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none -z-10" />

      {/* Decorative Network Node Line Art — Top Right Corner */}
      <div className="absolute -top-12 -right-12 sm:top-6 sm:right-8 pointer-events-none opacity-30 sm:opacity-50 -z-10">
        <svg width="220" height="220" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="160" cy="40" r="5" fill="#0E4D45" />
          <circle cx="90" cy="30" r="4" fill="#D97706" />
          <circle cx="190" cy="110" r="4" fill="#D97706" />
          <circle cx="130" cy="110" r="6" fill="#0E4D45" />
          <circle cx="160" cy="180" r="5" fill="#0D9488" />
          <circle cx="70" cy="130" r="4" fill="#0E4D45" />
          <line x1="90" y1="30" x2="160" y2="40" stroke="#CBD5E1" strokeWidth="1.2" />
          <line x1="160" y1="40" x2="130" y2="110" stroke="#CBD5E1" strokeWidth="1.2" />
          <line x1="160" y1="40" x2="190" y2="110" stroke="#CBD5E1" strokeWidth="1.2" />
          <line x1="130" y1="110" x2="160" y2="180" stroke="#CBD5E1" strokeWidth="1.2" />
          <line x1="130" y1="110" x2="70" y2="130" stroke="#CBD5E1" strokeWidth="1.2" />
          <line x1="90" y1="30" x2="70" y2="130" stroke="#CBD5E1" strokeWidth="1.2" />
        </svg>
      </div>

      {/* Decorative Network Node Line Art — Bottom Left Corner */}
      <div className="absolute -bottom-12 -left-12 sm:bottom-6 sm:left-8 pointer-events-none opacity-30 sm:opacity-50 -z-10">
        <svg width="220" height="220" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="180" r="5" fill="#0E4D45" />
          <circle cx="130" cy="190" r="4" fill="#D97706" />
          <circle cx="30" cy="110" r="4" fill="#D97706" />
          <circle cx="90" cy="110" r="6" fill="#0E4D45" />
          <circle cx="60" cy="40" r="5" fill="#0D9488" />
          <circle cx="150" cy="90" r="4" fill="#0E4D45" />
          <line x1="130" y1="190" x2="60" y2="180" stroke="#CBD5E1" strokeWidth="1.2" />
          <line x1="60" y1="180" x2="90" y2="110" stroke="#CBD5E1" strokeWidth="1.2" />
          <line x1="60" y1="180" x2="30" y2="110" stroke="#CBD5E1" strokeWidth="1.2" />
          <line x1="90" y1="110" x2="60" y2="40" stroke="#CBD5E1" strokeWidth="1.2" />
          <line x1="90" y1="110" x2="150" y2="90" stroke="#CBD5E1" strokeWidth="1.2" />
          <line x1="130" y1="190" x2="150" y2="90" stroke="#CBD5E1" strokeWidth="1.2" />
        </svg>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-[440px] bg-white border border-[#EAE5DC] rounded-3xl p-8 sm:p-10 shadow-2xl shadow-stone-300/40 relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <Link to="/" className="inline-flex items-center gap-2.5 group transition mb-4">
            <HexagonLogo className="w-10 h-10 text-[#0E4D45] transition-transform group-hover:scale-105" />
            <div className="text-left">
              <span className="text-xl font-bold tracking-tight text-[#111827] block leading-none font-sans-ui">
                FraudNet
              </span>
              <span className="text-[10px] font-bold tracking-widest text-[#0E4D45] uppercase block mt-0.5 font-sans-ui">
                TRACKER
              </span>
            </div>
          </Link>

          <h1 className="text-3xl sm:text-[32px] font-serif-heading font-semibold text-[#111827] tracking-tight mt-1">
            Welcome back
          </h1>
          <p className="text-stone-500 text-sm mt-1.5 font-sans-ui">
            Sign in to continue to your account
          </p>

          {/* Decorative Teal/Gold Accent Bar */}
          <div className="flex items-center gap-1.5 mt-3 mb-6">
            <span className="w-8 h-1 rounded-full bg-[#0E4D45]" />
            <span className="w-2.5 h-1 rounded-full bg-[#E5D7B7]" />
          </div>
        </div>

        {/* Global Error Alert */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-medium flex items-center gap-2.5 animate-fadeIn">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Email address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <MailIcon className="w-5 h-5" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (clientErrors.email) setClientErrors({ ...clientErrors, email: '' });
                }}
                placeholder="Enter your email"
                autoComplete="email"
                disabled={isSubmitting}
                className={`w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white border ${
                  clientErrors.email ? 'border-rose-400 ring-1 ring-rose-400' : 'border-[#E2DDD5]'
                } rounded-xl text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:border-[#0E4D45] focus:ring-1 focus:ring-[#0E4D45] transition shadow-xs`}
              />
            </div>
            {clientErrors.email && (
              <p className="text-rose-600 text-xs mt-1 font-medium">{clientErrors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <LockIcon className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (clientErrors.password) setClientErrors({ ...clientErrors, password: '' });
                }}
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={isSubmitting}
                className={`w-full pl-10 pr-11 py-2.5 sm:py-3 bg-white border ${
                  clientErrors.password ? 'border-rose-400 ring-1 ring-rose-400' : 'border-[#E2DDD5]'
                } rounded-xl text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:border-[#0E4D45] focus:ring-1 focus:ring-[#0E4D45] transition shadow-xs`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 focus:outline-none"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
            {clientErrors.password && (
              <p className="text-rose-600 text-xs mt-1 font-medium">{clientErrors.password}</p>
            )}
          </div>

          {/* Sign In CTA Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-[#0E4D45] hover:bg-[#0B3B34] active:bg-[#09302A] text-white text-sm font-semibold rounded-xl transition shadow-md shadow-[#0E4D45]/20 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Secondary Navigation Link */}
        <div className="mt-6 text-center text-xs sm:text-sm text-stone-500 font-sans-ui">
          <span>Don't have an account? </span>
          <Link
            to="/register"
            className="text-[#0E4D45] font-semibold hover:underline hover:text-[#0B3B34] transition"
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
