import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from './AuthModal';
import {
  Server,
  Globe,
  Rocket,
  Shield,
  ShoppingCart,
  User as UserIcon,
  Moon,
  Sun,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Sparkles,
  Search,
  Menu,
  X,
  CreditCard,
  Headphones,
  Workflow
} from 'lucide-react';

interface NavbarProps {
  onOpenCart: () => void;
  onOpenAiAdvisor: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCart, onOpenAiAdvisor }) => {
  const {
    user,
    currency,
    setCurrency,
    theme,
    setTheme,
    cart,
    currentView,
    setCurrentView,
    login,
    logout,
    formatPrice
  } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isHostingDropdownOpen, setIsHostingDropdownOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialMode, setAuthModalInitialMode] = useState<'signin' | 'register' | 'forgot'>('signin');

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#05050C]/90 border-b border-white/5 text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-3 group text-left focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              1
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xl tracking-tight text-white">
                  OneHost
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  CLOUD
                </span>
              </div>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-2 text-sm font-medium">
            <button
              onClick={() => setCurrentView('domains')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-2 ${
                currentView === 'domains' || currentView === 'home'
                  ? 'bg-indigo-600/20 text-indigo-400 font-bold border border-indigo-500/30 shadow-lg shadow-indigo-500/10'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>Domain Search</span>
            </button>

            <button
              onClick={() => setCurrentView('hosting')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-2 ${
                currentView === 'hosting'
                  ? 'bg-indigo-600/20 text-indigo-400 font-bold border border-indigo-500/30 shadow-lg shadow-indigo-500/10'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Server className="w-4 h-4 text-indigo-400" />
              <span>Hosting Plans</span>
            </button>

            <button
              onClick={() => setCurrentView('n8n')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-2 ${
                currentView === 'n8n'
                  ? 'bg-purple-600/30 text-purple-300 font-bold border border-purple-500/40 shadow-lg shadow-purple-500/10'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Workflow className="w-4 h-4 text-purple-400" />
              <span>n8n Automations</span>
            </button>

            <button
              onClick={() => setCurrentView('deployments')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-2 ${
                currentView === 'deployments'
                  ? 'bg-emerald-600/20 text-emerald-400 font-bold border border-emerald-500/30 shadow-lg shadow-emerald-500/10'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Rocket className="w-4 h-4 text-emerald-400" />
              <span>Cloud Deploy</span>
            </button>

            <button
              onClick={() => setCurrentView('admin')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-2 ${
                currentView === 'admin'
                  ? 'bg-purple-600/30 text-purple-300 font-bold border border-purple-500/40 shadow-lg shadow-purple-500/10'
                  : 'text-purple-300 hover:text-white hover:bg-purple-950/40 border border-purple-500/20'
              }`}
            >
              <Shield className="w-4 h-4 text-purple-400" />
              <span>Admin Panel</span>
            </button>
          </nav>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-3">
          {/* Currency Switcher */}
          <div className="flex items-center rounded-lg bg-slate-900 border border-slate-800 p-1 text-xs font-semibold">
            <button
              onClick={() => setCurrency('INR')}
              className={`px-2 py-1 rounded-md transition-colors ${
                currency === 'INR' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ₹ INR
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-2 py-1 rounded-md transition-colors ${
                currency === 'USD' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              $ USD
            </button>
          </div>

          {/* Dark / Light Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Toggle Dark/Light Mode"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* Cart Drawer Trigger */}
          <button
            onClick={onOpenCart}
            className="relative p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <ShoppingCart className="w-5 h-5 text-indigo-400" />
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-950 animate-bounce">
                {cart.length}
              </span>
            )}
          </button>

          {/* User Auth Section */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-lg object-cover ring-2 ring-indigo-500/40"
                />
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-white leading-none">{user.name}</div>
                  <div className="text-[10px] text-indigo-400 font-medium">{user.role.toUpperCase()}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* User Dropdown Menu */}
              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 p-2 bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-2xl z-50">
                  <div className="p-3 border-b border-slate-800 mb-1">
                    <div className="font-semibold text-sm text-white">{user.name}</div>
                    <div className="text-xs text-slate-400 truncate">{user.email}</div>
                    <div className="mt-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg flex items-center justify-between">
                      <span>Wallet Balance:</span>
                      <span className="font-bold">{formatPrice(user.walletBalance)}</span>
                    </div>

                    {/* AI Credits Count & Buy Button */}
                    <div className="mt-1.5 text-xs font-medium text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-lg flex items-center justify-between">
                      <span>AI Credits Available:</span>
                      <span className="font-black text-amber-300">{user.aiCredits ?? 100}</span>
                    </div>

                    <button
                      onClick={() => {
                        setCurrentView('billing');
                        setIsUserDropdownOpen(false);
                      }}
                      className="mt-2.5 w-full px-3 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-1.5 transition-all border border-cyan-400/30"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                      <span>Buy AI Credits Pack</span>
                    </button>
                  </div>

                  <button
                    onClick={() => { setCurrentView('dashboard'); setIsUserDropdownOpen(false); }}
                    className="w-full px-3 py-2 rounded-lg text-left text-xs font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                    <span>Customer Dashboard</span>
                  </button>

                  {/* Show Admin Command Center ONLY if user is an admin */}
                  {user.role === 'admin' && (
                    <button
                      onClick={() => { setCurrentView('admin'); setIsUserDropdownOpen(false); }}
                      className="w-full px-3 py-2 rounded-lg text-left text-xs font-medium text-purple-300 hover:bg-purple-950/40 flex items-center gap-2"
                    >
                      <Shield className="w-4 h-4 text-purple-400" />
                      <span>Admin Command Center</span>
                    </button>
                  )}

                  <button
                    onClick={() => { setCurrentView('billing'); setIsUserDropdownOpen(false); }}
                    className="w-full px-3 py-2 rounded-lg text-left text-xs font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-2"
                  >
                    <CreditCard className="w-4 h-4 text-cyan-400" />
                    <span>Invoices & Billing</span>
                  </button>

                  <button
                    onClick={() => { setCurrentView('tickets'); setIsUserDropdownOpen(false); }}
                    className="w-full px-3 py-2 rounded-lg text-left text-xs font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-2"
                  >
                    <Headphones className="w-4 h-4 text-amber-400" />
                    <span>Support Tickets</span>
                  </button>

                  <div className="border-t border-slate-800 my-1 pt-1">
                    <button
                      onClick={() => { logout(); setIsUserDropdownOpen(false); }}
                      className="w-full px-3 py-2 rounded-lg text-left text-xs font-medium text-rose-400 hover:bg-rose-950/40 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setAuthModalInitialMode('signin'); setIsAuthModalOpen(true); }}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-all cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => { setAuthModalInitialMode('register'); setIsAuthModalOpen(true); }}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-xs font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
              >
                Sign Up
              </button>
              <button
                onClick={() => login('admin')}
                className="px-2.5 py-2 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/30 text-[11px] font-semibold text-purple-300 transition-all cursor-pointer hidden md:block"
                title="Super Admin Direct Access"
              >
                Admin
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 lg:hidden"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Auth Modal Component */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalInitialMode}
      />

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden p-4 border-b border-slate-800 bg-slate-950/95 space-y-2">
          <button
            onClick={() => { setCurrentView('hosting'); setIsMobileMenuOpen(false); }}
            className="w-full p-2.5 rounded-lg text-left font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-2"
          >
            <Server className="w-4 h-4 text-indigo-400" />
            <span>Web & Cloud Hosting</span>
          </button>
          <button
            onClick={() => { setCurrentView('domains'); setIsMobileMenuOpen(false); }}
            className="w-full p-2.5 rounded-lg text-left font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-2"
          >
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>Domains</span>
          </button>
          <button
            onClick={() => { setCurrentView('deployments'); setIsMobileMenuOpen(false); }}
            className="w-full p-2.5 rounded-lg text-left font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-2"
          >
            <Rocket className="w-4 h-4 text-emerald-400" />
            <span>Deployments</span>
          </button>
          <button
            onClick={() => { setCurrentView('pricing'); setIsMobileMenuOpen(false); }}
            className="w-full p-2.5 rounded-lg text-left font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-2"
          >
            <CreditCard className="w-4 h-4 text-amber-400" />
            <span>Pricing</span>
          </button>
        </div>
      )}
    </header>
  );
};
