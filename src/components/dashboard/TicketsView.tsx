import React, { useState } from 'react';
import {
  Headphones,
  Plus,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { SupportTicket } from '../../types';

interface TicketsViewProps {
  tickets: SupportTicket[];
  onCreateTicket: (subject: string, category: string, priority: 'Low' | 'Medium' | 'High', message: string) => void;
  onReplyTicket: (ticketId: string, message: string) => void;
}

export const TicketsView: React.FC<TicketsViewProps> = ({
  tickets,
  onCreateTicket,
  onReplyTicket
}) => {
  const { showToast } = useToast();
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(tickets[0] || null);
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState('Technical Support');
  const [newPriority, setNewPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [newMessage, setNewMessage] = useState('');
  const [replyText, setReplyText] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const handleSubmitNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject || !newMessage) {
      showToast('Please provide a subject and message', 'error');
      return;
    }
    onCreateTicket(newSubject, newCategory, newPriority, newMessage);
    setNewSubject('');
    setNewMessage('');
    setIsCreatingNew(false);
    showToast('🎫 Support ticket created! Our 24/7 technical team will respond shortly.', 'success');
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;
    onReplyTicket(selectedTicket.id, replyText);
    setReplyText('');
    showToast('💬 Reply sent to support engineers!', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200" id="support-tickets-desk">
      {/* TOP HEADER */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Headphones className="w-6 h-6 text-emerald-400" />
            <span>24/7 Priority Support Desk</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Connect directly with OneHost certified cloud & DevOps engineers for server, DNS, and database assistance.
          </p>
        </div>

        <button
          onClick={() => setIsCreatingNew(!isCreatingNew)}
          className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 cursor-pointer transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{isCreatingNew ? 'View Existing Tickets' : 'Open New Ticket'}</span>
        </button>
      </div>

      {isCreatingNew ? (
        /* CREATE TICKET FORM */
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 max-w-3xl">
          <h3 className="text-base font-black text-white">Create Priority Support Ticket</h3>
          <form onSubmit={handleSubmitNew} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Ticket Subject</label>
              <input
                type="text"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="Brief summary of your inquiry"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Technical Support">Technical Support</option>
                  <option value="Billing & Invoices">Billing & Invoices</option>
                  <option value="Domain & DNS">Domain & DNS</option>
                  <option value="Website Migration">Website Migration</option>
                  <option value="n8n Automation">n8n Automation</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Priority Level</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Low">Low - General Question</option>
                  <option value="Medium">Medium - Non-Critical Issue</option>
                  <option value="High">High - Server Down / Critical</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Detailed Message</label>
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                rows={5}
                placeholder="Explain the problem in detail with error codes or domains..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-2 cursor-pointer transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Submit Support Ticket</span>
            </button>
          </form>
        </div>
      ) : (
        /* TICKETS LIST & LIVE THREAD */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Ticket list */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-xs font-bold uppercase text-slate-400">All Support Tickets ({tickets.length})</h3>
            {tickets.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-500 text-xs italic">
                No tickets open. Click "+ Open New Ticket" above if you need help!
              </div>
            ) : (
              tickets.map((t) => {
                const isSelected = selectedTicket?.id === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTicket(t)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-slate-900 border-emerald-500/60 ring-1 ring-emerald-500/30'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-slate-400">#{t.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase border ${
                        t.status === 'Open'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {t.status}
                      </span>
                    </div>

                    <h4 className="text-xs font-black text-white line-clamp-1">{t.subject}</h4>
                    <div className="text-[10px] text-slate-400 flex items-center justify-between">
                      <span>{t.category}</span>
                      <span>{t.createdAt}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Ticket conversation thread */}
          <div className="lg:col-span-7">
            {selectedTicket ? (
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between min-h-[450px]">
                <div className="space-y-4">
                  <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">Ticket #{selectedTicket.id}</span>
                      <h3 className="text-sm font-black text-white">{selectedTicket.subject}</h3>
                    </div>
                    <span className="text-xs text-slate-400">{selectedTicket.priority} Priority</span>
                  </div>

                  {/* Messages */}
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                    {(selectedTicket.messages || []).map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-3.5 rounded-2xl text-xs space-y-1 ${
                          msg.sender === 'user'
                            ? 'bg-slate-950 border border-slate-800 ml-6'
                            : 'bg-emerald-950/30 border border-emerald-500/30 mr-6'
                        }`}
                      >
                        <div className="flex justify-between items-center text-[10px] font-bold">
                          <span className={msg.sender === 'user' ? 'text-white' : 'text-emerald-400'}>
                            {msg.senderName} {msg.sender !== 'user' && '(Support Engineer)'}
                          </span>
                          <span className="text-slate-400">{msg.timestamp}</span>
                        </div>
                        <p className="text-slate-300 whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reply Form */}
                <form onSubmit={handleSendReply} className="pt-3 border-t border-slate-800 flex gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply to the engineering team..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-emerald-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Reply</span>
                  </button>
                </form>
              </div>
            ) : (
              <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center text-slate-500 text-xs italic">
                Select a ticket on the left to view the live conversation thread.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
