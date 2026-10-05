import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  UtensilsCrossed, 
  Star, 
  Bike, 
  Calendar, 
  Users, 
  MapPin, 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  ChevronRight, 
  ShieldCheck, 
  Leaf, 
  Clock, 
  Bell, 
  X, 
  Globe 
} from 'lucide-react';
import { motion } from 'motion/react';
import { fetchCommunityData, type CommunityEvent } from '../services/communityApi';
import { fetchRestaurants, fetchDeliveryFleet, type Restaurant, type DeliveryPartner } from '../services/partnersApi';

interface PartnersCommunityPageProps {
  onNavigate: (page: string) => void;
}

export function PartnersCommunityPage({ onNavigate }: PartnersCommunityPageProps) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [deliveryFleet, setDeliveryFleet] = useState<DeliveryPartner[]>([]);
  const [communityEvents, setCommunityEvents] = useState<CommunityEvent[]>([]);
  const [isCommunityComingSoon, setIsCommunityComingSoon] = useState(true);
  const [connectedApiUrl, setConnectedApiUrl] = useState<string>('');

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'restaurants' | 'fleet' | 'green_fleet' | 'delivery_fleet' | 'events'>('all');
  const [fleetFilter, setFleetFilter] = useState<'all' | 'green' | 'delivery'>('all');
  const [rsvpList, setRsvpList] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isBannerDismissed, setIsBannerDismissed] = useState(() => {
    return typeof window !== 'undefined' ? localStorage.getItem('hide_community_preview_banner') === 'true' : false;
  });

  const handleDismissBanner = () => {
    setIsBannerDismissed(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('hide_community_preview_banner', 'true');
    }
  };

  const loadCommunityData = async (overrideUrl?: string) => {
    try {
      const res = await fetchCommunityData(overrideUrl);
      setCommunityEvents(res.events);
      setIsCommunityComingSoon(res.isComingSoon);
      setConnectedApiUrl(res.apiUrl || '');
    } catch (err: any) {
      console.error('Failed to fetch community data:', err);
    }
  };

  useEffect(() => {
    let isMounted = true;
    async function loadAllData() {
      try {
        const [loadedRestaurants, loadedFleet] = await Promise.all([
          fetchRestaurants(),
          fetchDeliveryFleet()
        ]);
        if (isMounted) {
          setRestaurants(loadedRestaurants);
          setDeliveryFleet(loadedFleet);
        }
      } catch (err) {
        console.error('Failed to load partners/fleet:', err);
      }
      if (isMounted) {
        await loadCommunityData();
        setIsLoading(false);
      }
    }

    loadAllData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRsvp = (eventId: string, eventName: string) => {
    const nextState = !rsvpList[eventId];
    setRsvpList((prev) => ({ ...prev, [eventId]: nextState }));
    setToastMessage(nextState ? `You are on the priority list for: "${eventName}"!` : `Cancelled reservation for: "${eventName}".`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const displayedFleet = deliveryFleet.filter((courier) => {
    if (activeTab === 'green_fleet') return courier.fleet_type === 'green';
    if (activeTab === 'delivery_fleet') return courier.fleet_type === 'delivery';
    if (fleetFilter === 'green') return courier.fleet_type === 'green';
    if (fleetFilter === 'delivery') return courier.fleet_type === 'delivery';
    return true;
  });

  return (
    <div className="w-full text-[#111827] dark:text-zinc-100 font-sans pb-24 transition-colors duration-500">
      
      {/* Top back navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button
          onClick={() => onNavigate('landing')}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-zinc-400 hover:text-[#1A2E3B] dark:hover:text-zinc-100 transition-colors p-2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-700/60 shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pt-6 pb-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800/80 text-xs font-semibold tracking-wider uppercase text-amber-800 dark:text-amber-300 mb-3 shadow-2xs">
            Ecosystem Directory
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-serif text-[#1A2E3B] dark:text-zinc-100 mb-3 tracking-tight">
            Partners & Community Hub
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Explore verified kitchen partners, zero-emission green couriers, and grassroots surplus food initiatives.
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-8">
          {[
            { id: 'all', label: 'All Ecosystem' },
            { id: 'restaurants', label: 'Partner Restaurants' },
            { id: 'green_fleet', label: 'Green Fleet' },
            { id: 'delivery_fleet', label: 'Delivery Fleet' },
            { 
              id: 'events', 
              label: 'Community Events',
              badge: isCommunityComingSoon ? 'Coming Soon' : 'Live'
            },
          ].map((tab) => {
            const isTabActive = activeTab === tab.id || (tab.id === 'delivery_fleet' && activeTab === 'fleet');
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  if (tab.id === 'green_fleet') setFleetFilter('green');
                  else if (tab.id === 'delivery_fleet') setFleetFilter('delivery');
                  else if (tab.id === 'all') setFleetFilter('all');
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer inline-flex items-center gap-2 border ${
                  isTabActive
                    ? 'bg-[#1A2E3B] text-white border-[#1A2E3B] dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100 shadow-sm'
                    : 'bg-white dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-700/60'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {toastMessage && (
          <div className="mt-4 p-3 bg-white dark:bg-[#162227] border border-slate-200 dark:border-zinc-800 shadow-sm text-slate-800 dark:text-zinc-100 rounded-xl text-xs sm:text-sm max-w-md mx-auto flex items-center justify-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
      </section>

      {/* Main Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 space-y-16 sm:space-y-24">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#1A2E3B] dark:text-zinc-100 space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
            <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">
              Fetching verified partners and community data...
            </p>
          </div>
        ) : (
          <>
            {/* 1. Partner Restaurants Grid: 1 col on mobile, 2 on tablet, 3 or 4 on desktop */}
            {(activeTab === 'all' || activeTab === 'restaurants') && (
              <section id="partner-restaurants-full">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200 dark:border-zinc-800">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#1A2E3B] dark:text-zinc-100 tracking-tight">
                      Partner Restaurants
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-zinc-400 font-normal">
                      Independent kitchens turning surplus meals into accessible Flash Drops.
                    </p>
                  </div>
                  <span className="text-xs font-semibold font-mono tabular-nums text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800/80 px-3 py-1 rounded-full">
                    {restaurants.length} Verified Kitchens
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {restaurants.map((restaurant, idx) => (
                    <motion.div
                      key={restaurant.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.08 }}
                      className="bg-white dark:bg-[#162227] rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/80 flex items-center justify-center">
                            <UtensilsCrossed className="w-6 h-6" />
                          </div>
                          <div className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 px-2.5 py-1 rounded-lg text-xs font-bold font-mono tabular-nums border border-slate-200 dark:border-zinc-700">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{restaurant.rating.toFixed(1)}</span>
                          </div>
                        </div>

                        <h3 className="text-lg sm:text-xl font-bold font-serif text-[#1A2E3B] dark:text-zinc-100 mb-1 flex items-center gap-1.5">
                          <span>{restaurant.name}</span>
                          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium mb-2">
                          {restaurant.food_type}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400 mb-4 flex items-center gap-1 font-normal">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span>{restaurant.address}</span>
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                        <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Surplus Status</span>
                        {restaurant.surplus_active ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 px-2.5 py-1 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Drop Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-100 dark:bg-zinc-800 px-2.5 py-1 rounded-full border border-slate-200 dark:border-zinc-700">
                            Sold Out Today
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* 2. Delivery Fleet: 1 col on mobile, 2 on tablet, 3 on desktop */}
            {(activeTab === 'all' || activeTab === 'fleet' || activeTab === 'green_fleet' || activeTab === 'delivery_fleet') && (
              <section id="delivery-fleet-full">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200 dark:border-zinc-800">
                  <div className="flex-1 min-w-[260px]">
                    <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#1A2E3B] dark:text-zinc-100 tracking-tight">
                      Our Delivery & Green Fleet
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-zinc-400 font-normal">
                      Eco-conscious couriers delivering surplus food with zero emissions and dedicated rapid transit.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5">
                      <Leaf className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      100% Green E-Bike Fleet
                    </span>
                  </div>
                </div>

                {/* Fleet Category Quick Filter */}
                <div className="flex items-center gap-2 mb-6">
                  <button
                    type="button"
                    onClick={() => {
                      setFleetFilter('all');
                      if (activeTab === 'green_fleet' || activeTab === 'delivery_fleet') {
                        setActiveTab('all');
                      }
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                      (fleetFilter === 'all' && activeTab !== 'green_fleet' && activeTab !== 'delivery_fleet')
                        ? 'bg-[#1A2E3B] text-white border-[#1A2E3B] dark:bg-zinc-100 dark:text-zinc-900 shadow-sm'
                        : 'bg-white dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-700/60'
                    }`}
                  >
                    All Fleets (<span className="font-mono tabular-nums">{deliveryFleet.length}</span>)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFleetFilter('green');
                      if (activeTab === 'delivery_fleet') {
                        setActiveTab('green_fleet');
                      }
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5 border ${
                      (activeTab === 'green_fleet' || (fleetFilter === 'green' && activeTab !== 'delivery_fleet'))
                        ? 'bg-[#1A2E3B] text-white border-[#1A2E3B] dark:bg-zinc-100 dark:text-zinc-900 shadow-sm'
                        : 'bg-white dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-700/60'
                    }`}
                  >
                    <Leaf className="w-3.5 h-3.5" />
                    Green Fleet (<span className="font-mono tabular-nums">{deliveryFleet.filter(c => c.fleet_type === 'green').length}</span>)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFleetFilter('delivery');
                      if (activeTab === 'green_fleet') {
                        setActiveTab('delivery_fleet');
                      }
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5 border ${
                      (activeTab === 'delivery_fleet' || (fleetFilter === 'delivery' && activeTab !== 'green_fleet'))
                        ? 'bg-[#1A2E3B] text-white border-[#1A2E3B] dark:bg-zinc-100 dark:text-zinc-900 shadow-sm'
                        : 'bg-white dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-700/60'
                    }`}
                  >
                    <Bike className="w-3.5 h-3.5" />
                    Delivery Fleet (<span className="font-mono tabular-nums">{deliveryFleet.filter(c => c.fleet_type === 'delivery').length}</span>)
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedFleet.map((courier, idx) => {
                    const isGreen = courier.fleet_type === 'green';
                    return (
                      <motion.div
                        key={courier.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.08 }}
                        className="bg-white dark:bg-[#162227] rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${
                              isGreen 
                                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/80' 
                                : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/80'
                            }`}>
                              {isGreen ? <Leaf className="w-6 h-6" /> : <Bike className="w-6 h-6" />}
                            </div>
                            <span className="text-xs font-semibold font-mono tabular-nums px-2.5 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300">
                              {courier.status}
                            </span>
                          </div>

                          <h3 className="text-xl font-bold font-serif text-[#1A2E3B] dark:text-zinc-100 mb-1">
                            {courier.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 font-medium mb-1">
                            {courier.vehicle}
                          </p>
                          {courier.badge && (
                            <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono mb-4">
                              {courier.badge} • ETA: <span className="tabular-nums">{courier.delivery_time}</span>
                            </p>
                          )}
                        </div>

                        <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 grid grid-cols-2 gap-3 text-left">
                          <div className="bg-slate-50 dark:bg-zinc-800/60 rounded-xl p-3 border border-slate-200/80 dark:border-zinc-800">
                            <span className="text-[10px] text-slate-500 dark:text-zinc-400 uppercase font-semibold block">Deliveries</span>
                            <span className="text-sm font-bold font-mono text-[#1A2E3B] dark:text-zinc-100 tabular-nums">{courier.total_deliveries.toLocaleString()}</span>
                          </div>
                          <div className="bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl p-3 border border-emerald-200/60 dark:border-emerald-800/40">
                            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 uppercase font-semibold block">CO₂ Offset</span>
                            <span className="text-sm font-bold font-mono text-emerald-800 dark:text-emerald-300 tabular-nums">{courier.impact_saved_kg} kg</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* 3. Community Events: 1 col on mobile, 2 on tablet, 3 on desktop */}
            {(activeTab === 'all' || activeTab === 'events') && (
              <section id="community-events-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-zinc-800">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#1A2E3B] dark:text-zinc-100 tracking-tight">
                        Community Gatherings & Events
                      </h2>
                      {isCommunityComingSoon ? (
                        <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          Coming Soon
                        </span>
                      ) : (
                        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                          <Globe className="w-3.5 h-3.5" />
                          Live Connected
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-zinc-400 font-normal">
                      Workshops, food drives, and zero-waste celebrations happening in your neighborhood.
                    </p>
                  </div>
                  
                  <span className="text-xs font-semibold font-mono tabular-nums text-slate-600 dark:text-zinc-300 bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 px-3 py-1.5 rounded-full">
                    {communityEvents.length} Gatherings Listed
                  </span>
                </div>

                {/* Event Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {communityEvents.map((evt, idx) => {
                    const isRsvped = rsvpList[evt.id];
                    const isEventComingSoon = isCommunityComingSoon || evt.is_coming_soon || evt.status === 'coming_soon';

                    return (
                      <motion.div
                        key={evt.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.08 }}
                        className="bg-white dark:bg-[#162227] rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between group"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-3 mb-4">
                            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800/80 px-2.5 py-1 rounded-full">
                              {evt.event_type}
                            </span>
                            {isEventComingSoon ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase text-slate-600 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 px-2 py-0.5 rounded-md">
                                {evt.badge || 'Coming Soon'}
                              </span>
                            ) : (
                              <div className="flex items-center gap-1.5 text-xs font-semibold font-mono tabular-nums text-slate-600 dark:text-zinc-300">
                                <Users className="w-3.5 h-3.5 text-amber-500" />
                                <span>{(evt.attendees + (isRsvped ? 1 : 0))} RSVP'd</span>
                              </div>
                            )}
                          </div>

                          <h3 className="text-xl font-bold font-serif text-[#1A2E3B] dark:text-zinc-100 mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                            {evt.event_name}
                          </h3>

                          {evt.description && (
                            <p className="text-xs text-slate-600 dark:text-zinc-400 font-normal leading-relaxed mb-5 line-clamp-3">
                              {evt.description}
                            </p>
                          )}

                          <div className="space-y-2 mb-6 text-xs text-slate-500 dark:text-zinc-400 font-medium">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                              <span>{evt.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-slate-400" />
                              <span>{evt.location}</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 dark:border-zinc-800">
                          {/* Tactile Action Button */}
                          <button
                            onClick={() => handleRsvp(evt.id, evt.event_name)}
                            className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                              isRsvped
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                                : 'bg-[#1A2E3B] hover:bg-[#253E50] text-white dark:bg-zinc-100 dark:text-zinc-900 border-[#1A2E3B] dark:border-zinc-100 shadow-sm'
                            }`}
                          >
                            {isRsvped ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                <span>On Priority List ✓</span>
                              </>
                            ) : (
                              <>
                                <span>RSVP Free Admission</span>
                                <ChevronRight className="w-4 h-4" />
                              </>
                            )}
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </section>
            )}
          </>
        )}

        {/* Partner with us Callout */}
        <div className="bg-[#1A2E3B] dark:bg-zinc-950 text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden border border-slate-200/20 dark:border-zinc-800 shadow-lg">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-white/10 text-amber-300 border border-white/15">
              Grow the Movement
            </span>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-white">
              Want to partner your kitchen or join as a courier?
            </h3>
            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
              Join hundreds of ethical kitchens eliminating surplus and couriers earning flexible rates while helping the planet.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('contact')}
                className="bg-amber-500 hover:bg-amber-400 text-zinc-950 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors cursor-pointer shadow-sm"
              >
                Apply as Partner Kitchen
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="bg-white/10 hover:bg-white/15 text-white border border-white/20 px-6 py-3 rounded-xl font-semibold text-sm transition-colors cursor-pointer"
              >
                Become a Drop Courier
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
