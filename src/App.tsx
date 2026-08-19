import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { MarginProvider } from './context/MarginContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { InvoicePdfModal } from './components/InvoicePdfModal';
import { AiAdvisorModal } from './components/AiAdvisorModal';
import { LiveChatWidget } from './components/LiveChatWidget';
import { HomePage } from './pages/HomePage';
import { UserDashboard } from './pages/UserDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { RefundPage } from './pages/RefundPage';
import { AboutPage } from './pages/AboutPage';
import { SlaPage } from './pages/SlaPage';
import { N8nAutomationHub } from './components/N8nAutomationHub';
import { InvoiceItem } from './types';

const MainAppContent: React.FC = () => {
  const { currentView } = useAuth();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAiAdvisorOpen, setIsAiAdvisorOpen] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState<InvoiceItem | null>(null);

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-indigo-500 selection:text-white antialiased bg-slate-950 text-slate-100 dark-mode">
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAiAdvisor={() => setIsAiAdvisorOpen(true)}
      />

      <main className="flex-1">
        {currentView === 'home' && <HomePage onOpenCart={() => setIsCartOpen(true)} />}
        {currentView === 'builder' && <HomePage onOpenCart={() => setIsCartOpen(true)} />}
        {currentView === 'domains' && <HomePage onOpenCart={() => setIsCartOpen(true)} />}
        {currentView === 'hosting' && <HomePage onOpenCart={() => setIsCartOpen(true)} />}
        {currentView === 'pricing' && <HomePage onOpenCart={() => setIsCartOpen(true)} />}

        {/* Legal & Informational Pages */}
        {currentView === 'contact' && <ContactPage />}
        {currentView === 'privacy' && <PrivacyPage />}
        {currentView === 'terms' && <TermsPage />}
        {currentView === 'refund' && <RefundPage />}
        {currentView === 'about' && <AboutPage />}
        {currentView === 'sla' && <SlaPage />}

        {currentView === 'n8n' && (
          <div className="py-8">
            <N8nAutomationHub />
          </div>
        )}

        {currentView === 'dashboard' && <UserDashboard initialTab="home" />}
        {currentView === 'credits' && <UserDashboard initialTab="credits" />}
        {currentView === 'deployments' && <UserDashboard initialTab="builder" />}
        {currentView === 'billing' && <UserDashboard initialTab="billing" />}
        {currentView === 'tickets' && <UserDashboard initialTab="tickets" />}
        {currentView === 'profile' && <UserDashboard initialTab="profile" />}

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
      <MarginProvider>
        <AuthProvider>
          <MainAppContent />
        </AuthProvider>
      </MarginProvider>
    </ToastProvider>
  );
}
