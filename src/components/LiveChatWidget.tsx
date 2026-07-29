import React, { useState } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';

export const LiveChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'bot',
      text: 'Hello! 👋 Welcome to OneHost Support. How can we help you with hosting, domain registration, or instant GitHub deployments today?'
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now().toString(), sender: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulate AI support bot reply
    setTimeout(() => {
      let reply = 'Our senior DevOps engineers operate 24/7. All server nodes in India, Singapore, and Frankfurt are currently operating at 100% capacity.';
      const lower = userMsg.text.toLowerCase();
      if (lower.includes('price') || lower.includes('cost') || lower.includes('plan')) {
        reply = 'Our Web Hosting starts at ₹99/month, and Developer VPS with root SSH at ₹999/month. You can apply coupon ONEHOST50 for 50% OFF!';
      } else if (lower.includes('domain') || lower.includes('tld')) {
        reply = 'You can register .in for ₹699/year, .com for ₹999/year, and .ai for ₹6999/year with free WHOIS Privacy Protection.';
      } else if (lower.includes('ssl') || lower.includes('https')) {
        reply = 'All OneHost hosting plans include free, unlimited Let’s Encrypt SSL certificates with automatic auto-renewal!';
      }

      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: 'bot', text: reply }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {isOpen ? (
        <div className="w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col h-[480px]">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-bold">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute -bottom-0.5 -right-0.5 ring-2 ring-slate-900" />
              </div>
              <div>
                <div className="font-bold text-sm text-white">OneHost Live AI Support</div>
                <div className="text-[10px] text-emerald-400 font-semibold">24/7 Instant Response</div>
              </div>
            </div>

            <button onClick={() => setIsOpen(false)} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-300 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[80%] ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 border-t border-slate-800 bg-slate-950 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask support..."
              className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="p-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-2xl shadow-indigo-600/40 hover:scale-105 transition-all flex items-center gap-2 group"
        >
          <MessageSquare className="w-6 h-6" />
          <span className="font-bold text-xs pr-1 hidden sm:inline">24/7 Live Chat</span>
        </button>
      )}
    </div>
  );
};
