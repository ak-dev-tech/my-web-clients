import { useState, useEffect, useRef, useMemo, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Clock, 
  MapPin, 
  ShoppingBag, 
  Flame, 
  Check, 
  ChevronRight, 
  Search, 
  X, 
  Share2, 
  Bike, 
  Users, 
  Leaf, 
  ArrowUpRight,
  Bot,
  CheckCircle2,
  ArrowLeft,
  Lock,
  ShieldCheck
} from 'lucide-react';
import { fetchLiveDrops, type DropItem } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface LiveDropsPageProps {
  onNavigate: (page: string) => void;
}

interface DropPool {
  id: string;
  name: string;
  hub: string;
  membersJoined: number;
  capacity: number;
  departureTime: string;
  co2SavedKg: number;
  courier: string;
  status: 'open' | 'almost_full' | 'departed';
}

const INITIAL_POOLS: DropPool[] = [
  {
    id: 'pool-1',
    name: 'BKC Business & Arts Hub',
    hub: 'The Foundry Lobby, G-Block, BKC, Mumbai',
    membersJoined: 9,
    capacity: 12,
    departureTime: '19:45 Today',
    co2SavedKg: 4.8,
    courier: 'Aria M. (Electric Cargo Bike)',
    status: 'almost_full'
  },
  {
    id: 'pool-2',
    name: 'Indiranagar & Koramangala Line',
    hub: 'Riverside Tower Concierge, 100ft Rd, Bengaluru',
    membersJoined: 11,
    capacity: 15,
    departureTime: '20:15 Today',
    co2SavedKg: 7.2,
    courier: 'Devon K. (Zero-Emission EV)',
    status: 'open'
  },
  {
    id: 'pool-3',
    name: 'Cyber City Tech Corridor',
    hub: 'Atrium East Reception, DLF Phase 2, Gurugram',
    membersJoined: 6,
    capacity: 8,
    departureTime: '20:30 Today',
    co2SavedKg: 3.6,
    courier: 'Maya S. (e-Bike Fleet)',
    status: 'almost_full'
  }
];

export function LiveDropsPage({ onNavigate }: LiveDropsPageProps) {
  // Paused millisecond countdown timer state (Static 00:00:00:00 until API connects)
  const timeLeft = {
    hours: 0,
    minutes: 0,
    seconds: 0,
    ms: 0
  };

  // API Live Drops state
  const [drops, setDrops] = useState<DropItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Synchronize live surplus feed upon component mount
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    fetchLiveDrops()
      .then((data) => {
        if (isMounted) {
          setDrops(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching live drops feed:', err);
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter & Search states
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'bakery' | 'plant' | 'patisserie' | 'gourmet'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected Drop Modal state
  const [selectedDrop, setSelectedDrop] = useState<DropItem | null>(null);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [isReserving, setIsReserving] = useState(false);

  // Zozo AI Concierge state
  const [dietaryChoice, setDietaryChoice] = useState<string>('Plant-Based');
  const [timeChoice, setTimeChoice] = useState<string>('Evening (18:00 – 20:00)');
  const [aiMatchResult, setAiMatchResult] = useState<DropItem | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Update default Zozo match once drops load
  useEffect(() => {
    if (drops.length > 0 && !aiMatchResult) {
      setAiMatchResult(drops[1] || drops[0]);
    }
  }, [drops, aiMatchResult]);

  // Drop Pools state
  const [dropPools, setDropPools] = useState<DropPool[]>(INITIAL_POOLS);
  const [joinedPools, setJoinedPools] = useState<string[]>([]);

  // Pre-registration Email waitlist state
  const [emailInput, setEmailInput] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [vipCode, setVipCode] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const categoryCounts = useMemo(() => {
    return {
      all: drops.length,
      bakery: drops.filter(d => d.category === 'bakery').length,
      plant: drops.filter(d => d.category === 'plant').length,
      patisserie: drops.filter(d => d.category === 'patisserie').length,
      gourmet: drops.filter(d => d.category === 'gourmet').length,
    };
  }, [drops]);

  const filteredDrops = useMemo(() => {
    return drops.filter(item => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      const matchQuery = 
        item.restaurant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.address.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [drops, selectedCategory, searchQuery]);

  const handleAskZozo = (diet: string, time: string) => {
    setDietaryChoice(diet);
    setTimeChoice(time);
    setIsAiThinking(true);

    setTimeout(() => {
      const activeList = drops.length > 0 ? drops : [];
      let matched: DropItem | null = activeList[0] || null;
      if (diet.includes('Plant')) {
        matched = activeList.find(d => d.category === 'plant') || activeList[1] || activeList[0] || null;
      } else if (diet.includes('Gluten') || diet.includes('Sweet')) {
        matched = activeList.find(d => d.category === 'patisserie') || activeList[2] || activeList[0] || null;
      } else if (diet.includes('Gourmet') || diet.includes('Italian')) {
        matched = activeList.find(d => d.cuisine.includes('Italian') || d.category === 'gourmet') || activeList[4] || activeList[0] || null;
      } else if (diet.includes('Bakery')) {
        matched = activeList.find(d => d.category === 'bakery') || activeList[0] || null;
      } else {
        matched = activeList[5] || activeList[0] || null;
      }
      setAiMatchResult(matched);
      setIsAiThinking(false);
    }, 450);
  };

  const handleJoinPool = (poolId: string) => {
    if (joinedPools.includes(poolId)) return;
    setJoinedPools(prev => [...prev, poolId]);
    setDropPools(prev => prev.map(p => {
      if (p.id === poolId) {
        return {
          ...p,
          membersJoined: p.membersJoined + 1,
          status: p.membersJoined + 1 >= p.capacity ? 'almost_full' : p.status
        };
      }
      return p;
    }));
  };

  const { user, signInWithGoogle } = useAuth();

  const handleWaitlistSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) return;
    const generatedVip = `FD-${Math.floor(1000 + Math.random() * 9000)}`;
    setVipCode(generatedVip);
    setIsSubmitted(true);

    try {
      await addDoc(collection(db, 'newsletter_leads'), {
        email: emailInput.trim(),
        source: 'livedrops_vip',
        createdAt: new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'newsletter_leads');
    }
  };

  const handleCopyVip = () => {
    navigator.clipboard?.writeText(`https://flashdrops.app/join?vip=${vipCode}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleReserveDropAction = async () => {
    let activeUser = user;
    if (!activeUser) {
      activeUser = await signInWithGoogle();
      if (!activeUser) return;
    }
    if (!selectedDrop) return;

    setIsReserving(true);
    try {
      const reservationCode = `DROP-${Math.floor(100000 + Math.random() * 900000)}`;
      await addDoc(collection(db, 'reservations'), {
        userId: activeUser.uid,
        userEmail: activeUser.email || '',
        dropId: String(selectedDrop.id),
        title: selectedDrop.title,
        restaurant: selectedDrop.restaurant,
        price: selectedDrop.price,
        originalPrice: selectedDrop.originalPrice,
        pickupWindow: selectedDrop.pickupWindow,
        status: 'reserved',
        reservationCode,
        createdAt: new Date().toISOString()
      });
      setIsReserving(false);
      setReservationSuccess(true);
    } catch (err) {
      setIsReserving(false);
      handleFirestoreError(err, OperationType.CREATE, 'reservations');
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F9F8F6] dark:bg-black text-slate-800 dark:text-zinc-100 font-sans pb-24 transition-colors duration-200">
      
      {/* Top back navigation breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button
          onClick={() => onNavigate('landing')}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-zinc-400 hover:text-[#1A2E3B] dark:hover:text-zinc-100 transition-colors p-1 rounded-md cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. HERO SECTION: "Flash Drops: The Surplus Food Community."               */}
      {/* ========================================================================= */}
      <section className="relative pt-16 pb-24 md:pt-24 md:pb-32 text-center">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          
          {/* Micro Pill Badge with Emerald Pulsing Live Dot */}
          <motion.div 
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800/80 text-xs tracking-wider uppercase font-semibold text-amber-800 dark:text-amber-300 mb-6 shadow-2xs"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Surplus Food Community · Vault Drop Protocol</span>
          </motion.div>

          {/* Main Title using Playfair Display font-serif */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-serif text-[#1A2E3B] dark:text-zinc-100 tracking-tight leading-[1.1] mb-4 max-w-4xl mx-auto"
          >
            Flash Drops: <br className="hidden sm:inline" />
            <span className="text-amber-600 dark:text-amber-400">
              The Surplus Food Community.
            </span>
          </motion.h1>

          {/* Subtitle with High-Legibility Typography */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-10 font-light"
          >
            Where fine culinary craft meets zero-waste exclusivity. Claim unreleased restaurant reserve batches and chef drops before they vanish.
          </motion.p>

          {/* Dynamic Millisecond-Precision Countdown Timer Card (Heartbeat Pulse Animation) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-xl mx-auto bg-white dark:bg-black/70 border border-slate-200/80 dark:border-white/10 rounded-2xl p-5 sm:p-6 shadow-sm dark:shadow-black/40 mb-10 relative group animate-heartbeat"
          >
            {/* Small badge above countdown: "Syncing Next Drop..." */}
            <div className="flex items-center justify-center mb-4">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 shadow-2xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-400"></span>
                </span>
                <span>Syncing Next Drop...</span>
              </span>
            </div>

            <div className="flex items-center justify-between mb-3 text-xs uppercase tracking-widest text-[#1A2E3B] dark:text-zinc-300 font-bold">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400 dark:text-zinc-400" />
                <span>Next Vault Drop Unlocks In</span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono">BATCH #FD-994</span>
            </div>

            {/* Countdown digits with tabular numbers - Paused Static State */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3 py-2 text-center font-mono opacity-85">
              <div className="bg-slate-50 dark:bg-[#142326]/80 rounded-xl p-3 border border-slate-200/80 dark:border-zinc-700">
                <div className="text-2xl sm:text-4xl font-extrabold text-[#1A2E3B]/80 dark:text-zinc-200 tabular-nums">
                  00
                </div>
                <div className="text-[10px] sm:text-xs text-slate-400 dark:text-zinc-500 uppercase tracking-wider mt-1">Hours</div>
              </div>
              <div className="bg-slate-50 dark:bg-[#142326]/80 rounded-xl p-3 border border-slate-200/80 dark:border-zinc-700">
                <div className="text-2xl sm:text-4xl font-extrabold text-[#1A2E3B]/80 dark:text-zinc-200 tabular-nums">
                  00
                </div>
                <div className="text-[10px] sm:text-xs text-slate-400 dark:text-zinc-500 uppercase tracking-wider mt-1">Mins</div>
              </div>
              <div className="bg-slate-50 dark:bg-[#142326]/80 rounded-xl p-3 border border-slate-200/80 dark:border-zinc-700">
                <div className="text-2xl sm:text-4xl font-extrabold text-[#1A2E3B]/80 dark:text-zinc-200 tabular-nums">
                  00
                </div>
                <div className="text-[10px] sm:text-xs text-slate-400 dark:text-zinc-500 uppercase tracking-wider mt-1">Secs</div>
              </div>
              <div className="bg-slate-50 dark:bg-[#142326]/80 rounded-xl p-3 border border-slate-200/80 dark:border-zinc-700">
                <div className="text-2xl sm:text-4xl font-extrabold text-slate-700 dark:text-zinc-300 tabular-nums">
                  00
                </div>
                <div className="text-[10px] sm:text-xs text-slate-400 dark:text-zinc-500 uppercase tracking-wider mt-1">.ms</div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-slate-600 dark:text-zinc-400 border-t border-slate-200 dark:border-zinc-800 pt-3">
              <span className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-400" />
                Featured: <strong className="text-[#1A2E3B] dark:text-zinc-200">Artisan Sourdough & Botanica Hearth</strong>
              </span>
            </div>
          </motion.div>

          {/* Primary CTA Buttons with Web Standard Hover Lift */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5"
          >
            {/* Pure gold strictly reserved for Primary Action Button */}
            <a
              href="#pre-register"
              className="w-full sm:w-auto min-h-[44px] px-8 py-3.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-slate-950 font-bold text-sm shadow-md hover:shadow-[0_0_20px_rgba(212,175,55,0.35)] hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Get Early Access</span>
              <ChevronRight className="w-4 h-4 text-slate-950" />
            </a>

            {/* Muted platinum / slate gray secondary button */}
            <a
              href="#surplus-feed"
              className="w-full sm:w-auto min-h-[44px] px-7 py-3.5 rounded-xl bg-white/95 dark:bg-black/80 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-200 border border-slate-200/80 dark:border-white/10 font-semibold text-sm shadow-2xs hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
            >
              <span>Explore Live Surplus Feed</span>
              <ArrowUpRight className="w-4 h-4 text-slate-500 dark:text-zinc-400" />
            </a>
          </motion.div>

          {/* Quantitative Proof Metrics Strip */}
          <div className="mt-16 pt-12 border-t border-slate-200 dark:border-zinc-800 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto text-left">
            <div>
              <div className="flex items-center gap-2">
                <div className="text-2xl sm:text-3xl font-bold font-mono text-[#1A2E3B] dark:text-zinc-100 tabular-nums tracking-tight">1,842 kg</div>
              </div>
              <div className="text-xs text-slate-500 dark:text-zinc-400 mt-1">Organic Surplus Saved</div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-600 dark:text-amber-400 tabular-nums tracking-tight">67% OFF</div>
              </div>
              <div className="text-xs text-slate-500 dark:text-zinc-400 mt-1">Average Member Savings</div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums tracking-tight">100%</div>
              </div>
              <div className="text-xs text-slate-500 dark:text-zinc-400 mt-1">Verified Kitchen Safety</div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <div className="text-2xl sm:text-3xl font-bold font-mono text-[#1A2E3B] dark:text-zinc-100 tabular-nums tracking-tight">&lt; 15 min</div>
              </div>
              <div className="text-xs text-slate-500 dark:text-zinc-400 mt-1">Neighborhood Pickup Windows</div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. SURPLUS FEED (INTERACTIVE GRID)                                        */}
      {/* ========================================================================= */}
      <section id="surplus-feed" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-18 pb-28 md:pt-24 md:pb-32">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-12 pb-6 border-b border-slate-200 dark:border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-800 dark:text-amber-300 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Live Inventory Exchange</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#1A2E3B] dark:text-zinc-100">
              Current Reserve Vault Drops
            </h2>
            <p className="text-sm text-slate-600 dark:text-zinc-400 mt-1">
              Curated daily batches from independent artisanal kitchens. Real-time stock meters update instantly.
            </p>
          </div>

          {/* Interactive Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search kitchen or dish..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white dark:bg-[#162227] border border-slate-200/80 dark:border-white/10 text-xs text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-400 focus:outline-none focus:border-amber-500 dark:focus:border-amber-400 transition-colors shadow-2xs min-h-[44px]"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Segmented Control (Smooth horizontal touch scrolling on mobile) */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap scrollbar-none select-none">
          {[
            { id: 'all', label: 'All Live Drops', count: categoryCounts.all },
            { id: 'bakery', label: 'Artisan Bakeries', count: categoryCounts.bakery },
            { id: 'plant', label: 'Plant-Based', count: categoryCounts.plant },
            { id: 'patisserie', label: 'Fine Patisserie', count: categoryCounts.patisserie },
            { id: 'gourmet', label: 'Gourmet Bistros', count: categoryCounts.gourmet }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id as any)}
              className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer flex-shrink-0 active:scale-95 ${
                selectedCategory === tab.id
                  ? 'bg-[#1A2E3B] dark:bg-amber-400 text-white dark:text-[#10181A] dark:font-bold shadow-sm'
                  : 'bg-white dark:bg-[#162227] text-slate-600 dark:text-zinc-200 hover:text-[#1A2E3B] dark:hover:text-white border border-slate-200/80 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] font-mono tabular-nums px-1.5 py-0.5 rounded-full ${
                selectedCategory === tab.id 
                  ? 'bg-white/20 dark:bg-[#10181A]/20 text-white dark:text-[#10181A]' 
                  : 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-zinc-300'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Sleek Loading State or Interactive Dynamic Drops Grid */}
        {isLoading ? (
          <div className="w-full rounded-3xl bg-[#0B0C0E]/95 border border-slate-700/60 dark:border-white/10 p-8 sm:p-12 md:p-16 text-center shadow-2xl relative overflow-hidden mb-12">
            {/* Ambient pure gold radial glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-slate-400/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#181922]/50 via-transparent to-[#0B0C0F]/90 pointer-events-none" />

            <div className="relative z-10 max-w-lg mx-auto flex flex-col items-center">
              {/* Animated subtle pulsing rings */}
              <div className="relative mb-6 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border-2 border-slate-700/60 animate-ping absolute" />
                <div className="w-16 h-16 rounded-full border border-slate-700 flex items-center justify-center bg-[#1B1D25] shadow-lg">
                  <Sparkles className="w-7 h-7 text-slate-300 dark:text-zinc-300 animate-pulse" />
                </div>
              </div>

              {/* Title with muted platinum gradient */}
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 tracking-wide mb-3">
                Syncing Live Surplus Feed...
              </h3>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed mb-7">
                Connecting to partner kitchens and reserving real-time surplus allocations across your local district.
              </p>

              {/* Sleek Muted Platinum Progress Meter */}
              <div className="w-full max-w-xs space-y-2">
                <div className="w-full h-1.5 bg-zinc-800/80 rounded-full overflow-hidden p-0.5 border border-zinc-700">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-slate-500 via-slate-200 to-zinc-400 dark:from-zinc-600 dark:via-zinc-200 dark:to-zinc-400 rounded-full shadow-[0_0_12px_rgba(255,255,255,0.25)]"
                    initial={{ width: "20%" }}
                    animate={{ width: ["20%", "85%", "65%", "98%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
                <div className="flex justify-between items-center text-[11px] font-mono text-zinc-400 px-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-zinc-300 animate-ping" />
                    <span>Real-time Surplus Stream</span>
                  </span>
                  <span className="tabular-nums">1.5s Latency</span>
                </div>
              </div>
            </div>

            {/* Sleek Charcoal & Frosted Glass Skeleton Preview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 text-left opacity-75">
              {[1, 2, 3].map((placeholder) => (
                <div 
                  key={placeholder}
                  className="bg-white/10 dark:bg-white/5 rounded-2xl border border-white/10 p-5 space-y-4 animate-pulse relative overflow-hidden"
                >
                  <div className="h-44 bg-zinc-800/60 rounded-xl relative overflow-hidden">
                    <div className="absolute top-3 left-3 w-20 h-5 bg-zinc-700/60 rounded-md" />
                    <div className="absolute top-3 right-3 w-12 h-5 bg-white/10 rounded-md" />
                  </div>
                  <div className="space-y-2 pt-1">
                    <div className="h-4 bg-zinc-700/60 rounded w-3/4" />
                    <div className="h-3 bg-zinc-800/60 rounded w-full" />
                    <div className="h-3 bg-zinc-800/60 rounded w-2/3" />
                  </div>
                  <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                    <div className="h-5 bg-white/10 rounded w-20" />
                    <div className="h-4 bg-zinc-800/60 rounded w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredDrops.map((drop, index) => {
              const isSoldOut = drop.status === 'sold_out';
              const isCritical = drop.remaining <= 3 && !isSoldOut;

              return (
                <div key={drop.id} className="relative group">
                  {/* Ambient Lighting: Soft radial glow (faint pistachio & warm amber) behind the individual card */}
                  <div className="absolute -inset-2 rounded-3xl bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.14),rgba(52,211,153,0.1),transparent_72%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.22),rgba(52,211,153,0.15),transparent_72%)] opacity-70 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none -z-10" />

                  {/* Card Container with edge-to-edge macro food photography background */}
                  <div
                    style={{ animationDelay: `${index * 65}ms` }}
                    onClick={() => {
                      setSelectedDrop(drop);
                      setReservationSuccess(false);
                    }}
                    className={`animate-card-populate transform transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl dark:hover:shadow-black/80 rounded-3xl border ${
                      isCritical 
                        ? 'border-amber-400/80 shadow-[0_0_24px_rgba(245,158,11,0.25)]' 
                        : isSoldOut 
                          ? 'border-slate-300 dark:border-white/10 opacity-75' 
                          : 'border-slate-200/80 dark:border-white/15 hover:border-amber-400/50 dark:hover:border-white/30'
                    } overflow-hidden flex flex-col justify-between cursor-pointer min-h-[480px] sm:min-h-[500px] relative text-white bg-slate-900 shadow-md`}
                  >
                    {/* Background: Edge-to-Edge Macro Food Photography with slow zoom-in on hover */}
                    <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
                      <img 
                        src={drop.image} 
                        alt={drop.title}
                        width="600"
                        height="500"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                      {/* Deep dark gradient overlay at bottom for maximum text legibility & contrast */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/98 via-black/85 via-45% to-black/35" />
                    </div>

                    {/* Top Floating Badges (Relative z-10) */}
                    <div className="relative z-10 p-5 sm:p-6 flex items-start justify-between gap-3">
                      {/* Status Badge */}
                      <div className="flex items-center gap-2">
                        {isSoldOut ? (
                          <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-black/90 text-slate-300 border border-slate-700 shadow-md">
                            Sold Out Today
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-700 text-white shadow-md flex items-center gap-1.5 border border-emerald-500/40">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            Live Drop
                          </span>
                        )}
                      </div>

                      {/* Discount Delta Ribbon */}
                      <div>
                        <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-[#FF5A1F] text-white shadow-md tabular-nums border border-orange-300/40">
                          -{drop.discountPercent}%
                        </span>
                      </div>
                    </div>

                    {/* Bottom Content with legibility protection (Relative z-10) */}
                    <div className="relative z-10 p-5 sm:p-6 pt-0 space-y-3.5">
                      {/* Kitchen Name & Cuisine */}
                      <div>
                        <div className="text-xs uppercase tracking-wider font-semibold text-amber-300 mb-1 flex items-center gap-1.5">
                          <span>{drop.restaurant}</span>
                          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" title="Verified Partner" />
                          <span className="text-[10px] text-zinc-300 font-mono">· {drop.cuisine}</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold font-serif text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                          {drop.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-zinc-300 line-clamp-2 leading-relaxed mt-1 font-light">
                          {drop.description}
                        </p>
                      </div>

                      {/* Price Delta Tags */}
                      <div className="flex items-baseline gap-2.5 font-mono pt-1">
                        <span className="text-2xl sm:text-3xl font-bold text-white tabular-nums tracking-tight">
                          ₹{drop.dropPrice.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs sm:text-sm text-zinc-400 line-through tabular-nums">
                          ₹{drop.retailPrice.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs font-semibold text-emerald-400 ml-auto tabular-nums bg-emerald-950/70 border border-emerald-800/80 px-2 py-0.5 rounded-md">
                          Save ₹{(drop.retailPrice - drop.dropPrice).toLocaleString('en-IN')}
                        </span>
                      </div>

                      {/* Stock Remaining Meter */}
                      <div className="space-y-1.5 bg-black/75 p-3 rounded-2xl border border-white/10">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-300 font-medium flex items-center gap-1.5">
                            <Flame className={`w-3.5 h-3.5 ${isCritical ? 'text-amber-400 animate-pulse' : 'text-zinc-400'}`} />
                            <span>Stock Remaining</span>
                          </span>
                          <span className={`font-mono font-bold tabular-nums ${
                            isSoldOut 
                              ? 'text-zinc-500' 
                              : isCritical 
                                ? 'text-amber-300' 
                                : 'text-zinc-200'
                          }`}>
                            {isSoldOut ? '0 of 10 remaining' : `${drop.remaining} of ${drop.total} remaining`}
                          </span>
                        </div>

                        {/* Progress Bar with animated width fill */}
                        <div className="w-full h-2 bg-zinc-800/90 rounded-full overflow-hidden p-0.5 border border-white/10">
                          <div 
                            className={`h-full rounded-full transition-all duration-700 ease-out ${
                              isSoldOut 
                                ? 'bg-zinc-700 w-0' 
                                : isCritical 
                                  ? 'bg-gradient-to-r from-amber-500 to-rose-500 animate-stock-glow' 
                                  : 'bg-gradient-to-r from-emerald-400 to-amber-400'
                            }`}
                            style={{ width: `${(drop.remaining / drop.total) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Pickup Details & Action CTA Button */}
                      <div className="space-y-3 pt-3 border-t border-white/10 text-xs text-zinc-300">
                        <div className="flex items-center justify-between gap-2 text-[11px]">
                          <div className="flex items-center gap-1.5 text-zinc-300 min-w-0">
                            <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span className="truncate">Pickup: <strong className="font-mono tabular-nums text-white font-medium">{drop.pickupWindow}</strong></span>
                          </div>
                          <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] shrink-0">
                            <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            <span className="truncate max-w-[130px] sm:max-w-[150px]">{drop.address}</span>
                          </div>
                        </div>

                        <button
                          disabled
                          aria-disabled="true"
                          className="w-full min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-2 cursor-not-allowed bg-white/15 dark:bg-zinc-800 text-zinc-200 border border-white/15 select-none"
                        >
                          <Lock className="w-3.5 h-3.5 text-zinc-400 opacity-80" />
                          <span>Opening Soon</span>
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!isLoading && filteredDrops.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-[#162227] rounded-2xl border border-slate-200 dark:border-zinc-800 p-8 shadow-sm">
            <ShoppingBag className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h4 className="text-lg font-bold font-serif text-[#1A2E3B] dark:text-zinc-100">No drops found in this category</h4>
            <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto mt-1 mb-4">
              Try switching your filter or clearing the search query to view active surplus drops.
            </p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="px-4 py-2 rounded-xl bg-[#0EA5E9] text-white text-xs font-bold cursor-pointer hover:bg-[#38BDF8] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 3. AI CONCIERGE ("ZOZO AI") & LOCAL DROP POOLS                            */}
      {/* ========================================================================= */}
      <section className="bg-slate-100/70 dark:bg-[#0E1619] border-y border-slate-200/80 dark:border-white/10 py-20 md:py-28 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800/80 px-3 py-1 rounded-full inline-block mb-3">
              Rescue Intelligence
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-[#1A2E3B] dark:text-zinc-100">
              Meet Zozo AI & Drop Pools
            </h2>
            <p className="text-sm text-slate-600 dark:text-zinc-400 mt-2">
              Personalized dietary vault matching meets collective neighborhood delivery logistics.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Zozo AI Concierge */}
            <div className="lg:col-span-6 bg-white/95 dark:bg-[#162227]/95 rounded-2xl border border-slate-200/80 dark:border-white/10 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200 dark:border-amber-800/80">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-serif text-[#1A2E3B] dark:text-zinc-100 flex items-center gap-2">
                      <span>Zozo AI Concierge</span>
                      <span className="text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                        Online
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">Personalized Surplus Dietary Match Engine</p>
                  </div>
                </div>
              </div>

              {/* Step 1: Select Dietary Profile */}
              <div className="space-y-3 mb-6">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 block">
                  1. Your Dietary Preference
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Plant-Based', 'Gluten-Sensitive', 'Artisan Bakery', 'Gourmet Italian', 'All Categories'].map(tag => (
                    <button
                      key={tag}
                      onClick={() => handleAskZozo(tag, timeChoice)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        dietaryChoice === tag
                          ? 'bg-[#1A2E3B] dark:bg-amber-400 text-white dark:text-[#10181A] dark:font-bold shadow-xs'
                          : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-zinc-200 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-white/10'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Time Window */}
              <div className="space-y-3 mb-6">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 block">
                  2. Pickup / Dine Time Window
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['Evening (18:00 – 20:00)', 'Late Vault (20:15 – 21:30)'].map(time => (
                    <button
                      key={time}
                      onClick={() => handleAskZozo(dietaryChoice, time)}
                      className={`p-2.5 rounded-xl text-left transition-all border cursor-pointer ${
                        timeChoice === time
                          ? 'bg-slate-100 dark:bg-white/15 border-amber-500 dark:border-amber-400 text-[#1A2E3B] dark:text-amber-300 font-semibold'
                          : 'bg-white dark:bg-[#162227] border-slate-200 dark:border-white/10 text-slate-500 dark:text-zinc-400 hover:text-slate-800'
                      }`}
                    >
                      <div>{time}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Zozo Match Output Card */}
              <div className="bg-slate-50 dark:bg-[#11171A] rounded-xl p-4 border border-slate-200 dark:border-white/10 relative">
                {isAiThinking ? (
                  <div className="py-8 flex flex-col items-center justify-center space-y-2 text-amber-600 dark:text-amber-400">
                    <Sparkles className="w-6 h-6 animate-spin" />
                    <span className="text-xs font-mono text-slate-600 dark:text-zinc-300">Zozo AI matching fresh surplus vaults...</span>
                  </div>
                ) : aiMatchResult ? (
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> 98% Match for your profile
                      </span>
                      <span className="text-amber-700 dark:text-amber-300 font-mono text-[11px] font-bold tabular-nums">
                        ₹{aiMatchResult.dropPrice.toLocaleString('en-IN')} (Was ₹{aiMatchResult.retailPrice.toLocaleString('en-IN')})
                      </span>
                    </div>

                    <div className="flex items-start gap-3 mt-2">
                      <img 
                        src={aiMatchResult.image} 
                        alt={aiMatchResult.title}
                        width="56"
                        height="56"
                        loading="lazy"
                        decoding="async"
                        className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-bold font-serif text-[#1A2E3B] dark:text-zinc-100 truncate">
                          {aiMatchResult.restaurant}: {aiMatchResult.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
                          {aiMatchResult.chefNote}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            disabled
                            aria-disabled="true"
                            className="px-3 py-1 bg-slate-100/90 dark:bg-[#142326]/80 text-slate-400 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700 text-[11px] font-semibold rounded-lg cursor-not-allowed flex items-center gap-1.5 select-none min-h-[36px]"
                          >
                            <Lock className="w-3 h-3 text-slate-400 dark:text-zinc-500 opacity-80" />
                            <span>Reservations Opening Soon</span>
                          </button>
                          <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-mono tabular-nums">
                            {aiMatchResult.remaining} boxes remaining
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Right Column: Local Drop Pool Events */}
            <div className="lg:col-span-6 space-y-6 content-visibility-auto">
              <div className="bg-white dark:bg-[#162227] rounded-2xl border border-slate-200/80 dark:border-white/10 p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10 mb-6">
                  <div>
                    <h3 className="text-lg font-bold font-serif text-[#1A2E3B] dark:text-zinc-100 flex items-center gap-2">
                      <Users className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                      <span>Neighborhood Drop Pools</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      Pool surplus orders with nearby neighbors. 1 consolidated electric bike run = 0 emissions + zero delivery fee.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {dropPools.map((pool, index) => {
                    return (
                      <div key={pool.id} className="relative group">
                        {/* Soft ambient radial glow */}
                        <div className="absolute -inset-1 rounded-2xl bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.12),rgba(245,158,11,0.08),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.18),rgba(245,158,11,0.12),transparent_70%)] opacity-60 group-hover:opacity-100 transition-opacity duration-500 blur-lg pointer-events-none -z-10" />

                        <div 
                          style={{ animationDelay: `${index * 85}ms` }}
                          className="animate-card-populate transform transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-black/60 p-4 sm:p-5 rounded-2xl bg-white/95 dark:bg-[#162227] border border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-amber-400/40"
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div>
                              <h4 className="text-sm sm:text-base font-bold text-[#1A2E3B] dark:text-zinc-100">{pool.name}</h4>
                              <p className="text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                <span>{pool.hub}</span>
                              </p>
                            </div>
                            <span className="text-xs font-semibold font-mono tabular-nums px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                              -{pool.co2SavedKg} kg CO₂
                            </span>
                          </div>

                          {/* Progress Meter with subtle glow */}
                          <div className="mt-3 space-y-1.5">
                            <div className="flex justify-between text-xs text-slate-500 dark:text-zinc-400">
                              <span className="flex items-center gap-1.5 font-medium">
                                <span>Pool Capacity</span>
                              </span>
                              <span className="font-mono tabular-nums text-slate-700 dark:text-zinc-300 font-semibold">
                                {pool.membersJoined} of {pool.capacity} joined
                              </span>
                            </div>
                            <div className="w-full h-2 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden p-0.5">
                              <div 
                                className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full transition-all duration-500 animate-stock-glow"
                                style={{ width: `${(pool.membersJoined / pool.capacity) * 100}%` }}
                              />
                            </div>
                          </div>

                          <div className="mt-3.5 pt-3 border-t border-slate-200/80 dark:border-white/10 flex flex-wrap items-center justify-between gap-2.5">
                            <span className="text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
                              <Bike className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                              <span>Courier: <strong className="text-slate-700 dark:text-zinc-300 font-normal">{pool.courier}</strong></span>
                            </span>

                            <button
                              disabled
                              aria-disabled="true"
                              className="min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-not-allowed bg-slate-100/90 dark:bg-white/10 text-slate-400 dark:text-zinc-400 border border-slate-200 dark:border-white/10 select-none flex items-center gap-1.5 shadow-2xs"
                            >
                              <Lock className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 opacity-80" />
                              <span>Pools Opening Soon</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                  <span>Pool participants receive 50 bonus Flash Coins and free collective delivery dispatch.</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. PRE-REGISTRATION FOOTER (GOOGLE PLAY LAUNCH WAITLIST)                 */}
      {/* ========================================================================= */}
      <section id="pre-register" className="max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-20 md:pt-28 md:pb-24 text-center">
        <div className="bg-white/95 dark:bg-[#162227]/95 rounded-3xl p-8 sm:p-12 border border-slate-200/80 dark:border-white/10 shadow-xl relative overflow-hidden">
          
          <div className="relative z-10 max-w-xl mx-auto space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800/80 px-3.5 py-1.5 rounded-full inline-block">
              Google Play Store Launch
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-[#1A2E3B] dark:text-zinc-100 leading-tight">
              Pre-Register for Early VIP Access
            </h2>

            <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 leading-relaxed font-light">
              Be among the first 1,000 founding members to receive prioritized notifications 15 minutes before daily Vault Drops go public.
            </p>

            {/* Email Capture Form: Disabled State for API Pending (Quiet Luxury Aesthetic) */}
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <input 
                    type="email"
                    disabled
                    aria-disabled="true"
                    value=""
                    placeholder="VIP Waitlist registration opening soon..."
                    className="w-full px-5 py-3.5 rounded-xl bg-slate-100/90 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/80 text-sm text-slate-400 dark:text-zinc-500 placeholder-slate-400 dark:placeholder-zinc-500 cursor-not-allowed select-none"
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                    <Lock className="w-4 h-4 text-slate-400 dark:text-zinc-500 opacity-60" />
                  </div>
                </div>
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  className="px-8 py-3.5 rounded-xl bg-slate-100/90 dark:bg-[#142326]/80 text-slate-400 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700/80 font-semibold text-sm cursor-not-allowed flex items-center justify-center gap-2 select-none flex-shrink-0 shadow-2xs"
                >
                  <Lock className="w-4 h-4 text-slate-400 dark:text-zinc-500 opacity-80" />
                  <span>Waitlist Opening Soon</span>
                </button>
              </div>
              <div className="flex items-center justify-center gap-6 text-xs text-slate-500 dark:text-zinc-400 pt-2">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-400" /> Priority Drop Allocation
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" /> Google Play Release
                </span>
              </div>
            </form>

            {/* Google Play Store Badge Mockup */}
            <div className="pt-6 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-center gap-4 text-xs text-slate-500 dark:text-zinc-400">
              <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-black px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-800">
                <div className="w-5 h-5 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-[#1A2E3B] dark:text-white">
                    <path d="M3.609 1.814L13.793 12 3.61 22.186c-.347-.367-.56-.874-.56-1.442V3.256c0-.568.213-1.075.56-1.442zM15.207 13.414l2.122 2.122-12.82 7.402 10.698-9.524zm0-2.828L4.509 1.062l12.82 7.402-2.122 2.122zm1.414 1.414l3.182-1.837c.725-.418.725-1.101 0-1.52l-3.182-1.837-2.121 2.121 2.121 2.073z" />
                  </svg>
                </div>
                <div className="text-left leading-tight">
                  <div className="text-[9px] uppercase tracking-wider text-slate-400">Coming Soon on</div>
                  <div className="text-xs font-bold text-[#1A2E3B] dark:text-white">Google Play Store</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. INTERACTIVE VAULT DROP RESERVATION MODAL                                */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedDrop && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSelectedDrop(null)}
              className="absolute inset-0 bg-black/75 dark:bg-black/85"
            />

            {/* Modal Dialog matching Web Modal Architecture */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full max-w-lg bg-white dark:bg-[#162227] rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden z-10 text-left max-h-[90vh] flex flex-col"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedDrop(null)}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 text-white hover:bg-black/80 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Image Header */}
              <div className="relative aspect-[16/10] sm:aspect-[21/9] h-44 w-full bg-slate-100 dark:bg-[#142326] flex-shrink-0 overflow-hidden">
                <img 
                  src={selectedDrop.image} 
                  alt={selectedDrop.title}
                  width="600"
                  height="350"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-6 right-6 text-white">
                  <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-amber-300 font-semibold mb-0.5">
                    <span>{selectedDrop.restaurant}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  </div>
                  <h3 className="text-xl font-bold font-serif leading-tight">
                    {selectedDrop.title}
                  </h3>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-5 flex-1">
                
                {/* Price and Stock strip */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-[#142326] border border-slate-200 dark:border-white/10">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-zinc-400">Vault Price</div>
                    <div className="text-2xl font-bold font-mono text-[#1A2E3B] dark:text-amber-400 tabular-nums">
                      ₹{selectedDrop.dropPrice.toLocaleString('en-IN')}
                      <span className="text-xs text-slate-400 dark:text-zinc-500 font-normal line-through ml-2 tabular-nums font-mono">
                        ₹{selectedDrop.retailPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-zinc-400">
                      Availability
                    </div>
                    <div className="text-sm font-bold text-amber-600 dark:text-amber-400 font-mono tabular-nums">
                      {selectedDrop.remaining} of {selectedDrop.total} Left
                    </div>
                  </div>
                </div>

                {/* Chef's Note */}
                <div className="space-y-1.5">
                  <h4 className="text-xs uppercase font-bold tracking-wider text-amber-700 dark:text-amber-400">
                    Chef’s Kitchen Note
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-zinc-200 leading-relaxed bg-slate-50 dark:bg-[#142326]/60 p-3 rounded-xl border border-slate-200 dark:border-white/10">
                    "{selectedDrop.chefNote}"
                  </p>
                </div>

                {/* Dietary Tags */}
                <div className="space-y-1.5">
                  <h4 className="text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-zinc-400">
                    Dietary & Ingredients
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedDrop.dietaryTags.map(tag => (
                      <span key={tag} className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-[#142326] text-slate-700 dark:text-zinc-200 text-[11px] border border-slate-200 dark:border-white/10">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pickup Window */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#142326]/60 border border-slate-200 dark:border-white/10 space-y-1 text-xs">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-zinc-200">
                    <Clock className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                    <span className="font-semibold">Pickup Window: <span className="font-mono tabular-nums font-normal">{selectedDrop.pickupWindow}</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-400">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{selectedDrop.address}</span>
                  </div>
                </div>

                {/* Success alert */}
                {reservationSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 text-xs space-y-1"
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Vault Pass Reserved Successfully!
                    </div>
                    <p className="text-slate-600 dark:text-zinc-300 text-[11px]">
                      Your pickup pass has been generated. Show your digital token at {selectedDrop.restaurant} during your window.
                    </p>
                  </motion.div>
                )}

              </div>

              {/* Modal Footer: Action Button */}
              <div className="p-6 pt-0 border-t border-slate-100 dark:border-white/10 mt-auto">
                <button
                  onClick={handleReserveDropAction}
                  disabled={isReserving || reservationSuccess}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-md cursor-pointer ${
                    reservationSuccess 
                      ? 'bg-emerald-600 text-white cursor-default'
                      : 'bg-amber-500 hover:bg-amber-400 active:scale-98 text-zinc-950 hover:shadow-amber-500/20'
                  }`}
                >
                  {isReserving ? (
                    <span>Securing Vault Pass...</span>
                  ) : reservationSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Vault Pass Confirmed</span>
                    </>
                  ) : (
                    <>
                      <Flame className="w-4 h-4" />
                      <span>{user ? `Claim Drop for $${selectedDrop.price.toFixed(2)}` : 'Sign In with Google to Reserve'}</span>
                    </>
                  )}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
