
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  ChevronRight, 
  ChevronLeft,
  Clock, 
  Zap, 
  Leaf, 
  ShoppingBag, 
  Calendar,
  Sparkles,
  CheckCircle2,
  X,
  Plus,
  Activity,
  Award,
  Flame,
  Stethoscope,
  Droplets,
  ZapIcon,
  Smile,
  ArrowRight
} from 'lucide-react';
import { PillarType, Pillar, Recipe, SubCategory } from './types';
import { INITIAL_PILLARS, PANTRY_CHECKLIST } from './constants';
import { generateMoreRecipes } from './geminiService';

// --- Atomic Components ---

const Tag: React.FC<{ children: React.ReactNode; variant?: 'success' | 'warning' | 'info' | 'active' }> = ({ children, variant = 'info' }) => {
  const styles = {
    info: 'bg-slate-100 text-slate-500',
    success: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-amber-50 text-amber-700',
    active: 'bg-emerald-900 text-white'
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles[variant]}`}>
      {children}
    </span>
  );
};

const RecipeCard: React.FC<{ recipe: Recipe; onClick: () => void; isLarge?: boolean }> = ({ recipe, onClick, isLarge }) => (
  <div 
    onClick={(e) => { e.stopPropagation(); onClick(); }}
    className={`bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col h-full ${isLarge ? 'p-8' : 'p-6'}`}
  >
    <div className="flex justify-between items-start mb-4">
      <div className="flex gap-2">
        <Tag variant={recipe.difficulty === 'Fácil' ? 'success' : 'warning'}>{recipe.difficulty}</Tag>
        {recipe.isFeatured && <Tag variant="active">Estratégico</Tag>}
      </div>
      <div className="flex items-center text-slate-400 text-[11px] font-bold gap-1.5 uppercase tracking-tighter">
        <Clock size={14} className="text-emerald-600" />
        {recipe.time} min
      </div>
    </div>
    <h3 className={`${isLarge ? 'text-xl md:text-2xl' : 'text-lg'} font-bold text-slate-900 group-hover:text-emerald-900 transition-colors mb-2 leading-tight`}>
      {recipe.name}
    </h3>
    <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1 line-clamp-2 italic">
      "{recipe.functionalAction}"
    </p>
    <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
      <span className="text-[10px] font-black text-emerald-900 uppercase tracking-widest flex items-center gap-2">
        Ativar Protocolo <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
      </span>
      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-emerald-900 group-hover:text-white transition-all">
        <Plus size={16} />
      </div>
    </div>
  </div>
);

const RecipeModal: React.FC<{ 
  recipe: Recipe; 
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}> = ({ recipe, onClose, onPrev, onNext, hasPrev, hasNext }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 recipe-modal-backdrop" onClick={onClose}>
      <div 
        className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200 relative no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Navigation Overlays */}
        <div className="sticky top-0 right-0 z-[110] p-6 flex justify-end gap-3 pointer-events-none">
          {hasPrev && (
            <button onClick={onPrev} className="pointer-events-auto bg-white/90 hover:bg-white text-slate-900 p-3 rounded-full shadow-lg transition-all active:scale-90">
              <ChevronLeft size={24} />
            </button>
          )}
          {hasNext && (
            <button onClick={onNext} className="pointer-events-auto bg-white/90 hover:bg-white text-slate-900 p-3 rounded-full shadow-lg transition-all active:scale-90">
              <ChevronRight size={24} />
            </button>
          )}
          <button onClick={onClose} className="pointer-events-auto bg-emerald-900 text-white p-3 rounded-full shadow-lg transition-all active:scale-90">
            <X size={24} />
          </button>
        </div>

        <div className="relative -mt-24">
          <div className="h-72 bg-slate-100 overflow-hidden flex items-end relative">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent z-10"></div>
            <img 
              src={`https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=1200`} 
              alt={recipe.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="relative z-20 p-10 w-full">
              <Tag variant="success">Protocolo BioCozinha</Tag>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-2 leading-tight drop-shadow-sm">{recipe.name}</h2>
            </div>
          </div>
          
          <div className="p-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4 space-y-8">
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-4 flex items-center gap-2">
                  <ShoppingBag size={14} className="text-emerald-700" /> Ingredientes
                </h4>
                <ul className="space-y-3">
                  {recipe.ingredients.map((ing, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-700 text-sm font-medium">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0"></div>
                      {ing}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 bg-emerald-50 text-emerald-900 rounded-3xl border border-emerald-100">
                <h4 className="font-black text-emerald-800 uppercase tracking-widest text-[10px] mb-2">Ação Funcional</h4>
                <p className="text-sm leading-relaxed font-semibold italic">"{recipe.functionalAction}"</p>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-10">
              <section>
                <div className="flex items-center gap-6 mb-8 bg-slate-50 p-4 rounded-2xl w-fit">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Preparo</span>
                    <span className="text-sm font-bold text-slate-900 flex items-center gap-1"><Clock size={14} className="text-emerald-600"/> {recipe.time}m</span>
                  </div>
                  <div className="w-px h-8 bg-slate-200"></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Nível</span>
                    <span className="text-sm font-bold text-slate-900">{recipe.difficulty}</span>
                  </div>
                </div>

                <h4 className="font-bold text-slate-900 uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                  <Sparkles size={16} className="text-emerald-600" /> Passo a Passo
                </h4>
                <div className="space-y-6">
                  {recipe.steps.map((step, idx) => (
                    <div key={idx} className="flex gap-5">
                      <div className="bg-emerald-900 text-white font-black text-xs w-8 h-8 rounded-xl flex items-center justify-center shrink-0">
                        {idx + 1}
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed pt-1.5 font-medium">{step}</p>
                    </div>
                  ))}
                </div>
              </section>

              {recipe.chefTip && (
                <div className="p-8 bg-amber-50 rounded-3xl border border-amber-100 relative overflow-hidden">
                  <Award size={40} className="absolute -right-2 -bottom-2 text-amber-200/50" />
                  <h5 className="font-black text-[10px] text-amber-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                    Dica do Especialista
                  </h5>
                  <p className="text-amber-900 text-sm font-semibold leading-relaxed relative z-10">{recipe.chefTip}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Goals Definition ---

const GOALS = [
  { id: 'weight', name: 'Emagrecimento', icon: <Flame size={20} />, keywords: ['saciedade', 'emagrecimento', 'queima', 'metabolismo', 'magra', 'fome'] },
  { id: 'pain', name: 'Alívio de Dor', icon: <Stethoscope size={20} />, keywords: ['dor', 'analgésico', 'inflamação', 'articulações', 'cabeça'] },
  { id: 'bloat', name: 'Desinflamar', icon: <Droplets size={20} />, keywords: ['inchaço', 'retenção', 'diurético', 'desinflamar', 'detox'] },
  { id: 'energy', name: 'Foco & Energia', icon: <ZapIcon size={20} />, keywords: ['energia', 'foco', 'disposição', 'cafeína', 'ânimo'] },
  { id: 'gut', name: 'Saúde Intestinal', icon: <Smile size={20} />, keywords: ['intestinal', 'digestão', 'fibras', 'estômago', 'flora'] }
];

// --- Main Application ---

export default function App() {
  const [view, setView] = useState<'welcome' | 'dashboard' | 'results' | 'toolkit'>('welcome');
  const [activePillar, setActivePillar] = useState<PillarType>(PillarType.PHARMACY);
  const [activeSub, setActiveSub] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [goalFilter, setGoalFilter] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [pillars, setPillars] = useState<Pillar[]>(INITIAL_PILLARS);
  const [isGenerating, setIsGenerating] = useState(false);

  // Flattened lists for search and navigation
  const allRecipes = useMemo(() => pillars.flatMap(p => p.subcategories.flatMap(s => s.recipes)), [pillars]);
  const featuredRecipes = useMemo(() => allRecipes.filter(r => r.isFeatured), [allRecipes]);

  // Unified Filtering Logic
  const filteredRecipes = useMemo(() => {
    let result = allRecipes;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r => r.name.toLowerCase().includes(q) || r.functionalAction.toLowerCase().includes(q));
    }
    if (goalFilter) {
      const g = GOALS.find(goal => goal.id === goalFilter);
      if (g) {
        result = result.filter(r => 
          g.keywords.some(k => r.name.toLowerCase().includes(k) || r.functionalAction.toLowerCase().includes(k) || r.category.toLowerCase().includes(k))
        );
      }
    }
    return result;
  }, [searchQuery, allRecipes, goalFilter]);

  // Robust Modal Navigation
  const { modalList, currentIndex } = useMemo(() => {
    if (!selectedRecipe) return { modalList: [], currentIndex: -1 };
    
    // 1. Context: Results (Search or Goal)
    if (view === 'results' || searchQuery) {
      const idx = filteredRecipes.findIndex(r => r.id === selectedRecipe.id);
      return { modalList: filteredRecipes, currentIndex: idx };
    }

    // 2. Context: Dashboard (Pillar / Subcategory)
    const sub = pillars.flatMap(p => p.subcategories).find(s => s.id === selectedRecipe.category);
    if (sub) {
      const idx = sub.recipes.findIndex(r => r.id === selectedRecipe.id);
      return { modalList: sub.recipes, currentIndex: idx };
    }

    // 3. Fallback: All
    const idx = allRecipes.findIndex(r => r.id === selectedRecipe.id);
    return { modalList: allRecipes, currentIndex: idx };
  }, [selectedRecipe, view, filteredRecipes, pillars, allRecipes, searchQuery]);

  const handleNext = () => { if (currentIndex < modalList.length - 1) setSelectedRecipe(modalList[currentIndex + 1]); };
  const handlePrev = () => { if (currentIndex > 0) setSelectedRecipe(modalList[currentIndex - 1]); };

  const handleGenerateMore = async (sub: SubCategory) => {
    setIsGenerating(true);
    try {
      const more = await generateMoreRecipes(sub.name, sub.description);
      setPillars(prev => prev.map(p => ({
        ...p,
        subcategories: p.subcategories.map(s => s.id === sub.id ? { ...s, recipes: [...s.recipes, ...more] } : s)
      })));
    } catch (e) { console.error(e); } finally { setIsGenerating(false); }
  };

  const currentPillar = pillars.find(p => p.type === activePillar);

  if (view === 'welcome') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-white text-center">
        <div className="bg-emerald-900 p-5 rounded-[2rem] text-white shadow-2xl mb-8"><Leaf size={48} /></div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-4 text-slate-900">BIO<span className="text-emerald-900">COZINHA</span></h1>
        <p className="text-xl text-slate-500 max-w-xl mb-12 font-medium">O manual científico que transforma sua alimentação em um protocolo de cura.</p>
        <button 
          onClick={() => setView('dashboard')}
          className="bg-emerald-900 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-emerald-950 transition-all shadow-xl shadow-emerald-900/10 active:scale-95"
        >
          ATIVAR ACERVO
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans">
      {/* Sidebar - Minimalist */}
      <aside className="w-full md:w-64 bg-slate-50 border-r border-slate-100 p-8 flex flex-col gap-8 md:sticky md:top-0 md:h-screen">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => { setView('welcome'); setGoalFilter(null); setSearchQuery(''); }}>
           <div className="bg-emerald-900 p-2 rounded-xl text-white"><Leaf size={20} /></div>
           <h1 className="text-lg font-black tracking-tight text-slate-900">BioCozinha</h1>
        </div>

        <nav className="flex flex-col gap-1">
          <button 
            onClick={() => { setView('dashboard'); setActivePillar(PillarType.PHARMACY); setGoalFilter(null); setActiveSub(null); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${view === 'dashboard' && activePillar === PillarType.PHARMACY ? 'bg-emerald-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-200/50'}`}
          >
            <Zap size={18} /> Farmácia
          </button>
          <button 
            onClick={() => { setView('dashboard'); setActivePillar(PillarType.CHRONOMETER); setGoalFilter(null); setActiveSub(null); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${view === 'dashboard' && activePillar === PillarType.CHRONOMETER ? 'bg-emerald-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-200/50'}`}
          >
            <Clock size={18} /> Cronômetro
          </button>
          <button 
            onClick={() => { setView('dashboard'); setActivePillar(PillarType.ECONOMIST); setGoalFilter(null); setActiveSub(null); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${view === 'dashboard' && activePillar === PillarType.ECONOMIST ? 'bg-emerald-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-200/50'}`}
          >
            <ShoppingBag size={18} /> Economista
          </button>
          <div className="h-px bg-slate-200 my-4 mx-4"></div>
          <button 
            onClick={() => setView('toolkit')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${view === 'toolkit' ? 'bg-emerald-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-200/50'}`}
          >
            <Calendar size={18} /> Toolkits
          </button>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Clean Header */}
        <header className="bg-white/90 backdrop-blur-md border-b border-slate-100 px-8 py-4 flex flex-col gap-4 sticky top-0 z-40">
          <div className="flex items-center justify-between gap-6">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input 
                type="text" 
                placeholder="Busca inteligente por sintoma ou ingrediente..."
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-emerald-900/10 outline-none"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value) setView('results');
                  else if (!goalFilter) setView('dashboard');
                }}
              />
            </div>
            <div className="hidden lg:flex items-center gap-4 text-xs font-bold text-slate-400">
               PROTOCOLO AI ATIVO <Activity size={16} className="text-emerald-600" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {/* DASHBOARD VIEW */}
          {view === 'dashboard' && (
            <div className="p-8 md:p-12 max-w-7xl mx-auto space-y-20 animate-in fade-in duration-500">
              
              {/* Healthy Goals Selection */}
              <section>
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">FOCO DE SAÚDE</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {GOALS.map(goal => (
                    <button 
                      key={goal.id}
                      onClick={() => { setGoalFilter(goal.id); setView('results'); }}
                      className="group bg-white border border-slate-100 p-6 rounded-[2.5rem] text-left hover:border-emerald-200 hover:shadow-xl transition-all flex flex-col items-start gap-4"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-emerald-900 group-hover:text-white transition-all shadow-sm">
                        {goal.icon}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{goal.name}</p>
                        <p className="text-[9px] font-black text-emerald-600 uppercase mt-1 tracking-widest">Protocolar</p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              {/* Today's Highlights */}
              <section>
                <div className="flex items-center justify-between mb-10">
                  <h4 className="text-[11px] font-black text-amber-600 uppercase tracking-[0.2em]">DESTAQUES DO DIA</h4>
                  <div className="h-px bg-slate-100 flex-1 ml-6"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {featuredRecipes.map(r => (
                    <RecipeCard key={r.id} recipe={r} onClick={() => setSelectedRecipe(r)} isLarge />
                  ))}
                </div>
              </section>

              {/* Active Pillar Browse */}
              <section>
                <div className="mb-12">
                   <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">{activePillar}</h2>
                   <p className="text-slate-400 font-medium max-w-2xl text-lg">{currentPillar?.description}</p>
                </div>
                
                <div className="space-y-16">
                  {currentPillar?.subcategories.map(sub => (
                    <div key={sub.id}>
                      <div className="flex items-center justify-between mb-6 border-b border-slate-50 pb-4">
                        <h3 className="text-xl font-bold text-slate-800">{sub.name}</h3>
                        <button 
                          onClick={() => handleGenerateMore(sub)}
                          className="text-[10px] font-black text-emerald-700 uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          {isGenerating ? 'Gerando...' : 'Expandir +3'} <Plus size={12} />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {sub.recipes.map(r => (
                          <RecipeCard key={r.id} recipe={r} onClick={() => setSelectedRecipe(r)} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* RESULTS VIEW (Filter results) */}
          {view === 'results' && (
            <div className="p-8 md:p-12 max-w-7xl mx-auto animate-in slide-in-from-right-10 duration-500">
              <button onClick={() => { setView('dashboard'); setGoalFilter(null); setSearchQuery(''); }} className="flex items-center gap-2 text-[10px] font-black uppercase text-emerald-900 mb-8 hover:-translate-x-1 transition-transform">
                <ChevronLeft size={16} /> Voltar ao Início
              </button>
              
              <div className="mb-14">
                <h2 className="text-5xl font-extrabold tracking-tighter text-slate-900 mb-4 uppercase">
                  {goalFilter ? GOALS.find(g => g.id === goalFilter)?.name : 'Resultados da Busca'}
                </h2>
                <p className="text-slate-400 text-xl font-medium">Exibindo {filteredRecipes.length} protocolos compatíveis.</p>
              </div>

              {filteredRecipes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-32">
                  {filteredRecipes.map(r => (
                    <RecipeCard key={r.id} recipe={r} onClick={() => setSelectedRecipe(r)} />
                  ))}
                </div>
              ) : (
                <div className="py-32 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-100">
                  <p className="text-slate-400 font-bold text-lg mb-4">Nenhum protocolo encontrado.</p>
                  <button onClick={() => { setGoalFilter(null); setSearchQuery(''); setView('dashboard'); }} className="text-emerald-900 font-black uppercase tracking-widest text-xs underline">Limpar filtros</button>
                </div>
              )}
            </div>
          )}

          {/* TOOLKIT VIEW */}
          {view === 'toolkit' && (
            <div className="p-8 md:p-12 max-w-5xl mx-auto space-y-16 animate-in fade-in duration-500 pb-32">
              <div className="mb-12">
                <h2 className="text-5xl font-extrabold tracking-tighter text-slate-900 mb-4">SUPORTE TOOLKIT</h2>
                <p className="text-slate-400 font-medium text-lg">As ferramentas básicas para o sucesso do sistema.</p>
              </div>
              
              <section className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h3 className="text-2xl font-bold mb-8 flex items-center gap-3"><ShoppingBag className="text-emerald-900" /> Despensa Anti-inflamatória</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {PANTRY_CHECKLIST.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-2xl hover:bg-slate-50 transition-colors">
                      <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 shadow-sm">
                        <CheckCircle2 size={12} />
                      </div>
                      <span className="text-sm font-bold text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </main>

      {/* Recipe Modal */}
      {selectedRecipe && (
        <RecipeModal 
          recipe={selectedRecipe} 
          onClose={() => setSelectedRecipe(null)} 
          onPrev={handlePrev}
          onNext={handleNext}
          hasPrev={currentIndex > 0}
          hasNext={currentIndex < modalList.length - 1}
        />
      )}
    </div>
  );
}