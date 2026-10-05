import { useEffect, useState, type FormEvent } from 'react';
import { 
  Smartphone, 
  ShieldCheck, 
  RefreshCw, 
  Sparkles, 
  CheckCircle2, 
  Star, 
  UtensilsCrossed, 
  Bike, 
  Loader2,
  Calendar,
  Users,
  MapPin,
  ArrowRight,
  Clock,
  Bell,
  BellRing,
  Check,
  Flame,
  Leaf
} from 'lucide-react';
import { motion } from 'motion/react';
import { fetchCommunityData, type CommunityEvent } from '../services/communityApi';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { APP_GIT_TAG } from '../config';

interface Restaurant {
  id: string;
  name: string;
  food_type: string;
  rating: number;
  surplus_active: boolean;
}

interface DeliveryPartner {
  id: string;
  name: string;
  vehicle: string;
  fleet_type?: 'green' | 'delivery';
  total_deliveries: number;
  status: string;
}

interface LandingPageProps {
  onNavigate?: (page: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [restaurantFilter, setRestaurantFilter] = useState<'all' | 'bakery' | 'bistro' | 'pizza'>('all');
  const [restaurantAlerts, setRestaurantAlerts] = useState<Record<string, boolean>>({});

  const toggleRestaurantAlert = (restaurantId: string, _restaurantName: string) => {
    setRestaurantAlerts(prev => ({
      ...prev,
      [restaurantId]: !prev[restaurantId]
    }));
  };

  // Data-driven mock state with simulated network fetch for API readiness
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [deliveryFleet, setDeliveryFleet] = useState<DeliveryPartner[]>([]);
  const [communityEvents, setCommunityEvents] = useState<CommunityEvent[]>([]);
  const [isCommunityComingSoon, setIsCommunityComingSoon] = useState(true);
  const [notifiedEvents, setNotifiedEvents] = useState<Record<string, boolean>>({});
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setRestaurants([
        {
          id: 'rest-1',
          name: 'Artisan Sourdough Bakery',
          food_type: 'Bakery & Pastries',
          rating: 4.9,
          surplus_active: true,
        },
        {
          id: 'rest-2',
          name: 'Green Garden Bistro',
          food_type: 'Mediterranean & Bowls',
          rating: 4.8,
          surplus_active: true,
        },
        {
          id: 'rest-3',
          name: 'Coastal Woodfire Pizza',
          food_type: 'Italian & Wood-Fired',
          rating: 4.7,
          surplus_active: false,
        },
      ]);

      setDeliveryFleet([
        {
          id: 'fleet-1',
          name: 'Marcus Sterling',
          vehicle: 'E-Bike (Zero Emission)',
          fleet_type: 'green',
          total_deliveries: 1420,
          status: 'Active on Route',
        },
        {
          id: 'fleet-2',
          name: 'Priya Sharma',
          vehicle: 'Electric Scooter (Zero Emission)',
          fleet_type: 'green',
          total_deliveries: 980,
          status: 'Ready for Pickup',
        },
        {
          id: 'fleet-3',
          name: 'Elena Rostova',
          vehicle: 'Cold-Chain Express Van',
          fleet_type: 'delivery',
          total_deliveries: 2240,
          status: 'Active on Route',
        },
        {
          id: 'fleet-4',
          name: 'Kai Tanaka',
          vehicle: 'Rapid Urban Courier Pod',
          fleet_type: 'delivery',
          total_deliveries: 1680,
          status: 'Ready for Pickup',
        },
      ]);

      // Fetch community data via central service (loads coming soon data or live API when provided)
      try {
        const communityRes = await fetchCommunityData();
        setCommunityEvents(communityRes.events);
        setIsCommunityComingSoon(communityRes.isComingSoon);
      } catch (e) {
        console.error('Error loading community data:', e);
      }

      setIsLoadingData(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleToggleNotifyEvent = (eventId: string) => {
    setNotifiedEvents(prev => ({
      ...prev,
      [eventId]: !prev[eventId]
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubmitted(true);
      localStorage.setItem('flash-drops-banner-dismissed', 'true');
      window.dispatchEvent(new CustomEvent('flash-drops-banner-sync', { detail: { visible: false } }));

      try {
        await addDoc(collection(db, 'newsletter_leads'), {
          email: email.trim(),
          source: 'landing_waitlist',
          createdAt: new Date().toISOString()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, 'newsletter_leads');
      }
    }
  };

  return (
    <div className="w-full flex flex-col items-center overflow-x-hidden">
      
      {/* 1. Hero Section: Mobile stacked / Tablet & Desktop 2-column grid (md:grid-cols-2) */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pt-6 sm:pt-10 md:pt-16 pb-12 sm:pb-16 md:pb-20 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-16 items-center">
          
          {/* Left Column on Tablet & Desktop: Headline, feature pills, copy & CTAs */}
          <div className="text-center md:text-left flex flex-col items-center md:items-start">
            
            {/* Play Store Announcement Pill with Motion */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#162227] border border-slate-200/80 dark:border-zinc-800 text-[#1A2E3B] dark:text-zinc-300 text-xs sm:text-sm font-semibold mb-4 sm:mb-6 shadow-sm hover:shadow-md transition-all cursor-default max-w-full"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center flex-shrink-0"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none">
                  <path d="M3.609 1.814L13.793 12 3.61 22.186A2.22 2.22 0 0 1 3 20.615V3.385c0-.604.224-1.168.609-1.571z" fill="#00D3FF"/>
                  <path d="M17.202 8.591L13.793 12 3.609 1.814a2.27 2.27 0 0 1 1.258-.364c.553 0 1.096.173 1.58.497l10.755 6.644z" fill="#00F076"/>
                  <path d="M17.202 15.409l-10.755 6.644a2.766 2.766 0 0 1-1.58.497c-.456 0-.895-.128-1.258-.364L13.793 12l3.409 3.409z" fill="#FF3A44"/>
                  <path d="M21.578 11.233l-4.376-2.642L13.793 12l3.409 3.409 4.376-2.642c.866-.534.866-1.999 0-2.534z" fill="#FFC800"/>
                </svg>
              </motion.div>
              <span className="text-slate-700 dark:text-zinc-300">Official Android App</span>
              <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-slate-300 dark:bg-zinc-700"></span>
              <span className="text-amber-700 dark:text-amber-400 font-bold">Coming Soon on Google Play</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#1A2E3B] dark:text-zinc-100 font-serif tracking-tight mb-2 sm:mb-3 leading-[1.1]"
            >
              Flash Drops
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-slate-500 dark:text-zinc-400 mb-5 sm:mb-6 font-light"
            >
              The Surplus Food Community
            </motion.p>

            <motion.h2 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#1A2E3B] dark:text-zinc-100 mb-4 sm:mb-5"
            >
              Catch the Drop!
            </motion.h2>
            
            {/* Feature Pills: Symmetrical 2x2 grid on mobile (grid-cols-2) to prevent orphan words like REPEAT, flexible on md: */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center md:justify-start gap-2.5 sm:gap-3 text-xs sm:text-xs md:text-sm tracking-wider font-semibold text-[#1A2E3B] dark:text-zinc-300 mb-6 sm:mb-8 uppercase w-full max-w-sm sm:max-w-none"
            >
              <span className="px-3.5 py-2 sm:py-1 rounded-full bg-white dark:bg-[#162227] border border-slate-200/70 dark:border-white/10 shadow-2xs text-slate-700 dark:text-zinc-200 text-center whitespace-nowrap">
                Save Food
              </span>
              <span className="px-3.5 py-2 sm:py-1 rounded-full bg-white dark:bg-[#162227] border border-slate-200/70 dark:border-white/10 shadow-2xs text-slate-700 dark:text-zinc-200 text-center whitespace-nowrap">
                Discover Deals
              </span>
              <span className="px-3.5 py-2 sm:py-1 rounded-full bg-white dark:bg-[#162227] border border-slate-200/70 dark:border-white/10 shadow-2xs text-slate-700 dark:text-zinc-200 text-center whitespace-nowrap">
                Connect
              </span>
              <span className="px-3.5 py-2 sm:py-1 rounded-full bg-white dark:bg-[#162227] border border-slate-200/70 dark:border-white/10 shadow-2xs text-slate-700 dark:text-zinc-200 text-center whitespace-nowrap">
                Repeat
              </span>
            </motion.div>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-sm sm:text-base md:text-base lg:text-lg text-slate-600 dark:text-zinc-400 mb-8 sm:mb-10 leading-relaxed max-w-xl text-center md:text-left"
            >
              Come and discover your city's newest, laid-back community for epic daily food deals and sustainable eating.
            </motion.p>

            {/* Quick Action Buttons with Minimum 44px touch targets and popping Flash Drops accent */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 w-full max-w-lg mb-6 md:mb-0"
            >
              <button
                onClick={() => onNavigate?.('livedrops')}
                className="w-full sm:w-auto min-h-[44px] px-6 py-3.5 rounded-xl bg-[#1A2E3B] dark:bg-amber-400 hover:bg-[#253f50] dark:hover:bg-amber-300 text-white dark:text-[#10181A] font-bold text-sm shadow-md hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
              >
                <Flame className="w-4 h-4 text-amber-400 dark:text-[#10181A]" />
                <span>Explore Live Drops</span>
              </button>
              <a
                href="#waitlist"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto min-h-[44px] px-6 py-3.5 rounded-xl bg-[#FF5A1F] hover:bg-[#FF733F] text-white font-bold text-sm shadow-md hover:shadow-orange-500/25 dark:shadow-[0_0_20px_rgba(255,90,31,0.35)] hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
              >
                <span>Get Early Access</span>
              </a>
              <button
                onClick={() => onNavigate?.('help-support')}
                className="w-full sm:w-auto min-h-[44px] px-5 py-3.5 rounded-xl bg-white dark:bg-[#162227] hover:bg-slate-50 dark:hover:bg-white/10 text-slate-700 dark:text-zinc-200 border border-slate-200 dark:border-white/15 font-semibold text-sm shadow-2xs hover:shadow-md hover:scale-105 transition-all duration-200 flex items-center justify-center active:scale-98 cursor-pointer"
              >
                <span>FAQs</span>
              </button>
            </motion.div>
          </div>

          {/* Right Column on Tablet & Desktop: Supporting App Imagery in 2x2 Bento Grid */}
          <div className="w-full">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
              {[
                { src: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80", alt: "Culinary prep & fresh chopping", caption: "Fresh Kitchens" },
                { src: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80", alt: "Artisan Woodfired Pizza", caption: "Daily Drops" },
                { src: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80", alt: "Fresh baked pastries and pancakes", caption: "Sweet Treats" },
                { src: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80", alt: "Community dining food table", caption: "Zero Waste" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  whileHover={{ y: -6, scale: 1.03 }}
                  className="overflow-hidden rounded-xl sm:rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group active:scale-98 relative border border-slate-200/70 dark:border-zinc-800"
                >
                  <img 
                    src={item.src} 
                    alt={item.alt} 
                    width="400"
                    height="300"
                    decoding="async"
                    className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 sm:p-4">
                    <span className="text-white text-xs sm:text-sm font-semibold tracking-wide">
                      {item.caption}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </section>

      <hr className="w-full border-t border-slate-200 dark:border-zinc-800" />

      {/* 2. Features Zig-Zag with Scroll Reveals */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 md:py-24 space-y-16 sm:space-y-24 md:space-y-32">
        
        {/* Feature 1 */}
        <motion.div 
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row items-center gap-6 sm:gap-10 lg:gap-20"
        >
          <motion.div 
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="w-full md:w-1/2 aspect-[16/10] sm:aspect-[4/3] overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-white/10"
          >
            <img 
              src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1000&q=80" 
              alt="Flash Bundles" 
              width="600"
              height="450"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
            />
          </motion.div>
          <div className="w-full md:w-1/2 space-y-2.5 sm:space-y-4">
            <h3 className="text-2xl sm:text-3xl font-serif text-[#1A2E3B] dark:text-zinc-100">Flash Bundles & Daily Deals</h3>
            <p className="text-slate-600 dark:text-zinc-400 leading-relaxed text-sm sm:text-base md:text-lg">
              Partnering with the best local restaurants, cafés, and bakeries. Grab premium surplus food drops at a massive discount before they sell out. Keep an eye on our socials for the latest partner reveals.
            </p>
          </div>
        </motion.div>

        {/* Feature 2 */}
        <motion.div 
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row-reverse items-center gap-6 sm:gap-10 lg:gap-20"
        >
          <motion.div 
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="w-full md:w-1/2 aspect-[16/10] sm:aspect-[4/3] overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-white/10"
          >
            <img 
              src="https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=1000&q=80" 
              alt="Zozo AI" 
              width="600"
              height="450"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
            />
          </motion.div>
          <div className="w-full md:w-1/2 space-y-2.5 sm:space-y-4">
            <h3 className="text-2xl sm:text-3xl font-serif text-[#1A2E3B] dark:text-zinc-100">Zozo AI Concierge</h3>
            <p className="text-slate-600 dark:text-zinc-400 leading-relaxed text-sm sm:text-base md:text-lg">
              Meet Zozo, your personal Gen-Z coded food concierge. From demystifying local dishes to tracking down the exact spice levels and allergens, Zozo makes discovering your next meal effortless.
            </p>
          </div>
        </motion.div>

        {/* Feature 3 */}
        <motion.div 
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row items-center gap-6 sm:gap-10 lg:gap-20"
        >
          <motion.div 
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="w-full md:w-1/2 aspect-[16/10] sm:aspect-[4/3] overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-white/10"
          >
            <img 
              src="https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=1000&q=80" 
              alt="Community" 
              width="600"
              height="450"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
            />
          </motion.div>
          <div className="w-full md:w-1/2 space-y-2.5 sm:space-y-4">
            <h3 className="text-2xl sm:text-3xl font-serif text-[#1A2E3B] dark:text-zinc-100">Community & Events</h3>
            <p className="text-slate-600 dark:text-zinc-400 leading-relaxed text-sm sm:text-base md:text-lg">
              Flash Drops isn't just an app; it's a social hub. Join local Drop Pools, RSVP to exclusive food tasting events, and connect with other eco-conscious foodies in your neighborhood.
            </p>
          </div>
        </motion.div>

        {/* Feature 4 */}
        <motion.div 
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row-reverse items-center gap-6 sm:gap-10 lg:gap-20"
        >
          <motion.div 
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="w-full md:w-1/2 aspect-[16/10] sm:aspect-[4/3] overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-white/10"
          >
            <img 
              src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1000&q=80" 
              alt="Impact Tracking" 
              width="600"
              height="450"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
            />
          </motion.div>
          <div className="w-full md:w-1/2 space-y-2.5 sm:space-y-4">
            <h3 className="text-2xl sm:text-3xl font-serif text-[#1A2E3B] dark:text-zinc-100">Real-Time Impact Tracking</h3>
            <p className="text-slate-600 dark:text-zinc-400 leading-relaxed text-sm sm:text-base md:text-lg">
              Eat good, do good. Every Flash Bundle you rescue directly prevents food waste. Track your personal CO2 prevention and total money saved right from your profile.
            </p>
          </div>
        </motion.div>

      </section>



      <hr className="w-full border-t border-slate-200 dark:border-zinc-800" />

      {/* Partner Restaurants & Delivery Fleet Data-Driven Sections */}
      <section id="partner-restaurants-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 md:py-24 content-visibility-auto">
        {isLoadingData ? (
          <div id="fleet-loading-container" className="flex flex-col items-center justify-center py-16 text-[#1A2E3B] dark:text-zinc-100 space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500 dark:text-amber-400" />
            <p className="text-sm font-medium text-slate-500 dark:text-zinc-400 tracking-wide">
              Loading partner restaurants and delivery fleet...
            </p>
          </div>
        ) : (
          <div className="space-y-16 sm:space-y-24">
            {/* Section A: Partner Restaurants */}
            <div id="partner-restaurants-container" className="pt-4">
              <div className="text-center mb-8 sm:mb-14">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="text-[11px] sm:text-xs font-bold tracking-widest uppercase text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800/80 px-3 py-1 rounded-full inline-block mb-3">
                    Verified Kitchens
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-serif text-[#1A2E3B] dark:text-zinc-100 mb-2 sm:mb-3">
                    Partner Restaurants
                  </h2>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 max-w-xl mx-auto mb-6">
                    Local restaurants, cafés, and bakeries turning daily surplus into delicious Flash Drop deals.
                  </p>

                  {/* Interactive Category Filter Pills (Touch friendly >= 44px) */}
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    {[
                      { id: 'all', label: 'All Kitchens' },
                      { id: 'bakery', label: 'Bakery & Pastries' },
                      { id: 'bistro', label: 'Mediterranean Bowls' },
                      { id: 'pizza', label: 'Wood-Fired Pizza' },
                    ].map(f => (
                      <button
                        key={f.id}
                        onClick={() => setRestaurantFilter(f.id as any)}
                        className={`min-h-[44px] px-4 py-2 rounded-full text-xs font-semibold transition-all active:scale-95 cursor-pointer inline-flex items-center justify-center ${
                          restaurantFilter === f.id
                            ? 'bg-[#1A2E3B] dark:bg-amber-400 text-white dark:text-[#10181A] dark:font-bold shadow-xs'
                            : 'bg-white dark:bg-[#162227] text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {restaurants
                  .filter(r => {
                    if (restaurantFilter === 'all') return true;
                    if (restaurantFilter === 'bakery') return r.food_type.toLowerCase().includes('bakery') || r.food_type.toLowerCase().includes('pastr');
                    if (restaurantFilter === 'bistro') return r.food_type.toLowerCase().includes('mediterranean') || r.food_type.toLowerCase().includes('bowl');
                    if (restaurantFilter === 'pizza') return r.food_type.toLowerCase().includes('pizza') || r.food_type.toLowerCase().includes('wood');
                    return true;
                  })
                  .map((restaurant, idx) => (
                  <div key={restaurant.id} className="relative group">
                    <motion.div
                      id={`restaurant-card-${restaurant.id}`}
                      initial={{ opacity: 0, y: 25 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      whileHover={{ y: -4 }}
                      className="bg-white dark:bg-[#162227] rounded-2xl border border-slate-200/80 dark:border-white/10 p-6 sm:p-7 flex flex-col justify-between group hover:border-slate-300 dark:hover:border-amber-400/40 h-full"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-white/10 group-hover:bg-[#1A2E3B] dark:group-hover:bg-amber-500 group-hover:text-white dark:group-hover:text-[#10181A] text-[#1A2E3B] dark:text-zinc-200 flex items-center justify-center transition-colors">
                            <UtensilsCrossed className="w-5 h-5" />
                          </div>
                          <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span className="font-mono tabular-nums">{restaurant.rating.toFixed(1)}</span>
                          </div>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1A2E3B] dark:text-zinc-100 mb-1.5 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors flex items-center gap-1.5">
                          <span>{restaurant.name}</span>
                          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" title="Verified Partner" />
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 font-medium mb-4">
                          {restaurant.food_type}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400 dark:text-zinc-500 font-medium">Surplus Status</span>
                          {restaurant.surplus_active ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/80 px-2.5 py-1 rounded-full">
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                              </span>
                              Drop Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800 px-2.5 py-1 rounded-full">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-zinc-600"></span>
                              Sold Out Today
                            </span>
                          )}
                        </div>

                        {/* Interactive Mobile Drop Notification Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRestaurantAlert(restaurant.id, restaurant.name);
                          }}
                          className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer min-h-[44px] ${
                            restaurantAlerts[restaurant.id]
                              ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                              : 'bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 border border-slate-200 dark:border-zinc-700'
                          }`}
                        >
                          {restaurantAlerts[restaurant.id] ? (
                            <>
                              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                              <span>Drop Alerts Activated</span>
                            </>
                          ) : (
                            <>
                              <BellRing className="w-4 h-4 text-slate-500 dark:text-zinc-400" />
                              <span>Notify Me On Drop</span>
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section B: Our Delivery Fleet */}
            <div id="delivery-fleet-section" className="pt-14 sm:pt-20 border-t border-slate-200 dark:border-zinc-800 content-visibility-auto">
              <div className="text-center mb-10 sm:mb-16">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <span className="text-[11px] sm:text-xs font-bold tracking-widest uppercase text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/80 px-3 py-1 rounded-full inline-flex items-center gap-1.5 shadow-2xs">
                      <Leaf className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      100% Green Fleet
                    </span>
                    <span className="text-[11px] sm:text-xs font-bold tracking-widest uppercase text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800/80 px-3 py-1 rounded-full inline-flex items-center gap-1.5 shadow-2xs">
                      <Bike className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                      Active Delivery Fleet
                    </span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-serif text-[#1A2E3B] dark:text-zinc-100 mb-2 sm:mb-3">
                    Our Delivery & Green Fleet
                  </h2>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 max-w-xl mx-auto">
                    Dedicated drop agents powering sustainable zero-emission rescues and rapid express food transit.
                  </p>
                </motion.div>
              </div>

              {/* Clean Horizontal Profile Layout with responsive columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {deliveryFleet.map((partner, idx) => {
                  const isGreen = partner.fleet_type === 'green';
                  return (
                    <div key={partner.id} className="relative group">
                      <motion.div
                        id={`delivery-profile-${partner.id}`}
                        initial={{ opacity: 0, y: 25 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        whileHover={{ y: -3 }}
                        className="bg-white dark:bg-[#162227] rounded-2xl border border-slate-200/80 dark:border-white/10 p-5 sm:p-6 md:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-5 group hover:border-slate-300 dark:hover:border-amber-400/40 h-full"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-2xl ${
                            isGreen
                              ? 'bg-gradient-to-br from-emerald-800 to-[#103353] dark:from-emerald-950 dark:to-zinc-900 text-emerald-300'
                              : 'bg-gradient-to-br from-[#103353] to-[#1A2E3B] dark:from-amber-950/60 dark:to-zinc-900 text-amber-300'
                          } flex items-center justify-center flex-shrink-0 shadow-xs border border-transparent dark:border-white/10`}>
                            {isGreen ? <Leaf className="w-7 h-7" /> : <Bike className="w-7 h-7" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <h3 className="text-lg sm:text-xl font-serif font-bold text-[#1A2E3B] dark:text-zinc-100">
                                {partner.name}
                              </h3>
                              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isGreen
                                  ? 'text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/80'
                                  : 'text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800/80'
                              }`}>
                                {isGreen ? 'Green Fleet' : 'Delivery Fleet'}
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 font-medium">
                              {partner.vehicle}
                            </p>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-white/10 gap-2">
                          <div className="text-left sm:text-right">
                            <span className="text-[11px] text-slate-400 dark:text-zinc-400 block uppercase font-medium tracking-wider">
                              Deliveries
                            </span>
                            <span className="text-sm sm:text-base font-bold font-mono text-[#1A2E3B] dark:text-zinc-100 tabular-nums">
                              {partner.total_deliveries.toLocaleString()} completed
                            </span>
                          </div>
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/80 px-3 py-1 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            {partner.status}
                          </span>
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section C: Upcoming Community Events - Coming Soon Mode with Dynamic API Mapping */}
            <div id="upcoming-community-events-section" className="pt-10 sm:pt-14 border-t border-slate-200 dark:border-zinc-800">
              <div className="text-center mb-8 sm:mb-12">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-bold tracking-widest uppercase text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200/90 dark:border-amber-800/80 px-3.5 py-1.5 rounded-full mb-3 shadow-2xs">
                    <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-pulse" />
                    <span>Community Initiatives • Coming Soon</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-serif text-[#1A2E3B] dark:text-zinc-100 mb-2 sm:mb-3">
                    Upcoming Community Events
                  </h2>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto">
                    Our neighborhood food drives, zero-waste masterclasses, and surplus feasts are officially in curation. Whenever you connect your API, every gathering detail populates here in real time.
                  </p>
                </motion.div>
              </div>

              {/* Responsive Tailwind Grid matching coastal-blue aesthetic */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {communityEvents.map((event, idx) => {
                  const isNotified = notifiedEvents[event.id];
                  const isComingSoon = isCommunityComingSoon || event.is_coming_soon || event.status === 'coming_soon';

                  return (
                    <motion.div
                      key={event.id}
                      id={`community-event-${event.id}`}
                      initial={{ opacity: 0, y: 25 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      whileHover={{ y: -4 }}
                      className="bg-white dark:bg-[#162227] rounded-2xl border border-slate-200/90 dark:border-zinc-800 shadow-xs hover:shadow-md transition-all duration-300 p-6 flex flex-col justify-between group relative overflow-hidden"
                    >
                      {/* Top banner accent for Coming Soon */}
                      {isComingSoon && (
                        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400" />
                      )}

                      <div>
                        <div className="flex items-start justify-between gap-2 mb-4">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800/80 px-2.5 py-1 rounded-full">
                            {event.event_type}
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 px-2.5 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                            {event.badge || 'Coming Soon'}
                          </span>
                        </div>

                        <h3 className="text-xl font-serif font-bold text-[#1A2E3B] dark:text-zinc-100 mb-3 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                          {event.event_name}
                        </h3>

                        {event.description && (
                          <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed mb-4 line-clamp-2">
                            {event.description}
                          </p>
                        )}

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-zinc-300 font-medium">
                            <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
                            <MapPin className="w-4 h-4 text-slate-400 dark:text-zinc-500 flex-shrink-0" />
                            <span>{event.location}</span>
                          </div>
                          {event.attendees > 0 && (
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
                              <Users className="w-4 h-4 text-slate-400 dark:text-zinc-500 flex-shrink-0" />
                              <span>{event.attendees} Attending</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between gap-3">
                        <button
                          onClick={() => handleToggleNotifyEvent(event.id)}
                          className={`text-xs font-semibold py-1.5 px-3 rounded-lg inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                            isNotified
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80'
                              : 'bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200/80 dark:hover:bg-zinc-700 text-[#1A2E3B] dark:text-zinc-200 border border-transparent dark:border-zinc-700'
                          }`}
                        >
                          {isNotified ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                              <span>Alert Set</span>
                            </>
                          ) : (
                            <>
                              <Bell className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
                              <span>Notify Me</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => onNavigate?.('partners-community')}
                          className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 inline-flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <span>Hub Preview</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Directory Link & API Readiness notice */}
              <div className="mt-8 text-center space-y-3">
                <button
                  onClick={() => onNavigate?.('partners-community')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-[#162227] hover:bg-slate-200/80 dark:hover:bg-zinc-800 text-[#1A2E3B] dark:text-zinc-100 border border-transparent dark:border-zinc-700 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
                >
                  <span>Explore Partners & Community Hub</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[11px] text-slate-600 dark:text-zinc-400 flex items-center justify-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>API Integration Ready: Connect your API URL to stream live events anytime.</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      <hr className="w-full border-t border-slate-200 dark:border-zinc-800" />

      {/* 3. What's The Drop */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 md:py-24 text-center"
      >
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif text-[#1A2E3B] dark:text-zinc-100 mb-4 sm:mb-8">
          What's The Drop?
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-zinc-400 leading-relaxed px-1 sm:px-4">
          Tucked into the pockets of your local neighborhoods, Flash Drops is quietly becoming the most talked-about community for food lovers. Part daily-deal finder, part sustainability movement, and full social hub, it's a place where great food meets zero waste. Arriving on the app feels like stumbling upon a well-kept local secret. Alerts drop, friends gather to share surplus bundles, and the best local kitchens serve up simple, delicious plates designed for easy, guilt-free dining. Whether you come for the unbeatable prices, the community events, or just to do your part for the planet, Flash Drops captures the easygoing spirit of modern, mindful eating.
        </p>
      </motion.section>

      <hr className="w-full border-t border-slate-200 dark:border-zinc-800" />

      {/* 4. The Ecosystem */}
      <section id="invitation" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 md:py-24 content-visibility-auto">
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif text-[#1A2E3B] dark:text-zinc-100 mb-2 sm:mb-4">
            You're Invited to the Table.
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-zinc-400 max-w-xl mx-auto">
            Whether you eat, cook, or deliver, there's a place for you in the Flash Drops ecosystem.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 sm:mb-20 aspect-[16/9] sm:aspect-[21/9] overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-zinc-800"
        >
          <img 
            src="https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=1600&q=80" 
            alt="Table" 
            width="1200"
            height="514"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
          />
        </motion.div>

        <div className="text-center mb-8 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#1A2E3B] dark:text-zinc-100 mb-2 sm:mb-3">
            The Ecosystem
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-zinc-400 max-w-xl mx-auto">
            Three roles, one mission — rescue great food and build a community around it.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Card 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white dark:bg-[#162227] rounded-xl sm:rounded-2xl shadow-xs hover:shadow-lg transition-all duration-300 border border-slate-200/80 dark:border-zinc-800 overflow-hidden flex flex-col group"
          >
            <div className="aspect-[16/10] sm:aspect-[4/3] w-full overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800&q=80" 
                alt="Foodies" 
                width="600"
                height="450"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
              />
            </div>
            <div className="p-5 sm:p-7 flex-1 flex flex-col">
              <p className="text-[11px] font-bold tracking-wider text-slate-400 dark:text-zinc-400 uppercase mb-1.5">Customers</p>
              <h3 className="text-xl sm:text-2xl font-serif text-[#1A2E3B] dark:text-zinc-100 mb-4">For Foodies</h3>
              <ul className="space-y-3 sm:space-y-4 text-slate-600 dark:text-zinc-400 text-xs sm:text-sm">
                <li className="flex items-start">
                  <span className="mr-2 text-amber-500 dark:text-amber-400 font-bold">•</span>
                  <span>Real-time surplus Drop alerts</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-amber-500 dark:text-amber-400 font-bold">•</span>
                  <span>Zozo AI Concierge for dietary matching and spice-level checks</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-amber-500 dark:text-amber-400 font-bold">•</span>
                  <span>Live CO2 prevention and savings tracking</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-amber-500 dark:text-amber-400 font-bold">•</span>
                  <span>Access to local Drop Pool community events</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-[#162227] rounded-xl sm:rounded-2xl shadow-xs hover:shadow-lg transition-all duration-300 border border-slate-200/80 dark:border-white/10 overflow-hidden flex flex-col group"
          >
            <div className="aspect-[16/10] sm:aspect-[4/3] w-full overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1556910110-a5a63dfd393c?w=800&q=80" 
                alt="Kitchens" 
                width="600"
                height="450"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
              />
            </div>
            <div className="p-5 sm:p-7 flex-1 flex flex-col">
              <p className="text-[11px] font-bold tracking-wider text-slate-400 dark:text-zinc-400 uppercase mb-1.5">Restaurants, Bakeries & Cafés</p>
              <h3 className="text-xl sm:text-2xl font-serif text-[#1A2E3B] dark:text-zinc-100 mb-4">For Kitchens</h3>
              <ul className="space-y-3 sm:space-y-4 text-slate-600 dark:text-zinc-400 text-xs sm:text-sm">
                <li className="flex items-start">
                  <span className="mr-2 text-amber-500 dark:text-amber-400 font-bold">•</span>
                  <span>Zero-waste enterprise yield management</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-amber-500 dark:text-amber-400 font-bold">•</span>
                  <span>Automated AI pricing for surplus inventory</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-amber-500 dark:text-amber-400 font-bold">•</span>
                  <span>Instant settlements via Razorpay</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-amber-500 dark:text-amber-400 font-bold">•</span>
                  <span>Seamless partner verification</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white dark:bg-[#162227] rounded-xl sm:rounded-2xl shadow-xs hover:shadow-lg transition-all duration-300 border border-slate-200/80 dark:border-white/10 overflow-hidden flex flex-col group"
          >
            <div className="aspect-[16/10] sm:aspect-[4/3] w-full overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?w=800&q=80" 
                alt="Delivery Partners" 
                width="600"
                height="450"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105" 
              />
            </div>
            <div className="p-5 sm:p-7 flex-1 flex flex-col">
              <p className="text-[11px] font-bold tracking-wider text-slate-400 dark:text-zinc-400 uppercase mb-1.5">Delivery Partners</p>
              <h3 className="text-xl sm:text-2xl font-serif text-[#1A2E3B] dark:text-zinc-100 mb-4">For Drop Agents</h3>
              <ul className="space-y-3 sm:space-y-4 text-slate-600 dark:text-zinc-400 text-xs sm:text-sm">
                <li className="flex items-start">
                  <span className="mr-2 text-amber-500 dark:text-amber-400 font-bold">•</span>
                  <span>Hyper-local neighborhood routing</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-amber-500 dark:text-amber-400 font-bold">•</span>
                  <span>Flexible drop schedules</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-amber-500 dark:text-amber-400 font-bold">•</span>
                  <span>Transparent earnings and payout tracking</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-amber-500 dark:text-amber-400 font-bold">•</span>
                  <span>Eco-friendly delivery optimization</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5. Under The Hood */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 md:py-24 border-t border-slate-200 dark:border-zinc-800 content-visibility-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#1A2E3B] dark:text-zinc-100 mb-10 sm:mb-16 text-center"
        >
          Under the Hood
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 sm:gap-x-12 gap-y-8 sm:gap-y-12">
          {[
            {
              icon: Smartphone,
              title: "Cross-Platform",
              desc: "Web, iOS, and Android readiness with native Play Store experience."
            },
            {
              icon: ShieldCheck,
              title: "Bank-Grade Security",
              desc: "100% secure payments processed via Razorpay."
            },
            {
              icon: RefreshCw,
              title: "Real-Time Sync",
              desc: "Live push notifications and atomic inventory locking."
            },
            {
              icon: Sparkles,
              title: "Smart Matching",
              desc: "AI-driven food and dietary preference alignment."
            }
          ].map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex gap-4 group"
              >
                <motion.div 
                  whileHover={{ scale: 1.15, rotate: 4 }}
                  transition={{ type: "spring", stiffness: 350, damping: 12 }}
                  className="flex-shrink-0 mt-0.5 p-2.5 rounded-lg bg-slate-100 dark:bg-white/10 text-[#1A2E3B] dark:text-amber-400 group-hover:bg-[#1A2E3B] dark:group-hover:bg-amber-500 dark:group-hover:text-[#10181A] group-hover:text-white transition-colors h-11 w-11 flex items-center justify-center border border-transparent dark:border-white/10"
                >
                  <Icon className="w-5 h-5" strokeWidth={1.7} />
                </motion.div>
                <div>
                  <h4 className="text-lg sm:text-xl font-semibold text-[#1A2E3B] dark:text-zinc-100 mb-1">{feature.title}</h4>
                  <p className="text-slate-600 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>



      {/* 6. CTA / Waitlist with Google Play Announcement */}
      <section id="waitlist" className="w-full bg-[#142326] dark:bg-[#0E1619] text-white py-14 sm:py-20 md:py-24 px-4 sm:px-6 relative overflow-hidden border-t border-transparent dark:border-white/10">
        {/* Subtle background animated gradient orb */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="absolute -top-24 -right-24 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-amber-500/20 blur-3xl pointer-events-none"
        />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-4 sm:space-y-6 relative z-10">
          
          {/* Animated Play Store Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/10 dark:bg-white/10 border border-white/20 dark:border-white/15 text-amber-300 text-[11px] sm:text-sm font-semibold mb-1"
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none">
              <path d="M3.609 1.814L13.793 12 3.61 22.186A2.22 2.22 0 0 1 3 20.615V3.385c0-.604.224-1.168.609-1.571z" fill="#00D3FF"/>
              <path d="M17.202 8.591L13.793 12 3.609 1.814a2.27 2.27 0 0 1 1.258-.364c.553 0 1.096.173 1.58.497l10.755 6.644z" fill="#00F076"/>
              <path d="M17.202 15.409l-10.755 6.644a2.766 2.766 0 0 1-1.58.497c-.456 0-.895-.128-1.258-.364L13.793 12l3.409 3.409z" fill="#FF3A44"/>
              <path d="M21.578 11.233l-4.376-2.642L13.793 12l3.409 3.409 4.376-2.642c.866-.534.866-1.999 0-2.534z" fill="#FFC800"/>
            </svg>
            <span>Launching on Google Play Store</span>
          </motion.div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif mb-1 sm:mb-2 leading-tight">
            Don't drop the ball on this one.
          </h2>
          <p className="text-base sm:text-xl text-amber-300 mb-1 sm:mb-2 font-medium">
            Join the Waitlist & Pre-Register for Google Play!
          </p>
          <p className="text-xs sm:text-sm md:text-base text-white/70 dark:text-zinc-300 mb-6 sm:mb-8 max-w-xl mx-auto leading-relaxed">
            Be the first to know when the official Flash Drops app lands on the Play Store. Enjoy exclusive welcome perks, early drop access, and zero FOMO.
          </p>
          
          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-5 sm:p-6 rounded-xl bg-amber-950/60 border border-amber-400/40 text-amber-100 max-w-md mx-auto shadow-lg"
            >
              <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400 mx-auto mb-2.5" />
              <h4 className="text-base sm:text-lg font-bold text-white mb-1">You're on the VIP Launch List!</h4>
              <p className="text-xs sm:text-sm text-amber-200">
                We'll notify you via <span className="font-semibold text-white">{email}</span> the instant the app goes live on Google Play!
              </p>
            </motion.div>
          ) : (
            <div className="w-full max-w-lg mx-auto px-4 sm:px-6 pt-2">
              <form className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full" onSubmit={handleSubmit}>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address" 
                  className="w-full sm:flex-1 px-4 py-3.5 sm:py-3 rounded-xl bg-white/10 dark:bg-[#162227] border border-white/20 dark:border-white/15 text-white placeholder-white/50 dark:placeholder-zinc-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 text-sm transition-all min-h-[44px]"
                  required
                />
                <motion.button 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="w-full sm:w-auto px-7 py-3.5 sm:py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-[#10181A] font-bold rounded-xl shadow-md transition-colors whitespace-nowrap text-sm cursor-pointer min-h-[44px] flex items-center justify-center active:scale-98"
                >
                  Pre-Register Now
                </motion.button>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* 7. Responsive Quiet Luxury Footer */}
      <footer className="w-full bg-[#F9F8F6] dark:bg-[#0B0F12] py-12 sm:py-16 px-4 sm:px-6 md:px-8 lg:px-12 border-t border-slate-200 dark:border-white/10 transition-colors content-visibility-auto">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-8 sm:gap-10">
          
          {/* Responsive Footer Links Grid: 1 col on mobile, 2 on tablet, 3 on desktop */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 w-full max-w-4xl pb-8 border-b border-slate-200/80 dark:border-zinc-800 text-left">
            {/* Column 1: Experience & Drops */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 block font-mono">
                Reserve & Drops
              </span>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-zinc-400">
                <li>
                  <button 
                    onClick={() => {
                      const el = document.getElementById('invitation');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="min-h-[44px] py-1 px-1 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer flex items-center text-left"
                  >
                    VIP Invitation & Access
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigate?.('livedrops')}
                    className="min-h-[44px] py-1 px-1 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer flex items-center text-left"
                  >
                    Live Reserve Vault Drops
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigate?.('partners-community')}
                    className="min-h-[44px] py-1 px-1 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer flex items-center text-left"
                  >
                    Flash Tables Dining
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 2: Community & Logistics */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 block font-mono">
                Community & Network
              </span>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-zinc-400">
                <li>
                  <button 
                    onClick={() => onNavigate?.('partners-community')}
                    className="min-h-[44px] py-1 px-1 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer flex items-center text-left"
                  >
                    Community & Restaurant Partners
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      const el = document.getElementById('delivery-fleet-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="min-h-[44px] py-1 px-1 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer flex items-center text-left"
                  >
                    100% Green E-Bike Delivery Fleet
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigate?.('help-support')}
                    className="min-h-[44px] py-1 px-1 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer flex items-center text-left"
                  >
                    Help Center & FAQs
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Trust & Compliance */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 block font-mono">
                Trust & Legal Accord
              </span>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-zinc-400">
                <li>
                  <button 
                    onClick={() => onNavigate?.('contact')}
                    className="min-h-[44px] py-1 px-1 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer flex items-center text-left"
                  >
                    Contact & Community Ratings
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigate?.('terms-guide')}
                    className="min-h-[44px] py-1 px-1 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer flex items-center text-left"
                  >
                    Master Terms & Merchant Guide
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigate?.('privacy-policy')}
                    className="min-h-[44px] py-1 px-1 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer flex items-center text-left"
                  >
                    Privacy Policy & Regional Addenda
                  </button>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <span className="text-[11px] text-slate-500 dark:text-zinc-400 uppercase tracking-widest font-semibold font-mono">Powered By</span>
            <a 
              href="https://driyoz.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-14 h-14 sm:w-16 sm:h-16 bg-[#1A2E3B] dark:bg-[#162227] rounded-xl flex items-center justify-center text-white overflow-hidden shadow-sm hover:opacity-85 hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-[#1A2E3B] focus:ring-offset-2 dark:focus:ring-offset-black border border-transparent dark:border-zinc-800 p-1.5"
            >
              <img 
                src="/src/assets/images/regenerated_image_1789567301614.jpg" 
                alt="Logo" 
                width="52"
                height="52"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover rounded-lg" 
                onError={(e) => { e.currentTarget.style.display = 'none'; }} 
              />
            </a>
          </div>
          
          <div className="flex flex-col items-center justify-center gap-2 text-[11px] sm:text-xs text-slate-400 dark:text-zinc-600 text-center font-mono">
            <span>Copyright © July 2026 | Flash Drops | All Rights Reserved.</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 text-slate-600 dark:text-zinc-400 font-semibold text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {APP_GIT_TAG}
            </span>
          </div>
        </div>
      </footer>



    </div>
  );
}

