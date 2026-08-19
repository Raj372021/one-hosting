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
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Sparkles,
  Search,
  Menu,
  X,
  CreditCard,
  Headphones,
  Workflow,
  Bot,
  Crown
} from 'lucide-react';

interface NavbarProps {
  onOpenCart: () => void;
  onOpenAiAdvisor: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCart, onOpenAiAdvisor }) => {
  const {
    user,
    cart,
    currentView,
    setCurrentView,
    login,
    loginWithGoogle,
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
            {/* 1-CLICK AI AGENT BUILDER BUTTON */}
            <button
              onClick={() => setCurrentView('builder')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md ${
                currentView === 'builder'
                  ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-extrabold shadow-purple-500/30 border border-cyan-400/40'
                  : 'bg-gradient-to-r from-purple-950/70 to-indigo-950/70 text-purple-300 hover:text-white hover:from-purple-900 hover:to-indigo-900 border border-purple-500/30 font-bold'
              }`}
              title="Return to AI Model & Website Builder in 1-Click"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>⚡ AI Agent</span>
            </button>

            <button
              onClick={() => setCurrentView('domains')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
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
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
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
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
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
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                currentView === 'deployments'
                  ? 'bg-emerald-600/20 text-emerald-400 font-bold border border-emerald-500/30 shadow-lg shadow-emerald-500/10'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Rocket className="w-4 h-4 text-emerald-400" />
              <span>Cloud Deploy</span>
            </button>
          </nav>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-3">
          {/* Cart Drawer Trigger */}
          <button
            onClick={onOpenCart}
            className="relative p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="View Cart & Checkout"
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
                    <div
                      onClick={() => {
                        setCurrentView('credits');
                        setIsUserDropdownOpen(false);
                      }}
                      className="mt-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 px-2.5 py-1.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors"
                      title="Click to view and top-up Wallet"
                    >
                      <span className="flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Wallet Balance:</span>
                      </span>
                      <span className="font-bold text-white">{formatPrice(user.walletBalance)}</span>
                    </div>

                    {/* AI Credits Count & Direct Click */}
                    <div
                      onClick={() => {
                        setCurrentView('credits');
                        setIsUserDropdownOpen(false);
                      }}
                      className="mt-1.5 text-xs font-medium text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 px-2.5 py-1.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors"
                      title="Click to buy more AI Credits"
                    >
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>AI Credits:</span>
                      </span>
                      <span className="font-black text-amber-300">{user.aiCredits ?? 100}</span>
                    </div>

                    <button
                      onClick={() => {
                        setCurrentView('credits');
                        setIsUserDropdownOpen(false);
                      }}
                      className="mt-2.5 w-full px-3 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-1.5 transition-all border border-cyan-400/30 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                      <span>Buy AI Credits Pack</span>
                    </button>
                  </div>

                  <button
                    onClick={() => { setCurrentView('dashboard'); setIsUserDropdownOpen(false); }}
                    className="w-full px-3 py-2 rounded-lg text-left text-xs font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                  >
                    <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                    <span>Customer Dashboard</span>
                  </button>

                  <button
                    onClick={() => { setCurrentView('credits'); setIsUserDropdownOpen(false); }}
                    className="w-full px-3 py-2 rounded-lg text-left text-xs font-medium text-amber-300 hover:bg-amber-950/40 flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>AI Credits & Wallet</span>
                  </button>

                  {/* 1-Click AI Agent & Model Builder */}
                  <button
                    onClick={() => { setCurrentView('builder'); setIsUserDropdownOpen(false); }}
                    className="w-full px-3 py-2 rounded-lg text-left text-xs font-bold text-cyan-300 hover:bg-cyan-950/40 flex items-center gap-2 cursor-pointer"
                  >
                    <Bot className="w-4 h-4 text-cyan-400" />
                    <span>⚡ AI Agent & App Builder</span>
                  </button>

                  {/* Admin Command Center inside User Profile dropdown - ONLY for rajsahani.RgcS@gmail.com */}
                  {user?.email?.toLowerCase() === 'rajsahani.rgcs@gmail.com' && (
                    <button
                      onClick={() => { setCurrentView('admin'); setIsUserDropdownOpen(false); }}
                      className="w-full px-3 py-2 rounded-lg text-left text-xs font-bold text-purple-300 hover:bg-purple-950/40 bg-purple-500/10 border border-purple-500/20 flex items-center gap-2 my-1 cursor-pointer"
                    >
                      <Shield className="w-4 h-4 text-purple-400" />
                      <span>🛡️ Super Admin Command Center</span>
                    </button>
                  )}

                  <button
                    onClick={() => { setCurrentView('profile'); setIsUserDropdownOpen(false); }}
                    className="w-full px-3 py-2 rounded-lg text-left text-xs font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                  >
                    <UserIcon className="w-4 h-4 text-cyan-400" />
                    <span>Account Profile & Security</span>
                  </button>

                  <button
                    onClick={() => { setCurrentView('billing'); setIsUserDropdownOpen(false); }}
                    className="w-full px-3 py-2 rounded-lg text-left text-xs font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4 text-indigo-400" />
                    <span>Invoices & GST Billing</span>
                  </button>

                  <button
                    onClick={() => { setCurrentView('tickets'); setIsUserDropdownOpen(false); }}
                    className="w-full px-3 py-2 rounded-lg text-left text-xs font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                  >
                    <Headphones className="w-4 h-4 text-emerald-400" />
                    <span>Support Tickets</span>
                  </button>

                  <div className="border-t border-slate-800 my-1 pt-1 space-y-1">
                    <button
                      onClick={() => {
                        setAuthModalInitialMode('signin');
                        setIsAuthModalOpen(true);
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 rounded-lg text-left text-xs font-medium text-slate-300 hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      <span>Switch Google Account</span>
                    </button>

                    <button
                      onClick={() => { logout(); setIsUserDropdownOpen(false); }}
                      className="w-full px-3 py-2 rounded-lg text-left text-xs font-medium text-rose-400 hover:bg-rose-950/40 flex items-center gap-2 cursor-pointer"
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
              {/* Direct 1-Click Google Sign In Button */}
              <button
                onClick={() => loginWithGoogle('rajsahani.RgcS@gmail.com', 'Raj Sahani')}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                title="1-Click Sign in with Google (rajsahani.RgcS@gmail.com)"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Sign in with Google</span>
              </button>

              <button
                onClick={() => { setAuthModalInitialMode('signin'); setIsAuthModalOpen(true); }}
                className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer hidden sm:block"
              >
                Email Login
              </button>

              <button
                onClick={() => { setAuthModalInitialMode('register'); setIsAuthModalOpen(true); }}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-xs font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
              >
                Sign Up
              </button>

              <button
                onClick={() => loginWithGoogle('rajsahani.RgcS@gmail.com', 'Raj Sahani (Super Admin)', undefined, 'admin')}
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
        <div className="lg:hidden p-4 border-b border-slate-800 bg-slate-950/95 space-y-2 animate-in slide-in-from-top-2 duration-200">
          <button
            onClick={() => { setCurrentView('builder'); setIsMobileMenuOpen(false); }}
            className="w-full p-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-extrabold text-xs flex items-center gap-2.5 shadow-lg shadow-purple-600/30"
          >
            <Bot className="w-4 h-4 text-cyan-300 animate-pulse" />
            <span>⚡ AI Agent & App Builder</span>
          </button>

          <button
            onClick={() => { setCurrentView('domains'); setIsMobileMenuOpen(false); }}
            className="w-full p-2.5 rounded-lg text-left font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-2"
          >
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>Domains Search</span>
          </button>

          <button
            onClick={() => { setCurrentView('hosting'); setIsMobileMenuOpen(false); }}
            className="w-full p-2.5 rounded-lg text-left font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-2"
          >
            <Server className="w-4 h-4 text-indigo-400" />
            <span>Web & Cloud Hosting</span>
          </button>

          <button
            onClick={() => { setCurrentView('n8n'); setIsMobileMenuOpen(false); }}
            className="w-full p-2.5 rounded-lg text-left font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-2"
          >
            <Workflow className="w-4 h-4 text-purple-400" />
            <span>n8n Automations</span>
          </button>

          <button
            onClick={() => { setCurrentView('deployments'); setIsMobileMenuOpen(false); }}
            className="w-full p-2.5 rounded-lg text-left font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-2"
          >
            <Rocket className="w-4 h-4 text-emerald-400" />
            <span>Cloud Deployments</span>
          </button>

          <button
            onClick={() => { setCurrentView('profile'); setIsMobileMenuOpen(false); }}
            className="w-full p-2.5 rounded-lg text-left font-bold text-purple-300 bg-purple-950/40 border border-purple-500/30 hover:bg-purple-950/60 flex items-center gap-2"
          >
            <Shield className="w-4 h-4 text-purple-400" />
            <span>Account Profile & Admin Center</span>
          </button>
          {!user && (
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <button
                onClick={() => {
                  loginWithGoogle('rajsahani.RgcS@gmail.com', 'Raj Sahani');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full p-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center gap-2.5 shadow-md cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Sign in with Google</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
