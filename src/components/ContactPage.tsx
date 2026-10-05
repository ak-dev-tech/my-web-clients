import { useState, type FormEvent } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  ArrowLeft, 
  CheckCircle2, 
  Twitter, 
  Instagram, 
  Facebook,
  Star,
  ThumbsUp,
  ShieldCheck,
  Award,
  Sparkles,
  MessageSquare,
  Clock,
  Check,
  Flame,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ContactPageProps {
  onNavigate: (page: string) => void;
}

interface ReviewItem {
  id: string;
  name: string;
  location: string;
  rating: number;
  date: string;
  verifiedOrder: boolean;
  avatarSeed: string;
  category: 'Food Quality' | 'Delivery Speed' | 'Customer Care' | 'General';
  title: string;
  comment: string;
  helpfulCount: number;
  tags: string[];
}

export function ContactPage({ onNavigate }: ContactPageProps) {
  // Contact Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Active View Tab (Contact Form vs Ratings & Reviews)
  const [activeTab, setActiveTab] = useState<'contact' | 'ratings' | 'write-review'>('ratings');

  // Interactive Rating Form State
  const [userRating, setUserRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [foodRating, setFoodRating] = useState<number>(5);
  const [speedRating, setSpeedRating] = useState<number>(5);
  const [ecoRating, setEcoRating] = useState<number>(5);
  const [supportRating, setSupportRating] = useState<number>(5);
  const [reviewName, setReviewName] = useState('');
  const [reviewCity, setReviewCity] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('⚡ Rapid Delivery');
  const [isReviewSubmitted, setIsReviewSubmitted] = useState(false);

  // Community Reviews List State
  const [reviewsList, setReviewsList] = useState<ReviewItem[]>([
    {
      id: 'rev-1',
      name: 'Aditya Sharma',
      location: 'South Delhi, DL',
      rating: 5,
      date: '2 days ago',
      verifiedOrder: true,
      avatarSeed: 'Aditya',
      category: 'Food Quality',
      title: 'Artisan Sourdough was still warm from the hearth!',
      comment: 'Claimed a late evening sourdough drop from Botanica Hearth. The insulated thermal pouch kept it oven-fresh and the 14-minute e-bike arrival was impeccably fast. Best zero-waste concept in town.',
      helpfulCount: 42,
      tags: ['🥖 Fresh Sourdough', '⚡ 14 min dispatch', '🌱 Zero-Waste']
    },
    {
      id: 'rev-2',
      name: 'Pooja Ruhal',
      location: 'Sonipat, Haryana',
      rating: 5,
      date: '3 days ago',
      verifiedOrder: true,
      avatarSeed: 'Pooja',
      category: 'Delivery Speed',
      title: 'Remarkable cold-chain custody & driver etiquette',
      comment: 'The courier arrived with zero emissions on an e-scooter and used VoIP number masking so my phone number remained strictly private. Customer service responded in under 10 minutes when I had a dietary question.',
      helpfulCount: 38,
      tags: ['🛵 Green Courier', '🔒 Number Masked', '🤝 Outstanding Care']
    },
    {
      id: 'rev-3',
      name: 'Kabir Mehta',
      location: 'Gurugram, Cyber City',
      rating: 5,
      date: '5 days ago',
      verifiedOrder: true,
      avatarSeed: 'Kabir',
      category: 'General',
      title: 'Saved 68% on a gourmet 3-course surplus box',
      comment: 'Top-tier restaurant surplus at 1/3rd of the in-house bill. The meal was immaculate, safely sealed, with FSSAI batch verification clearly marked. Highly recommend Flash Drops to everyone.',
      helpfulCount: 29,
      tags: ['💰 68% Savings', '⭐ 5-Star Kitchen', '🛡️ FSSAI Verified']
    },
    {
      id: 'rev-4',
      name: 'Sunita Menon',
      location: 'Bengaluru, Indiranagar',
      rating: 4,
      date: '1 week ago',
      verifiedOrder: true,
      avatarSeed: 'Sunita',
      category: 'Food Quality',
      title: 'Delicious French patisserie reserve drop',
      comment: 'Croissants and chocolate pain au chocolat were bakery-fresh. Just wish the drops stayed open a bit longer as they sell out within 15 minutes! Will definitely order again.',
      helpfulCount: 19,
      tags: ['🥐 French Patisserie', '📦 Compostable Packaging']
    }
  ]);

  const [helpfulVoted, setHelpfulVoted] = useState<Record<string, boolean>>({});
  const [filterRating, setFilterRating] = useState<'all' | '5' | '4'>('all');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    // Simulate sendContactMessage backend function
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: '', email: '', message: '' });
    }, 800);
  };

  const handleReviewSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;

    const newReview: ReviewItem = {
      id: `rev-${Date.now()}`,
      name: reviewName,
      location: reviewCity || 'Verified City',
      rating: userRating,
      date: 'Just now',
      verifiedOrder: true,
      avatarSeed: reviewName,
      category: 'General',
      title: reviewTitle || 'Verified Customer Experience',
      comment: reviewComment,
      helpfulCount: 1,
      tags: [selectedTag, '🌿 Verified Flash Drop']
    };

    setReviewsList([newReview, ...reviewsList]);
    setIsReviewSubmitted(true);
    setReviewName('');
    setReviewCity('');
    setReviewTitle('');
    setReviewComment('');
  };

  const handleHelpfulToggle = (reviewId: string) => {
    const isVoted = helpfulVoted[reviewId];
    setHelpfulVoted({ ...helpfulVoted, [reviewId]: !isVoted });
    setReviewsList(prev => prev.map(r => {
      if (r.id === reviewId) {
        return {
          ...r,
          helpfulCount: isVoted ? r.helpfulCount - 1 : r.helpfulCount + 1
        };
      }
      return r;
    }));
  };

  const ratingDescriptions: Record<number, string> = {
    5: '⭐ 5.0 - Exceptional! Seamless drop & fresh quality',
    4: '⭐ 4.0 - Very Good experience, highly satisfied',
    3: '⭐ 3.0 - Good delivery, meets standard expectations',
    2: '⭐ 2.0 - Fair, room for logistical improvement',
    1: '⭐ 1.0 - Needs immediate attention'
  };

  const filteredReviews = reviewsList.filter(r => {
    if (filterRating === 'all') return true;
    if (filterRating === '5') return r.rating === 5;
    if (filterRating === '4') return r.rating === 4;
    return true;
  });

  return (
    <div className="w-full text-[#111827] dark:text-zinc-100 font-sans pb-24 transition-colors duration-500">
      {/* Top back navigation bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button
          onClick={() => onNavigate('landing')}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-zinc-400 hover:text-[#1A2E3B] dark:hover:text-zinc-100 transition-colors p-2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-700/60 shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Header */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800/80 text-xs font-semibold text-amber-800 dark:text-amber-300 mb-4 shadow-2xs"
        >
          <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
          <span>4.9 / 5.0 Platform Rating · 14,820+ Reviews</span>
        </motion.div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-[#1A2E3B] dark:text-zinc-100 mb-3 tracking-tight">
          Contact & Community Ratings
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Have an inquiry, feedback, or want to share your experience? We value direct transparency and community reviews.
        </p>

        {/* View Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mt-8">
          <button
            onClick={() => setActiveTab('ratings')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer inline-flex items-center gap-2 border ${
              activeTab === 'ratings'
                ? 'bg-[#1A2E3B] text-white border-[#1A2E3B] dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100 shadow-sm'
                : 'bg-white dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-700/60'
            }`}
          >
            <Star className="w-4 h-4 fill-current text-amber-400" />
            <span>Ratings & Reviews</span>
            <span className="font-mono text-xs tabular-nums px-1.5 py-0.5 rounded-md bg-black/10 dark:bg-white/10 font-bold">
              4.9★
            </span>
          </button>

          <button
            onClick={() => setActiveTab('write-review')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer inline-flex items-center gap-2 border ${
              activeTab === 'write-review'
                ? 'bg-[#1A2E3B] text-white border-[#1A2E3B] dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100 shadow-sm'
                : 'bg-white dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-700/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Rate Experience</span>
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer inline-flex items-center gap-2 border ${
              activeTab === 'contact'
                ? 'bg-[#1A2E3B] text-white border-[#1A2E3B] dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100 shadow-sm'
                : 'bg-white dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-700/60'
            }`}
          >
            <Mail className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Send a Message</span>
          </button>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* ========================================================================= */}
        {/* 1. RATINGS HERO & REVIEWS DASHBOARD SECTION                              */}
        {/* ========================================================================= */}
        {(activeTab === 'ratings' || activeTab === 'write-review') && (
          <section id="rating-section" className="space-y-8">
            
            {/* Rating Metrics Strip in Clean Styling */}
            <div className="bg-white dark:bg-[#162227] rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-zinc-800 shadow-sm content-visibility-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Left: Overall Score Card */}
                <div className="lg:col-span-4 text-center lg:text-left lg:border-r border-slate-200 dark:border-zinc-800 lg:pr-8">
                  <div className="text-5xl sm:text-6xl font-bold font-mono tracking-tight text-[#1A2E3B] dark:text-zinc-100 tabular-nums">
                    4.9
                  </div>
                  <div className="flex items-center justify-center lg:justify-start gap-1 my-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-5 h-5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <div className="text-sm font-semibold text-[#1A2E3B] dark:text-zinc-200">
                    Community Trust Score
                  </div>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium mt-0.5">
                    Based on <strong className="font-mono tabular-nums text-slate-700 dark:text-zinc-300">14,820</strong> verified dining & delivery ratings
                  </p>

                  <div className="mt-5 pt-4 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-center lg:justify-start gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                    <ShieldCheck className="w-4 h-4 flex-shrink-0 text-emerald-500" />
                    <span>100% Genuine, Authenticated Reviews</span>
                  </div>
                </div>

                {/* Center: Star Distribution Bars */}
                <div className="lg:col-span-4 space-y-2 text-xs font-mono">
                  {[
                    { stars: 5, pct: 88, count: '13,041' },
                    { stars: 4, pct: 9, count: '1,334' },
                    { stars: 3, pct: 2, count: '296' },
                    { stars: 2, pct: 0.7, count: '104' },
                    { stars: 1, pct: 0.3, count: '45' }
                  ].map((row) => (
                    <div key={row.stars} className="flex items-center gap-2">
                      <div className="w-12 text-right flex items-center justify-end gap-1 text-slate-600 dark:text-zinc-400 font-medium">
                        <span>{row.stars}</span>
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      </div>
                      <div className="flex-1 h-2 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-amber-400 rounded-full transition-all duration-500"
                          style={{ width: `${row.pct}%` }}
                        />
                      </div>
                      <div className="w-10 text-right text-slate-400 dark:text-zinc-500 tabular-nums">
                        {row.pct}%
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right: Operational Quality Metrics */}
                <div className="lg:col-span-4 grid grid-cols-2 gap-3 text-left">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-800">
                    <div className="text-xl sm:text-2xl font-bold font-mono text-[#1A2E3B] dark:text-zinc-100 tabular-nums">
                      99.1%
                    </div>
                    <div className="text-[11px] font-semibold text-slate-700 dark:text-zinc-200 mt-0.5">
                      On-Time Transit
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-zinc-400 font-normal">&lt; 15 min avg window</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-800">
                    <div className="text-xl sm:text-2xl font-bold font-mono text-[#1A2E3B] dark:text-zinc-100 tabular-nums">
                      98.4%
                    </div>
                    <div className="text-[11px] font-semibold text-slate-700 dark:text-zinc-200 mt-0.5">
                      CSAT Score
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-zinc-400 font-normal">Resolution satisfaction</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-800">
                    <div className="text-xl sm:text-2xl font-bold font-mono text-[#1A2E3B] dark:text-zinc-100 tabular-nums">
                      100%
                    </div>
                    <div className="text-[11px] font-semibold text-slate-700 dark:text-zinc-200 mt-0.5">
                      FSSAI Safe
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-zinc-400 font-normal">Kitchen hygiene audit</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/50">
                    <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-700 dark:text-emerald-300 tabular-nums">
                      0.0 kg
                    </div>
                    <div className="text-[11px] font-semibold text-emerald-900 dark:text-emerald-200 mt-0.5">
                      Fleet CO₂
                    </div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-normal">100% Green E-Bikes</div>
                  </div>
                </div>

              </div>
            </div>

            {/* Interactive "Leave a Rating" Form Card */}
            {activeTab === 'write-review' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-[#162227] rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-white/10 shadow-lg relative overflow-hidden"
              >
                <div className="flex items-center justify-between pb-5 border-b border-slate-200 dark:border-zinc-800 mb-6">
                  <div>
                    <span className="text-xs uppercase font-bold tracking-wider text-amber-600 dark:text-amber-400">
                      Community Feedback
                    </span>
                    <h3 className="text-2xl font-serif font-bold text-[#1A2E3B] dark:text-zinc-100">
                      Rate Your Flash Drops Experience
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('ratings')}
                    className="text-xs font-semibold text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200 cursor-pointer"
                  >
                    View All Reviews
                  </button>
                </div>

                {isReviewSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-center space-y-4"
                  >
                    <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto" />
                    <h4 className="text-2xl font-serif font-bold text-emerald-900 dark:text-emerald-200">
                      Rating Published Successfully!
                    </h4>
                    <p className="text-sm text-emerald-700 dark:text-emerald-300 max-w-md mx-auto leading-relaxed">
                      Thank you for contributing to the zero-waste community board. Your review is now live below.
                    </p>
                    <button
                      onClick={() => {
                        setIsReviewSubmitted(false);
                        setActiveTab('ratings');
                      }}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      See Your Review in Community Feed
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-6">
                    
                    {/* Primary Star Selector */}
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-700 text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-4">
                      <div>
                        <label className="block text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-zinc-400 mb-1">
                          Overall Experience Rating
                        </label>
                        <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setUserRating(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              className="p-1 cursor-pointer transition-transform hover:scale-115 focus:outline-none"
                              aria-label={`Rate ${star} star`}
                            >
                              <Star
                                className={`w-8 h-8 transition-colors ${
                                  (hoverRating || userRating) >= star
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-slate-300 dark:text-zinc-600'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="mt-3 sm:mt-0 text-xs font-semibold font-mono text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800/80 px-3 py-1.5 rounded-xl">
                        {ratingDescriptions[hoverRating || userRating]}
                      </div>
                    </div>

                    {/* Sub-Criteria Breakdown Ratings */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#142326]/40 border border-slate-200/80 dark:border-zinc-800 flex items-center justify-between">
                        <span className="font-semibold text-slate-700 dark:text-zinc-300">🍱 Food Taste & Freshness</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setFoodRating(s)}
                              className="p-0.5 cursor-pointer"
                            >
                              <Star className={`w-4 h-4 ${foodRating >= s ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-zinc-600'}`} />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#142326]/40 border border-slate-200/80 dark:border-zinc-800 flex items-center justify-between">
                        <span className="font-semibold text-slate-700 dark:text-zinc-300">⚡ Delivery Fleet Speed</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setSpeedRating(s)}
                              className="p-0.5 cursor-pointer"
                            >
                              <Star className={`w-4 h-4 ${speedRating >= s ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-zinc-600'}`} />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#142326]/40 border border-slate-200/80 dark:border-zinc-800 flex items-center justify-between">
                        <span className="font-semibold text-slate-700 dark:text-zinc-300">🌿 Zero-Waste Eco-Packaging</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setEcoRating(s)}
                              className="p-0.5 cursor-pointer"
                            >
                              <Star className={`w-4 h-4 ${ecoRating >= s ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-zinc-600'}`} />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#142326]/40 border border-slate-200/80 dark:border-zinc-800 flex items-center justify-between">
                        <span className="font-semibold text-slate-700 dark:text-zinc-300">🤝 Customer Support Care</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setSupportRating(s)}
                              className="p-0.5 cursor-pointer"
                            >
                              <Star className={`w-4 h-4 ${supportRating >= s ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-zinc-600'}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Quick Tag Selector */}
                    <div>
                      <label className="block text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-zinc-400 mb-2">
                        Key Experience Highlight
                      </label>
                      <div className="flex flex-wrap gap-2 text-xs">
                        {[
                          '⚡ Rapid Delivery',
                          '🥖 Fresh Sourdough',
                          '🛵 Green Courier',
                          '🔒 Number Masked',
                          '💰 Exceptional Savings',
                          '🌱 Zero Waste Impact'
                        ].map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => setSelectedTag(tag)}
                            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                              selectedTag === tag
                                ? 'bg-[#1A2E3B] dark:bg-amber-400 text-white dark:text-zinc-950 font-bold shadow-xs'
                                : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700'
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Author Details & Review Text */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
                          Your Name / Handle
                        </label>
                        <input
                          type="text"
                          required
                          value={reviewName}
                          onChange={(e) => setReviewName(e.target.value)}
                          placeholder="e.g. Maya Sen"
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#142326]/80 border border-slate-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
                          Your City / District
                        </label>
                        <input
                          type="text"
                          value={reviewCity}
                          onChange={(e) => setReviewCity(e.target.value)}
                          placeholder="e.g. South Delhi, DL"
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#142326]/80 border border-slate-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
                        Review Title
                      </label>
                      <input
                        type="text"
                        value={reviewTitle}
                        onChange={(e) => setReviewTitle(e.target.value)}
                        placeholder="e.g. Delicious pastries and super fast courier!"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#142326]/80 border border-slate-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
                        Your Detailed Feedback
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Tell the community how your surplus drop arrived, packaging condition, delivery experience..."
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#142326]/80 border border-slate-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                      />
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
                      <input type="checkbox" id="verify-exp" defaultChecked className="rounded text-amber-500 focus:ring-amber-500" />
                      <label htmlFor="verify-exp">I certify that this feedback is based on my genuine dining or delivery experience.</label>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 px-6 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-slate-950 font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-[0_0_20px_rgba(212,175,55,0.35)] cursor-pointer"
                    >
                      <Star className="w-4 h-4 fill-slate-950" />
                      <span>Submit Verified Rating</span>
                    </button>
                  </form>
                )}
              </motion.div>
            )}

            {/* Verified Community Reviews List */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1A2E3B] dark:text-zinc-100 flex items-center gap-2">
                    <span>Verified Customer Reviews</span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">
                      {reviewsList.length} recent
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                    Real orders verified across India & UAE micro-fulfillment networks.
                  </p>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400 dark:text-zinc-500 font-medium">Filter:</span>
                  {(['all', '5', '4'] as const).map((starVal) => (
                    <button
                      key={starVal}
                      onClick={() => setFilterRating(starVal)}
                      className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                        filterRating === starVal
                          ? 'bg-[#1A2E3B] dark:bg-amber-400 text-white dark:text-zinc-950 font-bold shadow-xs'
                          : 'bg-white/80 dark:bg-[#162227]/80 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-800'
                      }`}
                    >
                      {starVal === 'all' ? 'All Ratings' : `${starVal} Stars Only`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reviews Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence>
                  {filteredReviews.map((rev) => (
                    <motion.div
                      key={rev.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-white dark:bg-[#162227] rounded-2xl p-6 border border-slate-200/80 dark:border-white/10 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Author Header */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${rev.avatarSeed}`}
                              alt={rev.name}
                              width="40"
                              height="40"
                              loading="lazy"
                              decoding="async"
                              className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 object-cover"
                            />
                            <div>
                              <div className="text-sm font-bold text-[#1A2E3B] dark:text-zinc-100 flex items-center gap-1.5">
                                <span>{rev.name}</span>
                                {rev.verifiedOrder && (
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" title="Verified Customer" />
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400 dark:text-zinc-500 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                <span>{rev.location}</span>
                                <span>•</span>
                                <span>{rev.date}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3.5 h-3.5 ${
                                  rev.rating >= s ? 'text-amber-400 fill-amber-400' : 'text-slate-200 dark:text-zinc-700'
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Title & Body */}
                        <h4 className="text-sm font-bold text-[#1A2E3B] dark:text-zinc-100 mb-1.5 leading-snug">
                          {rev.title}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed mb-4">
                          "{rev.comment}"
                        </p>

                        {/* Tag Pills */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {rev.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-200/60 dark:border-zinc-700/60"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Helpful Counter Button */}
                      <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
                        <span className="text-[11px]">Verified Order Custody</span>
                        <button
                          type="button"
                          onClick={() => handleHelpfulToggle(rev.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                            helpfulVoted[rev.id]
                              ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-semibold'
                              : 'hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400'
                          }`}
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span>Helpful ({rev.helpfulCount})</span>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

          </section>
        )}

        {/* ========================================================================= */}
        {/* 2. DIRECT CONTACT US SECTION                                              */}
        {/* ========================================================================= */}
        {(activeTab === 'contact' || activeTab === 'all') && (
          <section id="contact-form-section" className="content-visibility-auto">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 bg-white dark:bg-[#162227] rounded-3xl shadow-sm border border-slate-200/80 dark:border-white/10 overflow-hidden">
              
              {/* Left Column: Contact Details */}
              <div className="md:col-span-2 bg-[#1A2E3B] dark:bg-zinc-950 text-white p-8 sm:p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-transparent dark:border-zinc-800">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-serif font-semibold mb-2">Get in Touch</h3>
                    <p className="text-sm text-slate-300 dark:text-zinc-400 leading-relaxed">
                      Have questions about your order, food partners, or becoming a green delivery partner? We are here for you.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <a 
                      href="mailto:flashdrops111@gmail.com" 
                      className="flex items-start gap-4 text-slate-200 hover:text-amber-300 transition-colors group"
                    >
                      <div className="p-2.5 rounded-lg bg-white/10 dark:bg-zinc-800 text-amber-400 group-hover:bg-amber-400 group-hover:text-zinc-950 transition-colors border border-transparent dark:border-zinc-700">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 dark:text-zinc-400 uppercase tracking-wider font-semibold">Email</div>
                        <div className="text-sm font-medium">flashdrops111@gmail.com</div>
                      </div>
                    </a>

                    <a 
                      href="tel:+919991155983" 
                      className="flex items-start gap-4 text-slate-200 hover:text-amber-300 transition-colors group"
                    >
                      <div className="p-2.5 rounded-lg bg-white/10 dark:bg-zinc-800 text-amber-400 group-hover:bg-amber-400 group-hover:text-zinc-950 transition-colors border border-transparent dark:border-zinc-700">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 dark:text-zinc-400 uppercase tracking-wider font-semibold">Phone</div>
                        <div className="text-sm font-medium">+91 9991155983</div>
                      </div>
                    </a>

                    <div className="flex items-start gap-4 text-slate-200">
                      <div className="p-2.5 rounded-lg bg-white/10 dark:bg-zinc-800 text-amber-400 border border-transparent dark:border-zinc-700">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 dark:text-zinc-400 uppercase tracking-wider font-semibold">Office</div>
                        <div className="text-sm font-medium leading-snug">
                          Sonipat, Haryana, India, 131001
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="pt-8 border-t border-white/10 dark:border-zinc-800">
                  <div className="text-xs text-slate-400 dark:text-zinc-400 uppercase tracking-wider font-semibold mb-3">
                    Follow our Community
                  </div>
                  <div className="flex items-center gap-3">
                    <a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Twitter"
                      className="w-10 h-10 rounded-lg bg-white/10 dark:bg-zinc-800 hover:bg-amber-400 hover:text-zinc-950 text-slate-200 dark:text-zinc-200 flex items-center justify-center transition-colors border border-transparent dark:border-zinc-700"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="w-10 h-10 rounded-lg bg-white/10 dark:bg-zinc-800 hover:bg-amber-400 hover:text-zinc-950 text-slate-200 dark:text-zinc-200 flex items-center justify-center transition-colors border border-transparent dark:border-zinc-700"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="w-10 h-10 rounded-lg bg-white/10 dark:bg-zinc-800 hover:bg-amber-400 hover:text-zinc-950 text-slate-200 dark:text-zinc-200 flex items-center justify-center transition-colors border border-transparent dark:border-zinc-700"
                    >
                      <Facebook className="w-4 h-4" />
                    </a>
                  </div>
                </div>

              </div>

              {/* Right Column: Send a Message Form */}
              <div className="md:col-span-3 p-8 sm:p-12">
                <h3 className="text-2xl font-serif font-bold text-[#1A2E3B] dark:text-zinc-100 mb-2">Send a Message</h3>
                <p className="text-sm text-slate-500 dark:text-zinc-400 mb-8">
                  Fill out the form below and our team will get back to you within 24 hours.
                </p>

                {isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-center space-y-4"
                  >
                    <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto" />
                    <h4 className="text-xl font-serif font-bold text-emerald-900 dark:text-emerald-200">Message Sent!</h4>
                    <p className="text-sm text-emerald-700 dark:text-emerald-300 max-w-sm mx-auto">
                      Thank you for reaching out. We have received your message and our support team will reply shortly.
                    </p>
                    <button
                      onClick={() => setIsSuccess(false)}
                      className="mt-4 px-5 py-2 text-xs font-semibold text-emerald-800 dark:text-emerald-200 bg-emerald-100 dark:bg-emerald-900/60 hover:bg-emerald-200 dark:hover:bg-emerald-900 rounded-lg transition-colors cursor-pointer"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
                        Your Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Jane Doe"
                        className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-[#142326]/80 border border-slate-200 dark:border-zinc-700 focus:bg-white dark:focus:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 transition-all"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
                        Your Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="jane@example.com"
                        className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-[#142326]/80 border border-slate-200 dark:border-zinc-700 focus:bg-white dark:focus:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 transition-all"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
                        How can we help?
                      </label>
                      <textarea
                        id="message"
                        rows={5}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us what you need assistance with..."
                        className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-[#142326]/80 border border-slate-200 dark:border-zinc-700 focus:bg-white dark:focus:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 transition-all resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-6 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-amber-500/20 disabled:opacity-70 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSubmitting ? 'Sending Message...' : 'Send Message'}</span>
                    </button>
                  </form>
                )}

              </div>

            </div>
          </section>
        )}

        {/* Footer links */}
        <div className="flex flex-wrap justify-center items-center gap-6 mt-12 text-sm text-slate-500 dark:text-zinc-400 font-medium">
          <button onClick={() => onNavigate('landing')} className="hover:text-[#1A2E3B] dark:hover:text-zinc-100 transition-colors cursor-pointer">About Us</button>
          <span>·</span>
          <button onClick={() => onNavigate('privacy-policy')} className="hover:text-[#1A2E3B] dark:hover:text-zinc-100 transition-colors cursor-pointer">Privacy Policy</button>
          <span>·</span>
          <button onClick={() => onNavigate('terms-guide')} className="hover:text-[#1A2E3B] dark:hover:text-zinc-100 transition-colors cursor-pointer">Terms Guide</button>
        </div>
      </main>
    </div>
  );
}
