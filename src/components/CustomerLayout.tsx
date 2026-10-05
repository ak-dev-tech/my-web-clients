import { ReactNode, useState, useEffect, useRef } from 'react';
import { 
  Check, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Users, 
  HelpCircle, 
  Mail, 
  Home, 
  Flame, 
  Star, 
  LogIn, 
  LogOut, 
  Ticket,
  TrendingUp,
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
  Trash2,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserAccountModals, type UserReservation } from './UserAccountModals';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { APP_GIT_TAG } from '../config';

interface CustomerLayoutProps {
  children: ReactNode;
  onNavigate?: (page: string) => void;
  currentPage?: string;
}

export function CustomerLayout({ children, onNavigate, currentPage }: CustomerLayoutProps) {
  const { user, signInWithGoogle, logOut, deleteAccount, authError, clearAuthError } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [reservations, setReservations] = useState<UserReservation[]>([]);
  const [activeModal, setActiveModal] = useState<'reservations' | 'impact' | 'preferences' | 'favorites' | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteToastMessage, setDeleteToastMessage] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('flash-drops-theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('flash-drops-theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('flash-drops-theme', 'light');
    }
  }, [isDark]);

  // Click outside to close user dropdown & escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setUserDropdownOpen(false);
      }
    };

    if (userDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [userDropdownOpen]);

  // Listen to user reservations in real-time
  useEffect(() => {
    if (!user) {
      setReservations([]);
      return;
    }

    let unsubscribe: (() => void) | undefined;
    try {
      const q = query(
        collection(db, 'reservations'),
        where('userId', '==', user.uid)
      );
      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const list: UserReservation[] = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<UserReservation, 'id'>)
          }));
          setReservations(list);
        },
        (err) => {
          console.warn('Reservations subscription note:', err.message);
        }
      );
    } catch (err) {
      console.warn('Failed to listen to reservations:', err);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  const handleNavClick = (page: string) => {
    onNavigate?.(page);
    setMobileMenuOpen(false);
  };

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    try {
      // 1. Clean up local browser storage
      try {
        localStorage.removeItem('flash-drops-dietary-prefs');
        localStorage.removeItem('flash-drops-favorite-kitchens');
        localStorage.removeItem('flash-drops-allergen-alerts');
        localStorage.removeItem('flash-drops-price-threshold');
        localStorage.removeItem('flash-drops-user-saved-impact');
        localStorage.removeItem('flash-drops-active-reservations');
      } catch (storageErr) {
        console.warn('Storage cleanup note:', storageErr);
      }

      // 2. Perform Firebase Auth deletion and sign-out
      await deleteAccount();

      // 3. Clear local state
      setReservations([]);
      setIsDeleteModalOpen(false);
      setUserDropdownOpen(false);
      setDeleteToastMessage('Your account and profile data have been permanently deleted.');
      setTimeout(() => {
        setDeleteToastMessage(null);
      }, 6000);

      onNavigate?.('landing');
    } catch (err: any) {
      console.warn('Delete account error:', err?.message || err);
      await logOut();
      setIsDeleteModalOpen(false);
      setUserDropdownOpen(false);
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const getInitials = (name?: string | null, email?: string | null) => {
    if (name && name.trim()) {
      const parts = name.trim().split(/\s+/);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return parts[0].slice(0, 2).toUpperCase();
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return 'FD';
  };

  const activeReservationsCount = reservations.filter(
    (r) => r.status === 'reserved' || !r.status
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F8F6] dark:bg-[#0B0F12] font-sans text-slate-800 dark:text-zinc-100 transition-colors duration-200">
      <header className="bg-white/98 dark:bg-[#142326]/98 border-b border-slate-200 dark:border-white/10 sticky top-0 z-40 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="flex justify-between items-center h-16 sm:h-20">
            
            {/* Logo and Brand Name - whitespace-nowrap prevents awkward wrapping */}
            <button 
              onClick={() => handleNavClick('landing')}
              className="flex items-center gap-2.5 sm:gap-3 group text-left focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-xl p-1.5 transition-transform active:scale-98 min-h-[44px] shrink-0"
              title="Return to Home"
            >
              <img 
                src="/src/assets/images/regenerated_image_1789567683813.png" 
                alt="Flash Drops Logo" 
                width="40"
                height="40"
                decoding="async"
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-md object-contain transition-transform group-hover:scale-105 shrink-0"
                onError={(e) => {
                  e.currentTarget.src = 'https://ui-avatars.com/api/?name=Flash+Drops&background=0A2540&color=fff';
                }}
              />
              <span className="font-bold text-lg sm:text-2xl text-[#1A2E3B] dark:text-zinc-100 tracking-tight font-serif whitespace-nowrap group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                Flash Drops
              </span>
            </button>
            
            {/* Desktop / Tablet Horizontal Navigation Links (hidden on mobile, visible md:flex) */}
            <nav className="hidden md:flex items-center gap-2 lg:gap-5">
              <button
                onClick={() => handleNavClick('landing')}
                className={`min-h-[44px] px-3 py-2 text-sm font-medium transition-colors cursor-pointer rounded-lg inline-flex items-center ${
                  currentPage === 'landing' ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-slate-500 dark:text-slate-300 hover:text-[#1A2E3B] dark:hover:text-white'
                }`}
              >
                Home
              </button>

              <button
                onClick={() => handleNavClick('livedrops')}
                className={`min-h-[44px] px-3 py-2 text-sm font-medium transition-colors cursor-pointer rounded-lg inline-flex items-center ${
                  currentPage === 'livedrops' 
                    ? 'text-amber-600 dark:text-amber-400 font-bold' 
                    : 'text-slate-500 dark:text-slate-300 hover:text-[#1A2E3B] dark:hover:text-white'
                }`}
              >
                Live Drops
              </button>

              <button
                onClick={() => handleNavClick('partners-community')}
                className={`min-h-[44px] px-3 py-2 text-sm font-medium transition-colors cursor-pointer rounded-lg inline-flex items-center ${
                  currentPage === 'partners-community' ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-slate-500 dark:text-slate-300 hover:text-[#1A2E3B] dark:hover:text-white'
                }`}
              >
                Community
              </button>
              <button
                onClick={() => handleNavClick('help-support')}
                className={`min-h-[44px] px-3 py-2 text-sm font-medium transition-colors cursor-pointer rounded-lg inline-flex items-center ${
                  currentPage === 'help-support' ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-slate-500 dark:text-slate-300 hover:text-[#1A2E3B] dark:hover:text-white'
                }`}
              >
                Help & FAQs
              </button>
              <button
                onClick={() => handleNavClick('contact')}
                className={`min-h-[44px] px-3 py-2 text-sm font-medium transition-colors cursor-pointer rounded-lg inline-flex items-center ${
                  currentPage === 'contact' ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-slate-500 dark:text-slate-300 hover:text-[#1A2E3B] dark:hover:text-white'
                }`}
              >
                Contact & Ratings
              </button>
            </nav>

            {/* Action Bar (Theme toggle, profile avatar / sign-in, hamburger) */}
            <div className="flex items-center gap-2.5 sm:gap-3 lg:gap-4">
              
              {/* Sleek Dark Mode Interactive Toggle - Minimum 44x44px Touch Target */}
              <button
                onClick={() => setIsDark((prev) => !prev)}
                className="min-w-[44px] min-h-[44px] p-2.5 sm:px-3 sm:py-2.5 rounded-xl text-slate-600 dark:text-zinc-200 hover:text-[#1A2E3B] dark:hover:text-white bg-slate-100 hover:bg-slate-200/80 dark:bg-white/10 dark:hover:bg-white/15 border border-slate-200/80 dark:border-white/15 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer inline-flex items-center justify-center gap-1.5 active:scale-95 shadow-2xs"
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDark ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
                    <span className="text-xs font-semibold text-zinc-200 hidden lg:inline">Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-slate-600 transition-transform hover:-rotate-12" />
                    <span className="text-xs font-semibold text-slate-600 hidden lg:inline">Dark</span>
                  </>
                )}
              </button>

              {/* User Authentication & Profile Dropdown Area */}
              <div className="relative flex items-center pl-2 sm:pl-3 border-l border-slate-200 dark:border-white/10" ref={dropdownRef}>
                {user ? (
                  <>
                    {/* User profile avatar displaying photo/initials and name */}
                    <button
                      onClick={() => setUserDropdownOpen((prev) => !prev)}
                      className="min-h-[44px] px-2 sm:px-2.5 py-1.5 rounded-full sm:rounded-2xl bg-[#FAF7F2] hover:bg-[#F2ECE1] dark:bg-white/10 dark:hover:bg-white/15 border border-[#E8DFD0] dark:border-white/15 transition-all flex items-center gap-2 sm:gap-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-2xs active:scale-98"
                      aria-expanded={userDropdownOpen}
                      aria-haspopup="true"
                      title={`${user.displayName || user.email} — View Account & Drops`}
                    >
                      {/* Avatar photo or Initials with live drop indicator badge */}
                      <div className="relative shrink-0">
                        {user.photoURL && !avatarError ? (
                          <img
                            src={user.photoURL}
                            alt={user.displayName || 'Profile'}
                            width="32"
                            height="32"
                            loading="lazy"
                            decoding="async"
                            onError={() => setAvatarError(true)}
                            className="w-8 h-8 rounded-full object-cover border border-amber-500/40"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-linear-to-br from-amber-500 to-amber-600 text-zinc-950 font-black text-xs flex items-center justify-center border border-amber-400/50 shadow-xs uppercase tracking-tight">
                            {getInitials(user.displayName, user.email)}
                          </div>
                        )}
                        {activeReservationsCount > 0 ? (
                          <span 
                            className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-[#142326] animate-pulse"
                            title={`${activeReservationsCount} active reservation(s)`}
                          >
                            {activeReservationsCount}
                          </span>
                        ) : (
                          <div 
                            className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#FF5A1F] rounded-full flex items-center justify-center border-2 border-white dark:border-[#142326] pointer-events-none shadow-xs"
                            title="Flash Drops Member"
                          >
                            <Check className="w-2 h-2 text-white" strokeWidth={3} />
                          </div>
                        )}
                      </div>

                      {/* User Name & Subtitle */}
                      <div className="text-left hidden xs:flex sm:flex flex-col">
                        <span className="text-xs font-bold text-slate-800 dark:text-zinc-100 max-w-[85px] sm:max-w-[120px] md:max-w-[150px] truncate leading-tight">
                          {user.displayName || user.email?.split('@')[0] || 'Member'}
                        </span>
                        <span className="text-[10px] text-amber-700 dark:text-amber-400 font-medium leading-none">
                          {activeReservationsCount > 0 ? `${activeReservationsCount} active drop${activeReservationsCount > 1 ? 's' : ''}` : 'Community Saver'}
                        </span>
                      </div>

                      <ChevronDown className={`w-3.5 h-3.5 text-slate-500 dark:text-zinc-400 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180 text-amber-600 dark:text-amber-400' : ''}`} />
                    </button>

                    {/* Dropdown Menu (Matches warm cream / dark mode styling, closes on outside click) */}
                    {userDropdownOpen && (
                      <div className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] max-w-[320px] sm:w-80 rounded-2xl bg-[#FFFDF9] dark:bg-[#142326] border border-[#EBE4D8] dark:border-white/10 shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                        {/* Dropdown User Info Header */}
                        <div className="p-3.5 sm:p-4 border-b border-[#EBE4D8] dark:border-white/10 bg-[#FAF7F2] dark:bg-[#111C1F] flex items-center gap-3">
                          {user.photoURL && !avatarError ? (
                            <img
                              src={user.photoURL}
                              alt={user.displayName || 'Profile'}
                              width="40"
                              height="40"
                              loading="lazy"
                              decoding="async"
                              className="w-10 h-10 rounded-full object-cover border border-amber-500/40 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-linear-to-br from-amber-500 to-amber-600 text-zinc-950 font-black text-sm flex items-center justify-center shrink-0 shadow-xs uppercase">
                              {getInitials(user.displayName, user.email)}
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                                {user.displayName || 'Community Saver'}
                              </p>
                              <span className="shrink-0 px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-400 font-bold text-[10px]">
                                VIP
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>

                        {/* Dropdown Navigation Actions */}
                        <div className="p-2 space-y-1">
                          
                          {/* 1. "My Reservations" (with an active drop badge if any exist) */}
                          <button
                            onClick={() => {
                              setActiveModal('reservations');
                              setUserDropdownOpen(false);
                            }}
                            className="w-full px-3 py-2.5 rounded-xl flex items-center justify-between text-left hover:bg-[#F2ECE1] dark:hover:bg-white/10 transition-colors group cursor-pointer"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-amber-500/15 dark:bg-amber-400/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                <Ticket className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400">
                                  My Reservations
                                </p>
                                <p className="text-[10px] text-slate-500 dark:text-zinc-400 truncate">
                                  Active drop pickup passes
                                </p>
                              </div>
                            </div>
                            {activeReservationsCount > 0 ? (
                              <span className="shrink-0 px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/50 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                {activeReservationsCount} active
                              </span>
                            ) : (
                              <span className="shrink-0 text-[11px] text-slate-400 dark:text-zinc-500 font-medium">0 active</span>
                            )}
                          </button>

                          {/* 2. "Impact & Savings" (meals rescued, money saved) */}
                          <button
                            onClick={() => {
                              setActiveModal('impact');
                              setUserDropdownOpen(false);
                            }}
                            className="w-full px-3 py-2.5 rounded-xl flex items-center justify-between text-left hover:bg-[#F2ECE1] dark:hover:bg-white/10 transition-colors group cursor-pointer"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 dark:bg-emerald-400/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                <TrendingUp className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                                  Impact & Savings
                                </p>
                                <p className="text-[10px] text-slate-500 dark:text-zinc-400 truncate">
                                  Meals rescued & money saved
                                </p>
                              </div>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
                          </button>

                          {/* 3. "Dietary & Allergen Preferences" */}
                          <button
                            onClick={() => {
                              setActiveModal('preferences');
                              setUserDropdownOpen(false);
                            }}
                            className="w-full px-3 py-2.5 rounded-xl flex items-center justify-between text-left hover:bg-[#F2ECE1] dark:hover:bg-white/10 transition-colors group cursor-pointer"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-indigo-500/15 dark:bg-indigo-400/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                <SlidersHorizontal className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                  Dietary & Allergen Preferences
                                </p>
                                <p className="text-[10px] text-slate-500 dark:text-zinc-400 truncate">
                                  Veg, allergens & alerts
                                </p>
                              </div>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
                          </button>

                          {/* 4. "Favorite Kitchens" */}
                          <button
                            onClick={() => {
                              setActiveModal('favorites');
                              setUserDropdownOpen(false);
                            }}
                            className="w-full px-3 py-2.5 rounded-xl flex items-center justify-between text-left hover:bg-[#F2ECE1] dark:hover:bg-white/10 transition-colors group cursor-pointer"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-rose-500/15 dark:bg-rose-400/15 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                <Star className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-zinc-100 group-hover:text-rose-600 dark:group-hover:text-rose-400">
                                  Favorite Kitchens
                                </p>
                                <p className="text-[10px] text-slate-500 dark:text-zinc-400 truncate">
                                  Starred bakeries & bistros
                                </p>
                              </div>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
                          </button>

                          {/* Divider */}
                          <div className="my-1 border-t border-[#EBE4D8] dark:border-white/10" />

                          {/* 5. "Delete Account" */}
                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              setIsDeleteModalOpen(true);
                            }}
                            className="w-full px-3 py-2.5 rounded-xl flex items-center justify-between text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer group"
                            title="Permanently Delete Account"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-red-500/15 dark:bg-red-400/15 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0 group-hover:scale-105 transition-transform">
                                <Trash2 className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs sm:text-sm font-bold">Delete Account</p>
                                <p className="text-[10px] text-red-500/80 dark:text-red-400/80 truncate">
                                  Permanently wipe profile & data
                                </p>
                              </div>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-red-400 dark:text-red-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
                          </button>

                          {/* 6. Option Below Delete Account: "Help & Support Concierge" */}
                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              handleNavClick('help-support');
                            }}
                            className="w-full px-3 py-2.5 rounded-xl flex items-center justify-between text-left hover:bg-[#F2ECE1] dark:hover:bg-white/10 transition-colors group cursor-pointer"
                            title="Help & Customer Concierge"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-amber-500/15 dark:bg-amber-400/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                <HelpCircle className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400">
                                  Help & Support Concierge
                                </p>
                                <p className="text-[10px] text-slate-500 dark:text-zinc-400 truncate">
                                  FAQs, live assistance & guide
                                </p>
                              </div>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
                          </button>

                          {/* 7. "Log Out" (calls Firebase auth sign-out) */}
                          <button
                            onClick={async () => {
                              setUserDropdownOpen(false);
                              await logOut();
                            }}
                            className="w-full px-3 py-2 rounded-xl flex items-center gap-2.5 text-left text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer group"
                            title="Sign Out"
                          >
                            <div className="w-8 h-8 rounded-lg bg-slate-500/10 dark:bg-slate-400/10 flex items-center justify-center text-slate-500 dark:text-zinc-400 shrink-0 group-hover:scale-105 transition-transform">
                              <LogOut className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-zinc-300">Log Out</p>
                              <p className="text-[10px] text-slate-400 dark:text-zinc-500 truncate">
                                Sign out of session
                              </p>
                            </div>
                          </button>

                          {/* App Version Tag */}
                          <div className="pt-2 mt-1 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between px-2 text-[10px] text-slate-400 dark:text-zinc-500 font-mono">
                            <span>Release</span>
                            <span className="inline-flex items-center gap-1 font-semibold text-slate-500 dark:text-zinc-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              {APP_GIT_TAG}
                            </span>
                          </div>

                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <button
                    onClick={signInWithGoogle}
                    className="min-h-[44px] px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-zinc-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                    title="Sign In with Google"
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="hidden sm:inline">Sign In</span>
                  </button>
                )}
              </div>

              {/* Mobile Hamburger Menu Button (visible on mobile, hidden on md:) */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden min-w-[44px] min-h-[44px] p-2.5 rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-white/10 text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-white/15 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-[#1A2E3B] dark:text-zinc-100" /> : <Menu className="w-5 h-5 text-[#1A2E3B] dark:text-zinc-100" />}
              </button>
            </div>

          </div>
        </div>

        {/* Collapsible Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-white/10 bg-white/98 dark:bg-[#142326]/98 px-4 py-4 space-y-2 shadow-md animate-in slide-in-from-top-2 duration-200">
            <button
              onClick={() => handleNavClick('landing')}
              className={`w-full min-h-[44px] px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-semibold transition-colors text-left ${
                currentPage === 'landing' ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-transparent dark:border-amber-800/40' : 'text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-white/10'
              }`}
            >
              <Home className="w-4 h-4 text-slate-500 dark:text-zinc-400" />
              <span>Home</span>
            </button>

            <button
              onClick={() => handleNavClick('livedrops')}
              className={`w-full min-h-[44px] px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-semibold transition-colors text-left ${
                currentPage === 'livedrops' 
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-transparent dark:border-amber-800/40' 
                  : 'text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-white/10'
              }`}
            >
              <Flame className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              <span>Live Drops</span>
            </button>

            <button
              onClick={() => handleNavClick('partners-community')}
              className={`w-full min-h-[44px] px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-semibold transition-colors text-left ${
                currentPage === 'partners-community' ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-transparent dark:border-amber-800/40' : 'text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-white/10'
              }`}
            >
              <Users className="w-4 h-4 text-slate-500 dark:text-zinc-400" />
              <span>Community & Events</span>
            </button>

            <button
              onClick={() => handleNavClick('help-support')}
              className={`w-full min-h-[44px] px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-semibold transition-colors text-left ${
                currentPage === 'help-support' ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-transparent dark:border-amber-800/40' : 'text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-white/10'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-slate-500 dark:text-zinc-400" />
              <span>Help & FAQs</span>
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className={`w-full min-h-[44px] px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-semibold transition-colors text-left ${
                currentPage === 'contact' ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-transparent dark:border-amber-800/40' : 'text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-white/10'
              }`}
            >
              <Mail className="w-4 h-4 text-slate-500 dark:text-zinc-400" />
              <span>Contact & Ratings</span>
            </button>

            <div className="pt-2 border-t border-slate-200 dark:border-white/10">
              {user ? (
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3">
                  <div className="flex items-center gap-3">
                    {user.photoURL && !avatarError ? (
                      <img 
                        src={user.photoURL} 
                        alt={user.displayName || 'User Profile'} 
                        width="40"
                        height="40"
                        loading="lazy"
                        decoding="async"
                        className="w-10 h-10 rounded-full object-cover border border-amber-500/50"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-amber-500 to-amber-600 text-zinc-950 font-black text-sm flex items-center justify-center border border-amber-400/50">
                        {getInitials(user.displayName, user.email)}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-xs sm:text-sm text-slate-800 dark:text-zinc-100 truncate">
                        {user.displayName || 'Member'}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* Mobile Quick Links for Dropdown Options */}
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/80 dark:border-white/10">
                    <button
                      onClick={() => {
                        setActiveModal('reservations');
                        setMobileMenuOpen(false);
                      }}
                      className="px-2.5 py-2 rounded-xl bg-white dark:bg-white/10 border border-slate-200/70 dark:border-white/10 text-xs font-semibold text-left flex items-center justify-between cursor-pointer"
                    >
                      <span className="truncate">My Reservations</span>
                      {activeReservationsCount > 0 && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setActiveModal('impact');
                        setMobileMenuOpen(false);
                      }}
                      className="px-2.5 py-2 rounded-xl bg-white dark:bg-white/10 border border-slate-200/70 dark:border-white/10 text-xs font-semibold text-left cursor-pointer truncate"
                    >
                      Impact & Savings
                    </button>

                    <button
                      onClick={() => {
                        setActiveModal('preferences');
                        setMobileMenuOpen(false);
                      }}
                      className="px-2.5 py-2 rounded-xl bg-white dark:bg-white/10 border border-slate-200/70 dark:border-white/10 text-xs font-semibold text-left cursor-pointer truncate"
                    >
                      Dietary Preferences
                    </button>

                    <button
                      onClick={() => {
                        setActiveModal('favorites');
                        setMobileMenuOpen(false);
                      }}
                      className="px-2.5 py-2 rounded-xl bg-white dark:bg-white/10 border border-slate-200/70 dark:border-white/10 text-xs font-semibold text-left cursor-pointer truncate"
                    >
                      Favorite Kitchens
                    </button>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setIsDeleteModalOpen(true);
                      }}
                      className="w-full py-2 px-3 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Account</span>
                    </button>

                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleNavClick('help-support');
                      }}
                      className="w-full py-2 px-3 rounded-xl text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Help & Support Concierge</span>
                    </button>

                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logOut();
                      }}
                      className="w-full py-2 px-3 rounded-xl text-xs font-medium text-slate-600 dark:text-zinc-300 bg-slate-100 dark:bg-white/10 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>

                    <div className="pt-2 text-center text-[10px] text-slate-400 dark:text-zinc-500 font-mono flex items-center justify-center gap-1">
                      <span>Flash Drops</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>{APP_GIT_TAG}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={signInWithGoogle}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In with Google</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {authError && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-900 dark:text-amber-200 px-4 py-2.5 text-xs sm:text-sm flex items-center justify-between z-40">
          <div className="flex items-center gap-2 max-w-5xl mx-auto w-full">
            <span className="font-semibold text-amber-600 dark:text-amber-400">Notice:</span>
            <span>{authError}</span>
          </div>
          <button
            onClick={clearAuthError}
            className="p-1 hover:bg-amber-500/20 rounded-md transition-colors cursor-pointer text-amber-900 dark:text-amber-200"
            aria-label="Dismiss notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <main className="flex-1 flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {children}
      </main>

      {/* User Dropdown Modals: Reservations, Impact, Dietary Preferences, Favorite Kitchens */}
      <UserAccountModals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        user={user}
        reservations={reservations}
        onNavigate={handleNavClick}
      />

      {/* Delete Account Confirmation Modal */}
      {isDeleteModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-account-title"
          onClick={() => !isDeletingAccount && setIsDeleteModalOpen(false)}
        >
          <div 
            className="w-full max-w-md rounded-2xl bg-[#FFFDF9] dark:bg-[#142326] border border-red-200 dark:border-red-900/40 shadow-2xl p-5 sm:p-6 space-y-5 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with red warning badge */}
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 border border-red-200 dark:border-red-800/40">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 id="delete-account-title" className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-serif">
                  Delete Flash Drops Account
                </h3>
                <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                  This action is permanent and irreversible
                </p>
              </div>
              <button
                disabled={isDeletingAccount}
                onClick={() => setIsDeleteModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors disabled:opacity-50 cursor-pointer"
                aria-label="Cancel and close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Warning details */}
            <div className="p-3.5 rounded-xl bg-red-50/70 dark:bg-red-950/20 border border-red-200/80 dark:border-red-900/30 text-xs text-slate-700 dark:text-zinc-300 space-y-2">
              <p className="font-semibold text-red-800 dark:text-red-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
                The following data will be erased:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-zinc-400">
                <li>All active drop reservations and QR pickup codes</li>
                <li>Saved dietary & allergy alert preferences</li>
                <li>Starred favorite kitchens and impact history</li>
                <li>Your linked Google / Firebase member credentials</li>
              </ul>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col-reverse sm:flex-row items-center gap-2.5 pt-2">
              <button
                type="button"
                disabled={isDeletingAccount}
                onClick={() => setIsDeleteModalOpen(false)}
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-white/10 text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-white/15 font-semibold text-xs sm:text-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                Keep Account
              </button>
              <button
                type="button"
                disabled={isDeletingAccount}
                onClick={handleDeleteAccount}
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isDeletingAccount ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Permanently</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Toast */}
      {deleteToastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md p-4 rounded-2xl bg-slate-900 text-white shadow-xl flex items-center gap-3 border border-white/10 animate-in slide-in-from-bottom-3 duration-200">
          <Check className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-xs sm:text-sm">{deleteToastMessage}</p>
          <button
            onClick={() => setDeleteToastMessage(null)}
            className="p-1 rounded text-zinc-400 hover:text-white"
            aria-label="Dismiss toast"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

