import React, { useState } from 'react';
import { Search, Globe, Check, Plus, Heart, Sparkles, AlertCircle, ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { checkDomainAvailability } from '../services/api';
import { DomainSearchResult } from '../types';

export const DomainSearchBox: React.FC = () => {
  const { addToCart, wishlist, toggleWishlist, formatPrice } = useAuth();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTld, setSelectedTld] = useState('ALL');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<DomainSearchResult[]>([]);
  const [searchedName, setSearchedName] = useState('');

  const tlds = ['ALL', '.in', '.com', '.co.in', '.ai', '.tech', '.io', '.shop', '.store', '.online', '.xyz', '.org', '.net', '.dev', '.app'];

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) {
      showToast('Please enter a domain name to search', 'info');
      return;
    }

    setIsLoading(true);
    setSearchedName(searchQuery.trim());
    const res = await checkDomainAvailability(searchQuery.trim());
    setResults(res);
    setIsLoading(false);
  };

  const handleAddToCart = (item: DomainSearchResult) => {
    addToCart({
      id: 'cart_dom_' + item.domain,
      type: 'domain',
      title: `Domain Registration: ${item.domain}`,
      subtitle: `1 Year Registration (${item.tld})`,
      billingCycle: 'yearly',
      price: item.price,
      details: `Includes Privacy Protection & Free DNS Management`,
      domainName: item.domain
    });
    showToast(`Added ${item.domain} to your cart!`, 'success');
  };

  const filteredResults = results.filter(r => {
    if (selectedTld === 'ALL') return true;
    return r.tld === selectedTld;
  });

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Glow Container */}
      <div className="relative p-1 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 shadow-2xl shadow-indigo-500/20">
        <form
          onSubmit={handleSearch}
          className="relative bg-slate-950 p-2 sm:p-3 rounded-[22px] flex flex-col sm:flex-row items-center gap-3"
        >
          <div className="flex-1 flex items-center gap-3 px-4 py-2 w-full">
            <Globe className="w-6 h-6 text-indigo-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search your domain name (e.g. mybrand.in, devstudio.ai)..."
              className="w-full bg-transparent text-white placeholder-slate-500 font-medium text-base sm:text-lg focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-base shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 transition-all shrink-0"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Search Domain</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* TLD Quick Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs font-semibold">
        <span className="text-slate-400 mr-2">Filter TLDs:</span>
        {tlds.map(tld => (
          <button
            key={tld}
            onClick={() => setSelectedTld(tld)}
            className={`px-3 py-1.5 rounded-full border transition-all ${
              selectedTld === tld
                ? 'bg-indigo-600 border-indigo-400 text-white shadow-md'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            {tld}
          </button>
        ))}
      </div>

      {/* Live Domain Search Results */}
      {results.length > 0 && (
        <div className="mt-8 space-y-3 bg-slate-900/80 border border-slate-800 p-4 sm:p-6 rounded-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Domain Results for "{searchedName}"</span>
            <span>{filteredResults.length} TLD Options</span>
          </div>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {filteredResults.map(item => {
              const isWishlisted = wishlist.includes(item.domain);
              return (
                <div
                  key={item.domain}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                    item.available
                      ? 'bg-slate-950/60 border-slate-800 hover:border-indigo-500/50'
                      : 'bg-slate-950/40 border-slate-900 opacity-70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        item.available ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                      }`}
                    >
                      {item.available ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-lg text-white font-mono">{item.domain}</span>
                        {item.available ? (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            AVAILABLE
                          </span>
                        ) : (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            TAKEN (REAL DNS)
                          </span>
                        )}
                        {item.discountTag && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            {item.discountTag}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-2">
                        <span>{item.statusText || (item.available ? 'Includes free WHOIS Privacy Protection & DNS Records' : 'Domain is registered in global DNS')}</span>
                        {item.whoisNs && item.whoisNs.length > 0 && (
                          <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                            NS: {item.whoisNs.join(', ')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    {item.available && (
                      <div className="text-right">
                        <div className="text-lg font-bold text-white">{formatPrice(item.price)}<span className="text-xs text-slate-400 font-normal">/yr</span></div>
                        <div className="text-xs text-slate-500 line-through">{formatPrice(item.originalPrice)}</div>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          toggleWishlist(item.domain);
                          showToast(
                            isWishlisted
                              ? `Removed ${item.domain} from wishlist`
                              : `Saved ${item.domain} to wishlist!`,
                            'info'
                          );
                        }}
                        className={`p-2.5 rounded-xl border transition-colors ${
                          isWishlisted
                            ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                        title="Wishlist"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>

                      {item.available ? (
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/20 transition-all"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          <span>Add to Cart</span>
                        </button>
                      ) : (
                        <button
                          disabled
                          className="px-4 py-2 rounded-xl bg-slate-800 text-slate-500 font-semibold text-xs cursor-not-allowed"
                        >
                          Unavailable
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
