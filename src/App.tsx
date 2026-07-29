import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { InvoicePdfModal } from './components/InvoicePdfModal';
import { AiAdvisorModal } from './components/AiAdvisorModal';
import { LiveChatWidget } from './components/LiveChatWidget';
import { HomePage } from './pages/HomePage';
import { UserDashboard } from './pages/UserDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { InvoiceItem } from './types';

const MainAppContent: React.FC = () => {
  const { currentView } = useAuth();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAiAdvisorOpen, setIsAiAdvisorOpen] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState<InvoiceItem | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white antialiased">
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAiAdvisor={() => setIsAiAdvisorOpen(true)}
      />

      <main className="flex-1">
        {currentView === 'home' && <HomePage />}
        {currentView === 'domains' && <HomePage />}
        {currentView === 'hosting' && <HomePage />}
        {currentView === 'pricing' && <HomePage />}

        {currentView === 'dashboard' && <UserDashboard />}
        {currentView === 'deployments' && <UserDashboard />}
        {currentView === 'billing' && <UserDashboard />}
        {currentView === 'tickets' && <UserDashboard />}

        {currentView === 'admin' && <AdminDashboard />}
      </main>

      <Footer />

      {/* Modals & Floating Drawers */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOpenInvoice={inv => setActiveInvoice(inv)}
      />

      <InvoicePdfModal
        invoice={activeInvoice}
        onClose={() => setActiveInvoice(null)}
      />

      <AiAdvisorModal
        isOpen={isAiAdvisorOpen}
        onClose={() => setIsAiAdvisorOpen(false)}
      />

      <LiveChatWidget />
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <MainAppContent />
      </AuthProvider>
    </ToastProvider>
  );
}
