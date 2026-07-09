import React, { useState } from 'react';
import { Search, BookOpen, Clock, Flame, Tag, Check, Bookmark, BookmarkCheck, ArrowLeft, Lightbulb } from 'lucide-react';
import { Article, EarningCategory } from '../types';
import { ARTICLES } from '../data';

interface DiscoverProps {
  savedArticleIds: string[];
  toggleSaveArticle: (id: string) => void;
  onNavigateToTab?: (tab: number) => void;
}

export default function Discover({ savedArticleIds, toggleSaveArticle, onNavigateToTab }: DiscoverProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const categories = [
    { key: 'ALL', label: 'All Fields' },
    { key: 'AFFILIATE_MARKETING', label: 'Affiliates' },
    { key: 'FREELANCING', label: 'Freelance' },
    { key: 'DIGITAL_PRODUCTS', label: 'Digital Goods' },
    { key: 'FINANCIAL_EDUCATION', label: 'Education' }
  ];

  // Filtering logic
  const filteredArticles = ARTICLES.filter(art => {
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          art.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          art.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCat = selectedCategory === 'ALL' || art.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const getCategoryLabel = (cat: EarningCategory) => {
    switch (cat) {
      case 'AFFILIATE_MARKETING': return 'Affiliate Marketing';
      case 'FREELANCING': return 'Freelance Masterclass';
      case 'DIGITAL_PRODUCTS': return 'Digital Products';
      case 'FINANCIAL_EDUCATION': return 'Financial Education';
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {selectedArticle ? (
        // Immersive Article Reading View
        <div className="max-w-4xl mx-auto space-y-6">
          <button 
            onClick={() => setSelectedArticle(null)}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors focus:outline-none"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Discover Hub
          </button>

          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6 shadow-xl relative overflow-hidden">
            {/* Ambient glows inside reader */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none" />

            {/* Header metadata */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wide">
                  {getCategoryLabel(selectedArticle.category)}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                  selectedArticle.difficulty === 'Beginner' ? 'bg-sky-500/10 border-sky-500/20 text-sky-400' :
                  selectedArticle.difficulty === 'Intermediate' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                  'bg-rose-500/10 border-rose-500/20 text-rose-400'
                }`}>
                  {selectedArticle.difficulty}
                </span>
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  {selectedArticle.readTimeMinutes} min read
                </div>
              </div>

              <div className="flex justify-between items-start gap-4">
                <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-tight leading-tight">
                  {selectedArticle.title}
                </h1>
                <button
                  onClick={() => toggleSaveArticle(selectedArticle.id)}
                  className="p-3 bg-slate-950 border border-slate-800 hover:border-emerald-500/30 rounded-2xl text-slate-400 hover:text-emerald-400 transition-all focus:outline-none shrink-0"
                  title="Bookmark Article"
                >
                  {savedArticleIds.includes(selectedArticle.id) ? (
                    <BookmarkCheck className="w-6 h-6 text-emerald-400" />
                  ) : (
                    <Bookmark className="w-6 h-6" />
                  )}
                </button>
              </div>

              <p className="text-slate-400 text-lg leading-relaxed font-medium">
                {selectedArticle.subtitle}
              </p>
            </div>

            {/* Practical Stats Badge */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-inner">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Estimated Earning potential</p>
                  <p className="text-slate-200 font-bold text-sm sm:text-base">{selectedArticle.earningPotential}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedArticle.tags.map((tag, i) => (
                  <span key={i} className="text-xs bg-slate-900 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-lg">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Immersive Markdown-style Content Renderer */}
            <div className="prose prose-invert prose-emerald max-w-none text-slate-300 space-y-6 pt-4 border-t border-slate-800/60 leading-relaxed">
              {selectedArticle.content.split('\n\n').map((block, index) => {
                const trimmed = block.trim();
                if (trimmed.startsWith('### ')) {
                  return (
                    <h3 key={index} className="text-xl sm:text-2xl font-bold text-slate-100 mt-6 mb-3 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-amber-400 shrink-0" />
                      {trimmed.replace('### ', '')}
                    </h3>
                  );
                }
                if (trimmed.startsWith('• ') || trimmed.startsWith('* ')) {
                  return (
                    <ul key={index} className="list-disc pl-6 space-y-2 mt-2">
                      {trimmed.split('\n').map((li, i) => (
                        <li key={i} className="text-slate-300">
                          {li.replace(/^[•*]\s+/, '')}
                        </li>
                      ))}
                    </ul>
                  );
                }
                if (trimmed.match(/^\d+\./)) {
                  return (
                    <ol key={index} className="list-decimal pl-6 space-y-2 mt-2">
                      {trimmed.split('\n').map((li, i) => (
                        <li key={i} className="text-slate-300">
                          {li.replace(/^\d+\.\s+/, '')}
                        </li>
                      ))}
                    </ol>
                  );
                }
                return (
                  <p key={index} className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    {trimmed}
                  </p>
                );
              })}
            </div>

            {/* Action Check List */}
            <div className="pt-8 border-t border-slate-800 mt-8 space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400">Actionable Steps to Launch</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-start gap-3">
                  <div className="p-1 bg-emerald-500/10 rounded border border-emerald-500/20 text-emerald-400 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-slate-200">Validate Your Market</p>
                    <p className="text-slate-500 mt-0.5">Identify 5 active user feedback posts dealing with your focus niche.</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-start gap-3">
                  <div className="p-1 bg-emerald-500/10 rounded border border-emerald-500/20 text-emerald-400 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-slate-200">Calculate Margins</p>
                    <p className="text-slate-500 mt-0.5">Use our active Toolbox calculators to simulate startup rates.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Discover Grid Hub
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
                <BookOpen className="w-8 h-8 text-brand-green" />
                Educational Blueprints
              </h1>
              <p className="text-slate-400 text-sm mt-1">Detailed, step-by-step masterguides to build Legitimate Digital Businesses.</p>
            </div>

            {/* Dynamic Search */}
            <div className="relative rounded-xl max-w-sm w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search passive streams, SEO, niches..."
                className="block w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-100 placeholder-slate-500 text-sm"
              />
            </div>
          </div>

          {/* Categories Tab selector */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all focus:outline-none shrink-0 border ${
                  selectedCategory === cat.key 
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 border-transparent text-white shadow-lg' 
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Actionable blueprints list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredArticles.map((art) => (
              <div 
                key={art.id} 
                className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 hover:border-emerald-500/30 rounded-3xl p-6 shadow-xl transition-all flex flex-col justify-between group cursor-pointer relative"
                onClick={() => setSelectedArticle(art)}
              >
                {art.isFeatured && (
                  <span className="absolute top-4 right-4 bg-amber-500/10 border border-amber-500/20 text-amber-400 font-extrabold rounded-md text-[10px] px-2 py-0.5 uppercase tracking-wider">
                    Featured
                  </span>
                )}
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-slate-950 border border-slate-800 text-slate-400 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      {getCategoryLabel(art.category).substring(0, 18)}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-500">
                      <Clock className="w-3 h-3" />
                      {art.readTimeMinutes} min
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-xl font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                      {art.title}
                    </h3>
                    <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                      {art.subtitle}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-800/40 mt-6 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500">Earning Potential</p>
                    <p className="text-sm text-emerald-400 font-extrabold">{art.earningPotential}</p>
                  </div>
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Unlock Guide &rarr;
                  </span>
                </div>
              </div>
            ))}

            {filteredArticles.length === 0 && (
              <div className="col-span-full py-16 text-center text-slate-500 space-y-2">
                <BookOpen className="w-12 h-12 text-slate-700 mx-auto" />
                <p className="text-lg font-bold">No blueprints found matching your search</p>
                <p className="text-sm">Try using other parameters or browsing category filters.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
