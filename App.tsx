
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Menu, 
  ChevronRight, 
  ChevronLeft,
  Clock, 
  Zap, 
  Leaf, 
  ChefHat, 
  ShoppingBag, 
  Calendar,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  X,
  Plus,
  Activity,
  Award,
  BookOpen,
  Filter,
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

// --- UI Components ---

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

const Button: React.FC<{ 
  onClick?: (e: React.MouseEvent) => void; 
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'dark';
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}> = ({ onClick, variant = 'primary', children, className = '', disabled }) => {
  const variants = {
    primary: 'bg-emerald-900 text-white hover:bg-emerald-950 shadow-sm',
    secondary: 'bg-teal-600 text-white hover:bg-teal-700',
    dark: 'bg-slate-900 text-white hover:bg-black',
    ghost: 'bg-transparent text-emerald-900 hover:bg-emerald-50',
    outline: 'border border-slate-200 text-slate-600 hover:border-emerald-900 hover:text-emerald-900'
  };
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const RecipeCard: React.FC<{ recipe: Recipe; onClick: () => void; isLarge?: boolean }> = ({ recipe, onClick, isLarge }) => (
  <div 
    onClick={(e) => { e.stopPropagation(); onClick(); }}
    className={`bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col h-full ${isLarge ? 'p-8' : 'p-6'}`}
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
    <h3 className={`${isLarge ? 'text-2xl' : 'text-lg'} font-bold text-slate-900 group-hover:text-emerald-900 transition-colors mb-2 leading-tight`}>
      {recipe.name}
    </h3>
    <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
      {recipe.functionalAction}
    </p>
    <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
      <span className="text-[10px] font-black text-emerald-900 uppercase tracking-widest flex items-center gap-2">
        Ativar <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
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
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}> = ({ recipe, onClose, onPrev, onNext, hasPrev, hasNext }) => {
  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Actions Bar */}
        <div className="sticky top-0 right-0 z-50 p-6 flex justify-end gap-3 pointer-events-none">
          {hasPrev && (
            <button onClick={onPrev} className="pointer-events-auto bg-white/90 hover:bg-white text-slate-900 p-2.5 rounded-full shadow-lg backdrop-blur-md transition-all active:scale-90">
              <ChevronLeft size={24} />
            </button>
          )}
          {hasNext && (
            <button onClick={onNext} className="pointer-events-auto bg-white/90 hover:bg-white text-slate-900 p-2.5 rounded-full shadow-lg backdrop-blur-md transition-all active:scale-90">
              <ChevronRight size={24} />
            </button>
          )}
          <button onClick={onClose} className="pointer-events-auto bg-emerald-900 text-white p-2.5 rounded-full shadow-lg transition-all active:scale-90">
            <X size={24} />
          </button>
        </div>

        <div className="relative -mt-20"> {/* Offset for sticky bar */}
          <div className="h-64 bg-slate-100 overflow-hidden flex items-end relative">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent z-10"></div>
            <img 
              src={`https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=1200`} 
              alt={recipe.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="relative z-20 p-10 w-full">
              <Tag variant="success">Protocolo de Ativação</Tag>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-2 leading-tight">{recipe.name}</h2>
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
                <div className="flex items-center gap-6 mb-8">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-slate-300 uppercase mb-1">Tempo</span>
                    <span className="text-sm font-bold text-slate-900 flex items-center gap-1"><Clock size={14}/> {recipe.time}m</span>
                  </div>
                  <div className="w-px h-8 bg-slate-100"></div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-slate-300 uppercase mb-1">Dificuldade</span>
                    <span className="text-sm font-bold text-slate-900">{recipe.difficulty}</span>
                  </div>
                </div>

                <h4 className="font-bold text-slate-900 uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                  <Sparkles size={16} className="text-emerald-600" /> Modo de Preparo
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
                <div className="p-8 bg-amber-50 rounded-3xl border border-amber-100">
                  <h5 className="font-black text-[10px] text-amber-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Award size={14} /> Dica do Chef
                  </h5>
                  <p className="text-amber-900 text-sm font-semibold leading-relaxed">{recipe.chefTip}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Filters & Goals ---

interface GoalFilter {
  id: string;
  name: string;
  icon: React.ReactNode;
  keywords: string[];
}

const GOALS: GoalFilter[] = [
  { id: 'weight', name: 'Emagrecimento', icon: <Flame size={20} />, keywords: ['saciedade', 'emagrecimento', 'queima', 'metabolismo', 'magra', 'fome'] },
  { id: 'pain', name: 'Alívio de Dor', icon: <Stethoscope size={20} />, keywords: ['dor', 'analgésico', 'inflamação', 'articulações', 'cabeça'] },
  { id: 'bloat', name: 'Desinflamar', icon: <Droplets size={20} />, keywords: ['inchaço', 'retenção', 'diurético', 'desinflamar', 'detox'] },
  { id: 'energy', name: 'Foco & Energia', icon: <ZapIcon size={20} />, keywords: ['energia', 'foco', 'disposição', 'cafeína', 'ânimo'] },
  { id: 'gut', name: 'Saúde Intestinal', icon: <Smile size={20} />, keywords: ['intestinal', 'digestão', 'fibras', 'estômago', 'flora'] }
];

// --- Main App ---

export default function App() {
  const [view, setView] = useState<'welcome' | 'dashboard' | 'results' | 'toolkit'>('welcome');
  const [activePillar, setActivePillar] = useState<PillarType>(PillarType.PHARMACY);
  const [activeSub, setActiveSub] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [pillars, setPillars] = useState<Pillar[]>(INITIAL_PILLARS);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<number | null>(null);
  const [goalFilter, setGoalFilter] = useState<string | null>(null);

  const allRecipes = useMemo(() => pillars.flatMap(p => p.subcategories.flatMap(s => s.recipes)), [pillars]);
  const featuredRecipes = useMemo(() => allRecipes.filter(r => r.isFeatured), [allRecipes]);

  const filteredRecipes = useMemo(() => {
    let result = allRecipes;
    if (searchQuery) {
      result = result.filter(r => 
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        r.functionalAction.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (difficultyFilter) result = result.filter(r => r.difficulty === difficultyFilter);
    if (timeFilter) result = result.filter(r => parseInt(r.time) <= timeFilter);
    if (goalFilter) {
      const g = GOALS.find(goal => goal.id === goalFilter);
      if (g) {
        result = result.filter(r => 
          g.keywords.some(k => 
            r.name.toLowerCase().includes(k) || 
            r.functionalAction.toLowerCase().includes(k) ||
            r.category.toLowerCase().includes(k)
          )
        );
      }
    }
    return result;
  }, [searchQuery, allRecipes, difficultyFilter, timeFilter, goalFilter]);

  // Modal Navigation Logic
  const { currentModalContext, currentIndex } = useMemo(() => {
    if (!selectedRecipe) return { currentModalContext: [], currentIndex: -1 };
    
    // If the modal was opened from a search or goal filter, navigate within the filtered list
    if (searchQuery || goalFilter || difficultyFilter || timeFilter || view === 'results') {
      const idx = filteredRecipes.findIndex(r => r.id === selectedRecipe.id);
      return { currentModalContext: filteredRecipes, currentIndex: idx };
    }

    // Otherwise navigate within the subcategory
    const allSubs = pillars.flatMap(p => p.subcategories);
    const sub = allSubs.find(s => s.id === selectedRecipe.category);
    if (!sub) return { currentModalContext: [], currentIndex: -1 };
    const idx = sub.recipes.findIndex(r => r.id === selectedRecipe.id);
    return { currentModalContext: sub.recipes, currentIndex: idx };
  }, [selectedRecipe, pillars, filteredRecipes, searchQuery, goalFilter, difficultyFilter, timeFilter, view]);

  const handlePrev = () => {
    if (currentIndex > 0) setSelectedRecipe(currentModalContext[currentIndex - 1]);
  };

  const handleNext = () => {
    if (currentIndex < currentModalContext.length - 1) setSelectedRecipe(currentModalContext[currentIndex + 1]);
  };

  const handleGenerateMore = async (sub: SubCategory) => {
    setIsGenerating(true);
    try {
      const more = await generateMoreRecipes(sub.name, sub.description);
      setPillars(prev => prev.map(p => ({
        ...p,
        subcategories: p.subcategories.map(s => s.id === sub.id ? { ...s, recipes: [...s.recipes, ...more] } : s)
      })));
    } catch (error) {
      console.error(error);
    } finally { setIsGenerating(false); }
  };

  const currentPillar = pillars.find(p => p.type === activePillar);

  if (view === 'welcome') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center max-w-5xl mx-auto">
        <div className="mb-10 p-5 bg-emerald-900 rounded-3xl text-white shadow-2xl">
          <Leaf className="w-12 h-12" />
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-slate-900 tracking-tighter">
          BIO<span className="text-emerald-900">COZINHA</span>
        </h1>
        <p className="text-xl text-slate-500 mb-12 max-w-xl font-medium">O manual inteligente que transforma sua cozinha em uma estação de cura natural.</p>
        <Button onClick={() => setView('dashboard')} className="py-5 px-10 text-lg rounded-2xl shadow-xl shadow-emerald-900/10">INICIAR PROTOCOLO</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col md:flex-row font-sans text-slate-900">
      {/* Sidebar - Enhanced Minimalism */}
      <aside className="w-full md:w-72 bg-white border-r border-slate-100 p-8 flex flex-col gap-8 md:sticky md:top-0 md:h-screen">
        <div className="flex items-center gap-3 cursor-pointer group mb-4" onClick={() => setView('welcome')}>
           <div className="bg-emerald-900 p-2 rounded-xl text-white">
             <Leaf size={20} />
           </div>
           <h1 className="text-lg font-black tracking-tight">BioCozinha</h1>
        </div>

        <nav className="flex flex-col gap-1.5">
          <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-4 mb-2">SISTEMA</h4>
          <button 
            onClick={() => { setView('dashboard'); setActivePillar(PillarType.PHARMACY); setGoalFilter(null); setActiveSub(null); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${view === 'dashboard' && activePillar === PillarType.PHARMACY ? 'bg-emerald-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Zap size={18} /> Farmácia
          </button>
          <button 
            onClick={() => { setView('dashboard'); setActivePillar(PillarType.CHRONOMETER); setGoalFilter(null); setActiveSub(null); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${view === 'dashboard' && activePillar === PillarType.CHRONOMETER ? 'bg-emerald-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Clock size={18} /> Cronômetro
          </button>
          <button 
            onClick={() => { setView('dashboard'); setActivePillar(PillarType.ECONOMIST); setGoalFilter(null); setActiveSub(null); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${view === 'dashboard' && activePillar === PillarType.ECONOMIST ? 'bg-emerald-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <ShoppingBag size={18} /> Economista
          </button>
          <div className="h-px bg-slate-100 my-4 mx-4"></div>
          <button 
            onClick={() => setView('toolkit')}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${view === 'toolkit' ? 'bg-emerald-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Calendar size={18} /> Toolkits
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-4 flex flex-col gap-4 sticky top-0 z-40">
          <div className="flex items-center justify-between gap-6">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input 
                type="text" placeholder="Busca inteligente (ex: inchaço, gengibre)..."
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-emerald-900/10 outline-none"
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="hidden lg:flex items-center gap-4">
              <div className="text-right">
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Status</p>
                <p className="text-xs font-bold text-emerald-900">Protocolo Ativo</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-900 flex items-center justify-center font-black text-xs border border-emerald-100">BC</div>
            </div>
          </div>
          
          {/* Quick Filters */}
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest shrink-0">Filtros</span>
            <button onClick={() => setDifficultyFilter(difficultyFilter === 'Fácil' ? null : 'Fácil')} className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${difficultyFilter === 'Fácil' ? 'bg-emerald-900 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}>Fácil</button>
            <button onClick={() => setTimeFilter(timeFilter === 10 ? null : 10)} className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${timeFilter === 10 ? 'bg-emerald-900 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}>10 Min</button>
            {(searchQuery || difficultyFilter || timeFilter) && (
              <button onClick={() => { setSearchQuery(''); setDifficultyFilter(null); setTimeFilter(null); }} className="text-red-400 text-[10px] font-black uppercase flex items-center gap-1 hover:text-red-600">Limpar <X size={10} /></button>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto no-scrollbar bg-[#FDFDFD]">
          {/* View Dashboard */}
          {view === 'dashboard' && (
            <div className="p-8 md:p-12 max-w-7xl mx-auto space-y-16 animate-in fade-in duration-500">
              
              {/* Problem Cards - New UX Action */}
              <section>
                <h4 className="text-[10px] font-black text-emerald-900 uppercase tracking-[0.3em] mb-8">FOCO DE SAÚDE</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {GOALS.map(goal => (
                    <button 
                      key={goal.id}
                      onClick={() => { setGoalFilter(goal.id); setView('results'); }}
                      className="group bg-white border border-slate-100 p-6 rounded-[2.5rem] text-left hover:shadow-xl hover:border-emerald-200 transition-all flex flex-col items-start gap-4"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-emerald-900 group-hover:text-white transition-all">
                        {goal.icon}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 leading-tight">{goal.name}</p>
                        <p className="text-[9px] font-black text-slate-300 uppercase mt-1 tracking-widest">Ativar</p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              {/* Featured Section */}
              <section>
                <div className="flex items-center justify-between mb-8">
                  <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-[0.3em]">DESTAQUES ESTRATÉGICOS</h4>
                  <div className="h-px bg-slate-100 flex-1 ml-6"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {featuredRecipes.map(r => (
                    <RecipeCard key={r.id} recipe={r} onClick={() => setSelectedRecipe(r)} isLarge />
                  ))}
                </div>
              </section>

              {/* Pillars Display */}
              <section>
                <div className="mb-12">
                   <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">{activePillar}</h2>
                   <p className="text-slate-400 font-medium max-w-2xl">{currentPillar?.description}</p>
                </div>
                
                <div className="space-y-16">
                  {currentPillar?.subcategories.map(sub => (
                    <div key={sub.id}>
                      <div className="flex items-center justify-between mb-6 border-b border-slate-50 pb-4">
                        <h3 className="text-xl font-bold text-slate-800">{sub.name}</h3>
                        <Button variant="outline" className="text-[10px] px-3 py-1.5" onClick={() => handleGenerateMore(sub)}>
                          {isGenerating ? 'Gerando...' : 'Expandir +3'}
                        </Button>
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

          {/* View Results - Dedicated Filter Screen */}
          {view === 'results' && (
            <div className="p-8 md:p-12 max-w-7xl mx-auto animate-in slide-in-from-right-10 duration-500">
              <button onClick={() => { setView('dashboard'); setGoalFilter(null); }} className="flex items-center gap-2 text-[10px] font-black uppercase text-emerald-900 mb-8 hover:translate-x-[-4px] transition-transform">
                <ChevronLeft size={14} /> Voltar ao Início
              </button>
              
              <div className="mb-12">
                <div className="flex items-center gap-3 text-emerald-900 font-black text-[10px] mb-4">
                  <Activity size={16} /> PROTOCOLOS SELECIONADOS
                </div>
                <h2 className="text-5xl font-extrabold tracking-tight text-slate-900">
                  {goalFilter ? GOALS.find(g => g.id === goalFilter)?.name : 'Resultados da Busca'}
                </h2>
                <p className="text-slate-400 mt-4 text-lg font-medium">Exibindo {filteredRecipes.length} protocolos científicos baseados na sua necessidade.</p>
              </div>

              {filteredRecipes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
                  {filteredRecipes.map(r => (
                    <RecipeCard key={r.id} recipe={r} onClick={() => setSelectedRecipe(r)} />
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                  <p className="text-slate-400 font-bold">Nenhum protocolo encontrado para este filtro.</p>
                </div>
              )}
            </div>
          )}

          {/* View Toolkit */}
          {view === 'toolkit' && (
            <div className="p-8 md:p-12 max-w-5xl mx-auto space-y-16 animate-in fade-in duration-500 pb-24">
              <div className="mb-12">
                <h2 className="text-5xl font-extrabold tracking-tight text-slate-900 mb-4">TOOLKITS</h2>
                <p className="text-slate-400 font-medium text-lg">Suporte estratégico para o seu dia a dia.</p>
              </div>
              
              <section className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h3 className="text-2xl font-bold mb-8 flex items-center gap-3"><ShoppingBag className="text-emerald-900" /> Despensa Básica</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {PANTRY_CHECKLIST.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <CheckCircle2 size={12} />
                      </div>
                      <span className="text-sm font-semibold text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-slate-900 p-10 rounded-[2.5rem] text-white">
                <h3 className="text-2xl font-bold mb-8 flex items-center gap-3"><Calendar className="text-emerald-500" /> Cardápio Mestre</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/10">
                        <th className="pb-4 px-4">Dia</th>
                        <th className="pb-4 px-4">Manhã</th>
                        <th className="pb-4 px-4">Principal</th>
                        <th className="pb-4 px-4">Noite</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'].map(dia => (
                        <tr key={dia}>
                          <td className="py-4 px-4 font-bold text-emerald-400">{dia}</td>
                          <td className="py-4 px-4 text-slate-500 text-xs italic">Protocolo...</td>
                          <td className="py-4 px-4 text-slate-500 text-xs italic">Protocolo...</td>
                          <td className="py-4 px-4 text-slate-500 text-xs italic">Protocolo...</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Footer Nav */}
      <footer className="md:hidden fixed bottom-6 left-6 right-6 bg-slate-900 text-white px-8 py-5 flex justify-around items-center rounded-3xl z-[60] shadow-2xl">
        <button onClick={() => { setView('dashboard'); setActivePillar(PillarType.PHARMACY); }} className={activePillar === PillarType.PHARMACY ? 'text-emerald-400' : 'text-slate-500'}><Zap size={20} /></button>
        <button onClick={() => { setView('dashboard'); setActivePillar(PillarType.CHRONOMETER); }} className={activePillar === PillarType.CHRONOMETER ? 'text-emerald-400' : 'text-slate-500'}><Clock size={20} /></button>
        <button onClick={() => setView('toolkit')} className={view === 'toolkit' ? 'text-emerald-400' : 'text-slate-500'}><Calendar size={20} /></button>
      </footer>

      {/* Recipe Modal */}
      {selectedRecipe && (
        <RecipeModal 
          recipe={selectedRecipe} 
          onClose={() => setSelectedRecipe(null)} 
          onPrev={handlePrev}
          onNext={handleNext}
          hasPrev={currentIndex > 0}
          hasNext={currentIndex < currentModalContext.length - 1}
        />
      )}
    </div>
  );
}
