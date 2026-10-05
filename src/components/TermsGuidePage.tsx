import { 
  ArrowLeft, 
  ShieldCheck, 
  ShoppingBag, 
  Store, 
  Truck, 
  Globe, 
  Coins, 
  CheckCircle,
  FileText,
  Clock
} from 'lucide-react';
import { motion } from 'motion/react';

interface TermsGuidePageProps {
  onNavigate: (page: string) => void;
}

export function TermsGuidePage({ onNavigate }: TermsGuidePageProps) {
  return (
    <div className="w-full text-[#111827] dark:text-zinc-100 font-sans pb-24 transition-colors duration-500">
      {/* Top back navigation bar */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button
          onClick={() => onNavigate('landing')}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-zinc-400 hover:text-[#1A2E3B] dark:hover:text-zinc-100 transition-colors p-2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-700/60 shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>
      </div>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800/80 text-xs font-semibold text-amber-800 dark:text-amber-300 mb-4 shadow-2xs"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Global Version: US · UK · Europe · India</span>
        </motion.div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-[#1A2E3B] dark:text-zinc-100 mb-3 leading-tight tracking-tight">
          Flash Drops — Master Terms & Policy Guide
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 font-mono">
          Last Updated: 30 August 2026
        </p>
      </section>

      {/* Main Content Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Section 1 */}
        <section className="bg-white dark:bg-[#162227] rounded-2xl p-8 sm:p-10 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-zinc-800 pb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 border border-transparent dark:border-amber-800/40">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Section 1</div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1A2E3B] dark:text-zinc-100">
                Consumer & Shopper Terms
              </h2>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 italic">
            Governing transparent food rescue, pre-orders, community events, and rewards.
          </p>

          <div className="space-y-5 text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
            <div>
              <h3 className="font-semibold text-base text-[#1A2E3B] dark:text-zinc-100 mb-1 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Transparent Surplus Drops ("What You See Is What You Get")
              </h3>
              <p>
                Unlike traditional mystery-bag platforms, Flash Drops guarantees that all listed items specify their exact contents, packaging, and ingredients (e.g., specific dietary boxes, bakery assortions). Consumers acknowledge they are purchasing surplus food close to peak freshness.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-base text-[#1A2E3B] dark:text-zinc-100 mb-1 flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                Flash Coins & Share-to-Earn Rewards
              </h3>
              <p>
                Users earn virtual currency ("Flash Coins") through verified eco-sharing actions (e.g., social media impact metrics) or community participation. Flash Coins hold no direct cash value, are non-transferable, and may be redeemed as discounts on future Flash Drops.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-base text-[#1A2E3B] dark:text-zinc-100 mb-1 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                The "Meet-at-Gate" Bounty
              </h3>
              <p>
                Customers who opt into the voluntary ground-floor/gate pickup option to assist delivery partners receive a 15 Flash Coin credit upon successful order completion and verification.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-base text-[#1A2E3B] dark:text-zinc-100 mb-1 flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-500 dark:text-zinc-400" />
                Intermediary Status & Delivery Window Disclaimer
              </h3>
              <p>
                Flash Drops acts as a technology facilitator and booking agent. Rapid delivery timeframes (e.g. 10–20 min) are algorithmically generated operational estimates, not time-guaranteed commitments. We exclude liability for traffic, municipal lockdowns, severe weather, or force majeure events.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-base text-[#1A2E3B] dark:text-zinc-100 mb-1 flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-500 dark:text-rose-400" />
                Rapid Dispatch Cancellation Policy (60–120 Seconds Cutoff)
              </h3>
              <p>
                Due to rapid dispatch architecture, once an order is marked packed or assigned to a delivery partner (typically within 60–120 seconds), orders cannot be cancelled or refunded, especially for perishable surplus goods, hot chef drops, or opened packaging.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section className="bg-white dark:bg-[#162227] rounded-2xl p-8 sm:p-10 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-zinc-800 pb-4">
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 border border-transparent dark:border-amber-800/40">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Section 2</div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1A2E3B] dark:text-zinc-100">
                Restaurant & Merchant Partner Terms
              </h2>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 italic">
            Governing surplus listings, product quality warranties, vendor indemnity, and financial settlements.
          </p>

          <div className="space-y-5 text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
            <div>
              <h3 className="font-semibold text-base text-[#1A2E3B] dark:text-zinc-100 mb-1">Product Quality, Shelf-Life & Cold-Chain Integrity</h3>
              <p>
                Merchant partners warrant that all items have valid minimum shelf-life margins, are stored at statutory temperatures (cold-chain integrity), and comply with local authorities (FSSAI in India; Dubai Municipality / ADAFSA in the UAE).
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-base text-[#1A2E3B] dark:text-zinc-100 mb-1">Strict Vendor Indemnification</h3>
              <p>
                Merchants fully indemnify Flash Drops Technologies against any claims, regulatory penalties, customer illness, injury, or product recalls arising from defective or expired goods.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-base text-[#1A2E3B] dark:text-zinc-100 mb-1">Commission & Payout Settlements (Right of Set-Off)</h3>
              <p>
                Weekly/bi-weekly settlement cycles include automated deduction of commission, gateway fees, and applicable taxes (GST / VAT). Flash Drops reserves the right to set off verified customer refunds or quality penalties against merchant dues.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-base text-[#1A2E3B] dark:text-zinc-100 mb-1">Fair Surplus Commissions</h3>
              <p>
                Flash Drops charges a transparent, baseline commission (ranging from 10% to 15%) on completed surplus takeaway orders. For Flash Tables (Zero-Waste Dine-In), a flat 10% commission is applied strictly to the discounted per-seat food ticket.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-base text-[#1A2E3B] dark:text-zinc-100 mb-1">Zero Platform Fee on On-Premise Upsells</h3>
              <p>
                Flash Drops takes 0% commission on any on-premise add-ons, beverages, alcoholic drinks, or dessert orders placed by diners at a Flash Table. 100% of beverage and additional menu revenue belongs exclusively to the restaurant.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="bg-white dark:bg-[#162227] rounded-2xl p-8 sm:p-10 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-zinc-800 pb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 border border-transparent dark:border-indigo-800/40">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Section 3</div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1A2E3B] dark:text-zinc-100">
                Delivery Fleet & Driver Privacy Architecture
              </h2>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 italic">
            Governing driver number masking, active-order geolocation, and anti-export data protections.
          </p>

          <div className="space-y-5 text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
            <div>
              <h3 className="font-semibold text-base text-[#1A2E3B] dark:text-zinc-100 mb-1">VoIP Virtual Number Masking</h3>
              <p>
                All communications between customers and couriers are routed through temporary masked virtual numbers. Riders and merchants never view customer phone numbers. Virtual routing sessions expire 30 minutes post-delivery.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-base text-[#1A2E3B] dark:text-zinc-100 mb-1">Active-Order Bound Geolocation</h3>
              <p>
                Real-time background location is tracked exclusively while an order is active for dispatch accuracy and rider safety. Background location terminates automatically upon order handover.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-base text-[#1A2E3B] dark:text-zinc-100 mb-1">Strict Anti-Export Marketing Prohibition</h3>
              <p>
                Couriers and partner stores receive order delivery data solely for fulfillment. They are contractually and strictly prohibited from storing, exporting, downloading, or marketing to customer lists.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="bg-white dark:bg-[#162227] rounded-2xl p-8 sm:p-10 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-zinc-800 pb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center flex-shrink-0 border border-transparent dark:border-teal-800/40">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">Section 4</div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1A2E3B] dark:text-zinc-100">
                Geographic Variations & Acceptable Use
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 space-y-2">
              <h3 className="font-bold text-sm text-[#1A2E3B] dark:text-zinc-100">🇮🇳 India Statutory Terms</h3>
              <p className="text-slate-600 dark:text-zinc-400 text-xs">
                FSSAI Central License #10024011000892. Invoices provide full itemized GST breakdown.<br />
                <strong>Grievance Officer:</strong> Mr. Rajeshwar Varma (grievance-officer@flashdrops.app). Redressal SLA within 48 hours under Consumer Protection (E-Commerce) Rules.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 space-y-2">
              <h3 className="font-bold text-sm text-[#1A2E3B] dark:text-zinc-100">🇦🇪 UAE Statutory Terms</h3>
              <p className="text-slate-600 dark:text-zinc-400 text-xs">
                All prices displayed in AED with item cost, 5% VAT, delivery fee, and small cart fee breakdowns. Regulated under UAE Federal Decree-Law No. 46 of 2021 with exclusive jurisdiction under <strong>Dubai Courts</strong>.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-900 dark:text-rose-200 space-y-1">
            <strong>Regional Red Lines & Prohibited Conduct:</strong>
            <p>
              Fraudulent multi-accounting, coupon abuse, frivolous refund claims, and courier abuse result in permanent blacklisting. Unauthorized sale or delivery of regulated goods (tobacco, vape, pharmaceuticals, alcohol) without certified regional licenses and age-gating (18+/21+) is strictly prohibited.
            </p>
          </div>
        </section>

        {/* Footer Note Card */}
        <div className="p-6 rounded-xl bg-slate-100 dark:bg-[#162227] border border-slate-200 dark:border-zinc-800 text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
          <span className="font-bold text-[#1A2E3B] dark:text-zinc-100">Notice: </span>
          This Master Terms & Policy Guide is the global governing document for Flash Drops. Regional addenda apply dynamically based on user IP and store location (India IT Act/FSSAI compliance vs UAE Dubai Courts jurisdiction).
        </div>

        {/* Bottom Nav */}
        <div className="flex flex-wrap justify-center items-center gap-6 pt-6 text-sm text-slate-500 dark:text-zinc-400 font-medium">
          <button onClick={() => onNavigate('landing')} className="hover:text-[#1A2E3B] dark:hover:text-zinc-100 transition-colors cursor-pointer">About Us</button>
          <span>·</span>
          <button onClick={() => onNavigate('privacy-policy')} className="hover:text-[#1A2E3B] dark:hover:text-zinc-100 transition-colors cursor-pointer">Privacy Policy</button>
          <span>·</span>
          <button onClick={() => onNavigate('contact')} className="hover:text-[#1A2E3B] dark:hover:text-zinc-100 transition-colors cursor-pointer">Contact Us</button>
        </div>

      </main>
    </div>
  );
}
