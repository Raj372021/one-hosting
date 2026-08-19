import React, { useState } from 'react';
import { RegisteredDomain, DNSRecord } from '../types';
import { updateDomainDNS } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Globe, Plus, Trash2, Save, X, Shield, Server, CheckCircle2, ArrowLeft } from 'lucide-react';

interface DNSManagerModalProps {
  domain: RegisteredDomain | null;
  onClose: () => void;
  onUpdated: () => void;
}

export const DNSManagerModal: React.FC<DNSManagerModalProps> = ({ domain, onClose, onUpdated }) => {
  const { showToast } = useToast();

  const [dnsRecords, setDnsRecords] = useState<DNSRecord[]>(domain?.dnsRecords || []);
  const [nameservers, setNameservers] = useState<string[]>(domain?.nameservers || ['ns1.onehost.cloud', 'ns2.onehost.cloud']);
  const [newType, setNewType] = useState<DNSRecord['type']>('A');
  const [newName, setNewName] = useState('@');
  const [newValue, setNewValue] = useState('');
  const [newTtl, setNewTtl] = useState(3600);
  const [isSaving, setIsSaving] = useState(false);

  if (!domain) return null;

  const handleAddRecord = () => {
    if (!newValue.trim()) {
      showToast('Record value is required', 'error');
      return;
    }

    const rec: DNSRecord = {
      id: 'dns_' + Date.now(),
      type: newType,
      name: newName || '@',
      value: newValue.trim(),
      ttl: newTtl
    };

    setDnsRecords([...dnsRecords, rec]);
    setNewValue('');
    showToast(`Added ${newType} record for ${newName}`, 'success');
  };

  const handleDeleteRecord = (id: string) => {
    setDnsRecords(dnsRecords.filter(r => r.id !== id));
    showToast('Record deleted', 'info');
  };

  const handleSaveDNS = async () => {
    setIsSaving(true);
    const success = await updateDomainDNS(domain.id, dnsRecords);
    setIsSaving(false);

    if (success) {
      showToast(`DNS Records updated for ${domain.domainName}!`, 'success');
      onUpdated();
      onClose();
    } else {
      showToast('Failed to update DNS records', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-lg text-white flex items-center gap-2">
                <span>DNS Zone Manager</span>
                <span className="text-xs text-indigo-400 font-mono bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  {domain.domainName}
                </span>
              </div>
              <p className="text-xs text-slate-400">Manage A, CNAME, MX, TXT records and Cloudflare Name Servers</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 text-purple-400 group-hover:-translate-x-0.5 transition-transform" />
            <span>← Back / Close</span>
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Name Servers Config */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Server className="w-4 h-4 text-indigo-400" />
              <span>Active Cloud Name Servers</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              {nameservers.map((ns, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 flex items-center justify-between">
                  <span>NS{idx + 1}: {ns}</span>
                  <span className="text-[10px] text-emerald-400 font-bold">ACTIVE</span>
                </div>
              ))}
            </div>
          </div>

          {/* Add New Record Form */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="font-bold text-xs uppercase tracking-wider text-slate-400">Add New DNS Record</div>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              <select
                value={newType}
                onChange={e => setNewType(e.target.value as any)}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-white focus:outline-none"
              >
                <option value="A">A Record</option>
                <option value="AAAA">AAAA Record</option>
                <option value="CNAME">CNAME Record</option>
                <option value="TXT">TXT Record</option>
                <option value="MX">MX Record</option>
                <option value="SRV">SRV Record</option>
                <option value="CAA">CAA Record</option>
              </select>

              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="Host (@ or www)"
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none"
              />

              <input
                type="text"
                value={newValue}
                onChange={e => setNewValue(e.target.value)}
                placeholder="Value (IP or Target)"
                className="sm:col-span-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none font-mono"
              />

              <button
                onClick={handleAddRecord}
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/20"
              >
                <Plus className="w-4 h-4" />
                <span>Add Record</span>
              </button>
            </div>
          </div>

          {/* Records List Table */}
          <div className="space-y-2">
            <div className="font-bold text-xs uppercase tracking-wider text-slate-400">Existing Records ({dnsRecords.length})</div>
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 bg-slate-900">
                    <th className="p-3">Type</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Value</th>
                    <th className="p-3">TTL</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {dnsRecords.map(record => (
                    <tr key={record.id} className="hover:bg-slate-900/50">
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">
                          {record.type}
                        </span>
                      </td>
                      <td className="p-3 text-white font-bold">{record.name}</td>
                      <td className="p-3 text-slate-300 truncate max-w-xs">{record.value}</td>
                      <td className="p-3 text-slate-400">{record.ttl}s</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteRecord(record.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Save Action */}
          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700"
            >
              Cancel
            </button>

            <button
              onClick={handleSaveDNS}
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/25"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Changes...' : 'Save DNS Zone'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
