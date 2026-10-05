import { useState, useEffect } from 'react';
import { 
  X, 
  Ticket, 
  TrendingUp, 
  SlidersHorizontal, 
  Star, 
  Check, 
  Leaf, 
  Clock, 
  MapPin, 
  QrCode, 
  Flame, 
  ExternalLink,
  ShieldCheck,
  Bell,
  Utensils
} from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export interface UserReservation {
  id: string;
  dropId?: string;
  title: string;
  restaurant: string;
  price: number;
  originalPrice?: number;
  pickupWindow: string;
  status: 'reserved' | 'collected' | 'cancelled';
  reservationCode: string;
  createdAt?: string;
}

interface UserAccountModalsProps {
  activeModal: 'reservations' | 'impact' | 'preferences' | 'favorites' | null;
  onClose: () => void;
  user: any;
  reservations: UserReservation[];
  onNavigate?: (page: string) => void;
}

export function UserAccountModals({
  activeModal,
  onClose,
  user,
  reservations,
  onNavigate
}: UserAccountModalsProps) {
  // Dietary Preferences state
  const [selectedDiets, setSelectedDiets] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('flash-drops-dietary-prefs');
      return saved ? JSON.parse(saved) : ['Vegetarian', 'Zero Additives'];
    } catch {
      return ['Vegetarian', 'Zero Additives'];
    }
  });

  const [allergenAlerts, setAllergenAlerts] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('flash-drops-allergen-alerts');
      return saved ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [dropAlertThreshold, setDropAlertThreshold] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('flash-drops-price-threshold');
      return saved ? Number(saved) : 350;
    } catch {
      return 350;
    }
  });

  const [savedPrefsSuccess, setSavedPrefsSuccess] = useState(false);

  // Favorite Kitchens state
  const [favoriteKitchens, setFavoriteKitchens] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('flash-drops-favorite-kitchens');
      return saved ? JSON.parse(saved) : [
        'Artisan Sourdough Bakery',
        'Green Garden Bistro',
        "L'Étoile Patisserie & Salon"
      ];
    } catch {
      return ['Artisan Sourdough Bakery', 'Green Garden Bistro'];
    }
  });

  // Selected reservation for QR Pickup pass
  const [activeQrPass, setActiveQrPass] = useState<UserReservation | null>(null);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeQrPass) {
          setActiveQrPass(null);
        } else {
          onClose();
        }
      }
    };
    if (activeModal) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, activeQrPass, onClose]);

  if (!activeModal) return null;

  // Save dietary preferences
  const handleSavePreferences = () => {
    try {
      localStorage.setItem('flash-drops-dietary-prefs', JSON.stringify(selectedDiets));
      localStorage.setItem('flash-drops-allergen-alerts', JSON.stringify(allergenAlerts));
      localStorage.setItem('flash-drops-price-threshold', String(dropAlertThreshold));
      setSavedPrefsSuccess(true);
      setTimeout(() => setSavedPrefsSuccess(false), 2500);
    } catch (err) {
      console.warn('Failed to save preferences to localStorage:', err);
    }
  };

  const toggleDietTag = (tag: string) => {
    setSelectedDiets(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const toggleFavoriteKitchen = (kitchen: string) => {
    setFavoriteKitchens(prev => {
      const updated = prev.includes(kitchen) 
        ? prev.filter(k => k !== kitchen)
        : [...prev, kitchen];
      try {
        localStorage.setItem('flash-drops-favorite-kitchens', JSON.stringify(updated));
      } catch (err) {
        console.warn('Failed to save favorites:', err);
      }
      return updated;
    });
  };

  const handleCancelReservation = async (reservationId: string) => {
    try {
      await updateDoc(doc(db, 'reservations', reservationId), {
        status: 'cancelled',
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'reservations');
    }
  };

  // Calculations for Impact
  const completedOrActiveReservations = reservations.filter(r => r.status !== 'cancelled');
  const countRescued = completedOrActiveReservations.length > 0 ? completedOrActiveReservations.length : 1;
  const moneySaved = completedOrActiveReservations.reduce((acc, curr) => {
    const orig = curr.originalPrice || (curr.price ? Math.round(curr.price * 2.5) : 550);
    return acc + Math.max(0, orig - curr.price);
  }, 0) || 450;
  const co2Saved = (countRescued * 2.4).toFixed(1);
  const waterSaved = countRescued * 180;

  const partnerKitchenList = [
    {
      name: 'Artisan Sourdough Bakery',
      area: 'Bandra West, Mumbai',
      specialty: 'Ancient Grain Sourdough & Morning Brioche',
      activeDropsToday: 2,
      discount: '67% OFF'
    },
    {
      name: 'Green Garden Bistro',
      area: 'Indiranagar, Bengaluru',
      specialty: 'Farm-to-Table Bowls & Truffle Mezze',
      activeDropsToday: 3,
      discount: '66% OFF'
    },
    {
      name: "L'Étoile Patisserie & Salon",
      area: 'Hauz Khas, New Delhi',
      specialty: 'Haute Pâtisserie & Dark Ganache Tarts',
      activeDropsToday: 1,
      discount: '63% OFF'
    },
    {
      name: 'Truffle & Herb Brasserie',
      area: 'Koregaon Park, Pune',
      specialty: 'Fresh Handmade Agnolotti & Herb Focaccia',
      activeDropsToday: 0,
      discount: '65% OFF'
    },
    {
      name: 'Botanica Hearth & Roastery',
      area: 'Jubilee Hills, Hyderabad',
      specialty: 'Single-Origin Brews & Artisan Focaccia',
      activeDropsToday: 2,
      discount: '60% OFF'
    }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 dark:bg-black/80 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="w-full max-w-xl max-h-[90vh] flex flex-col rounded-3xl bg-[#FFFDF9] dark:bg-[#142326] border border-[#EBE4D8] dark:border-white/10 shadow-2xl text-slate-800 dark:text-zinc-100 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EBE4D8] dark:border-white/10 bg-[#FAF7F2] dark:bg-[#111C1F]">
          <div className="flex items-center gap-3">
            {activeModal === 'reservations' && (
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 dark:bg-amber-400/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Ticket className="w-5 h-5" />
              </div>
            )}
            {activeModal === 'impact' && (
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 dark:bg-emerald-400/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
            )}
            {activeModal === 'preferences' && (
              <div className="w-10 h-10 rounded-xl bg-indigo-500/15 dark:bg-indigo-400/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
            )}
            {activeModal === 'favorites' && (
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 dark:bg-rose-400/15 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Star className="w-5 h-5" />
              </div>
            )}

            <div>
              <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                {activeModal === 'reservations' && 'My Drop Reservations'}
                {activeModal === 'impact' && 'Impact & Personal Savings'}
                {activeModal === 'preferences' && 'Dietary & Allergen Preferences'}
                {activeModal === 'favorites' && 'Favorite Kitchens & Alerts'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                {user?.displayName || user?.email || 'Flash Drops Member'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* ============================================================ */}
          {/* 1. MY RESERVATIONS CONTENT                                  */}
          {/* ============================================================ */}
          {activeModal === 'reservations' && (
            <div className="space-y-4">
              {reservations.length === 0 ? (
                <div className="text-center py-10 px-4 space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center border border-amber-200 dark:border-amber-800/50">
                    <Ticket className="w-8 h-8" />
                  </div>
                  <div className="space-y-1 max-w-sm mx-auto">
                    <h4 className="font-bold text-base text-slate-800 dark:text-zinc-100">
                      No active reservations yet
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      Surplus drop windows open daily between 17:00 and 21:00. Reserve a fresh gourmet surplus crate today!
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onNavigate?.('livedrops');
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs sm:text-sm shadow-xs transition-transform active:scale-95 cursor-pointer"
                  >
                    <Flame className="w-4 h-4" />
                    <span>Explore Live Drops Feed</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400 pb-1">
                    <span>{reservations.length} total drop reservation(s)</span>
                    <span className="font-medium text-amber-600 dark:text-amber-400">
                      Show pickup pass at counter
                    </span>
                  </div>

                  {reservations.map((res) => {
                    const isActive = res.status === 'reserved' || !res.status;
                    return (
                      <div
                        key={res.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          isActive
                            ? 'bg-white dark:bg-[#16272B] border-[#E8DFD0] dark:border-amber-500/20 shadow-xs'
                            : 'bg-slate-50/70 dark:bg-white/5 border-slate-200 dark:border-white/5 opacity-75'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                  isActive
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                    : res.status === 'collected'
                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                    : 'bg-slate-200 text-slate-700 dark:bg-zinc-800 dark:text-zinc-400'
                                }`}
                              >
                                {res.status || 'Active Pass'}
                              </span>
                              <span className="text-xs font-mono text-slate-500 dark:text-zinc-400 font-bold">
                                #{res.reservationCode}
                              </span>
                            </div>
                            <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                              {res.title}
                            </h4>
                            <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                              {res.restaurant}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="font-bold text-base text-slate-900 dark:text-zinc-100">
                              ₹{res.price}
                            </p>
                            {res.originalPrice && (
                              <p className="text-xs text-slate-400 line-through">
                                ₹{res.originalPrice}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-1.5 text-slate-600 dark:text-zinc-300">
                            <Clock className="w-3.5 h-3.5 text-amber-500" />
                            <span>Pickup: {res.pickupWindow}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {isActive && (
                              <>
                                <button
                                  onClick={() => setActiveQrPass(res)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold text-xs transition-colors cursor-pointer"
                                >
                                  <QrCode className="w-3.5 h-3.5" />
                                  <span>Pickup QR</span>
                                </button>
                                <button
                                  onClick={() => handleCancelReservation(res.id)}
                                  className="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-red-600 text-xs transition-colors cursor-pointer"
                                  title="Release drop for others"
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* 2. IMPACT & SAVINGS CONTENT                                 */}
          {/* ============================================================ */}
          {activeModal === 'impact' && (
            <div className="space-y-6">
              {/* Highlight hero metrics */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20">
                  <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                    Total Money Saved
                  </p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
                    ₹{moneySaved.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1">
                    vs gourmet retail price
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-500/10 dark:bg-emerald-400/10 border border-emerald-500/20">
                  <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                    Meals Rescued
                  </p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                    {countRescued} <span className="text-xs font-normal">crates</span>
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1">
                    prevented from landfill
                  </p>
                </div>
              </div>

              {/* Environmental metrics */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#16272B] border border-[#E8DFD0] dark:border-white/10 space-y-4">
                <h4 className="font-bold text-sm text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-emerald-500" />
                  <span>Environmental Contribution</span>
                </h4>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="text-slate-600 dark:text-zinc-300">CO₂ Greenhouse Gas Averted</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{co2Saved} kg CO₂e</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '65%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="text-slate-600 dark:text-zinc-300">Agricultural Water Conserved</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">{waterSaved} Liters</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '80%' }} />
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-200">
                  <span className="font-bold">Next Milestone: </span> 
                  Rescue {Math.max(1, 5 - countRescued)} more drops to unlock the 
                  <strong className="text-amber-600 dark:text-amber-400"> "Gold Community Patron"</strong> badge with 10-minute early drop alerts.
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* 3. DIETARY & ALLERGEN PREFERENCES CONTENT                   */}
          {/* ============================================================ */}
          {activeModal === 'preferences' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">
                  Dietary Lifestyles & Restrictions
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Vegetarian',
                    '100% Plant-Based',
                    'Gluten-Free',
                    'Dairy-Free',
                    'Nut-Free',
                    'Jain Friendly',
                    'Halal',
                    'Zero Additives',
                    'Low Sugar',
                    'Organic Grain'
                  ].map((tag) => {
                    const isSelected = selectedDiets.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => toggleDietTag(tag)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-amber-500 text-zinc-950 shadow-2xs font-bold scale-102'
                            : 'bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-white/15'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        <span>{tag}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Allergen Alert Toggle */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#16272B] border border-[#E8DFD0] dark:border-white/10 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Strict Cross-Contact Warning</span>
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                    Flag drops prepared in facilities that handle common allergens (peanuts, tree nuts, gluten).
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={allergenAlerts}
                  onChange={(e) => setAllergenAlerts(e.target.checked)}
                  className="w-5 h-5 rounded text-amber-500 accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Price Threshold */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#16272B] border border-[#E8DFD0] dark:border-white/10 space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-zinc-200">
                  <span>Target Drop Price Preference</span>
                  <span className="text-amber-600 dark:text-amber-400">Under ₹{dropAlertThreshold}</span>
                </div>
                <input
                  type="range"
                  min="150"
                  max="600"
                  step="25"
                  value={dropAlertThreshold}
                  onChange={(e) => setDropAlertThreshold(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>₹150 (Everyday basics)</span>
                  <span>₹600 (Haute Reserve)</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold h-5">
                  {savedPrefsSuccess ? '✓ Preferences updated successfully!' : ''}
                </span>
                <button
                  onClick={handleSavePreferences}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs sm:text-sm transition-transform active:scale-95 cursor-pointer shadow-xs"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* 4. FAVORITE KITCHENS CONTENT                                 */}
          {/* ============================================================ */}
          {activeModal === 'favorites' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Starred kitchens notify you 5 minutes before surplus drops go live to the general public.
              </p>

              <div className="space-y-2.5">
                {partnerKitchenList.map((kitchen) => {
                  const isFav = favoriteKitchens.includes(kitchen.name);
                  return (
                    <div
                      key={kitchen.name}
                      className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#16272B] border border-[#E8DFD0] dark:border-white/10 flex items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                            {kitchen.name}
                          </h4>
                          {kitchen.activeDropsToday > 0 && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                              {kitchen.activeDropsToday} drop today
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{kitchen.area}</span>
                          <span className="mx-1">•</span>
                          <span className="text-amber-700 dark:text-amber-400 font-semibold">{kitchen.discount}</span>
                        </p>
                        <p className="text-xs text-slate-600 dark:text-zinc-300">
                          {kitchen.specialty}
                        </p>
                      </div>

                      <button
                        onClick={() => toggleFavoriteKitchen(kitchen.name)}
                        className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                          isFav
                            ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-500'
                            : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400 hover:text-rose-500'
                        }`}
                        title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Star className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 text-center">
                <button
                  onClick={() => {
                    onClose();
                    onNavigate?.('livedrops');
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                >
                  <span>View live surplus drops from these kitchens</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-[#EBE4D8] dark:border-white/10 bg-[#FAF7F2] dark:bg-[#111C1F] flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
          <span>Protected with Firebase Auth & Cloud Firestore</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-slate-700 dark:text-zinc-200 hover:bg-slate-200/60 dark:hover:bg-white/10 font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>

      {/* QR Pickup Pass Dialog Overlay */}
      {activeQrPass && (
        <div 
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 animate-in fade-in"
          onClick={() => setActiveQrPass(null)}
        >
          <div 
            className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#142326] p-6 text-center space-y-4 border border-slate-200 dark:border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <QrCode className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">
                Pickup Pass Code
              </h4>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Present this code to the manager at {activeQrPass.restaurant}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-black/40 border border-dashed border-amber-500 font-mono text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 tracking-wider">
              {activeQrPass.reservationCode}
            </div>

            <div className="text-xs space-y-1 text-slate-600 dark:text-zinc-300">
              <p className="font-semibold">{activeQrPass.title}</p>
              <p className="text-slate-400">Window: {activeQrPass.pickupWindow}</p>
            </div>

            <button
              onClick={() => setActiveQrPass(null)}
              className="w-full min-h-[44px] py-2.5 rounded-xl bg-slate-800 dark:bg-white text-white dark:text-black font-bold text-xs sm:text-sm hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
