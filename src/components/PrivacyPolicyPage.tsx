import { useState } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Lock, 
  Database, 
  UserX, 
  FileText,
  Mail,
  Phone,
  AlertTriangle,
  CheckCircle2,
  Globe,
  Clock,
  Scale,
  Building2,
  Store,
  Truck,
  MapPin,
  Check,
  ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';

interface PrivacyPolicyPageProps {
  onNavigate: (page: string) => void;
}

type TabKey = 'all' | 'terms' | 'merchant' | 'privacy' | 'acceptable' | 'geographic' | 'checklist';
type RegionKey = 'all' | 'india' | 'uae';

export function PrivacyPolicyPage({ onNavigate }: PrivacyPolicyPageProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [selectedRegion, setSelectedRegion] = useState<RegionKey>('all');

  return (
    <div className="w-full text-[#111827] dark:text-zinc-100 font-sans pb-24 transition-colors duration-500">
      {/* Top back navigation bar */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button
          onClick={() => onNavigate('landing')}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-zinc-400 hover:text-[#1A2E3B] dark:hover:text-zinc-100 transition-colors p-2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-700/60 shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Hero Header */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800/80 text-xs font-semibold text-amber-800 dark:text-amber-300 mb-4 shadow-2xs"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Legal, Trust & Compliance Documentation</span>
        </motion.div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-[#1A2E3B] dark:text-zinc-100 mb-3 tracking-tight">
          Privacy Policy & Terms of Service
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed">
          Comprehensive Master Agreement covering End-User Terms, Merchant Partner Commitments, Driver Number Masking, Geolocation Safeguards, and Regional Compliance (India & UAE).
        </p>
        <div className="mt-3 flex items-center justify-center gap-4 text-xs text-slate-500 dark:text-zinc-400 font-mono">
          <span>Version 3.4</span>
          <span>•</span>
          <span>Last Updated: September 2026</span>
          <span>•</span>
          <span>Effective: Immediate</span>
        </div>
      </section>

      {/* Interactive Filter Bar & Region Switcher */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 space-y-4">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[
            { id: 'all', label: 'All Provisions' },
            { id: 'terms', label: 'A. End-User Terms' },
            { id: 'merchant', label: 'B. Merchant Agreement' },
            { id: 'privacy', label: 'C. Privacy & Data' },
            { id: 'acceptable', label: 'D. Acceptable Use' },
            { id: 'geographic', label: 'Geographic Variations' },
            { id: 'checklist', label: 'Launch Checklist' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabKey)}
              className={`min-h-[44px] px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer inline-flex items-center justify-center ${
                activeTab === tab.id
                  ? 'bg-[#1A2E3B] dark:bg-amber-400 text-white dark:text-zinc-950 shadow-xs'
                  : 'bg-white dark:bg-[#162227] text-slate-600 dark:text-zinc-300 border border-slate-200/80 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-zinc-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Region Toggle Pill */}
        <div className="flex items-center justify-center gap-2 pt-1 text-xs">
          <span className="text-slate-500 dark:text-zinc-400 font-medium">Jurisdiction Addenda:</span>
          <div className="inline-flex rounded-lg bg-slate-200/80 dark:bg-zinc-800 p-0.5 border border-slate-300/80 dark:border-zinc-700">
            <button
              onClick={() => setSelectedRegion('all')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                selectedRegion === 'all'
                  ? 'bg-white dark:bg-[#162227] text-[#1A2E3B] dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Global (All)
            </button>
            <button
              onClick={() => setSelectedRegion('india')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                selectedRegion === 'india'
                  ? 'bg-white dark:bg-[#162227] text-[#1A2E3B] dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>🇮🇳 India Addendum</span>
            </button>
            <button
              onClick={() => setSelectedRegion('uae')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                selectedRegion === 'uae'
                  ? 'bg-white dark:bg-[#162227] text-[#1A2E3B] dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>🇦🇪 UAE Addendum</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Executive Summary Card */}
        <div className="bg-white dark:bg-[#162227] rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-sm leading-relaxed text-slate-700 dark:text-zinc-300">
          <div className="flex items-start gap-3">
            <Scale className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-lg font-serif font-bold text-[#1A2E3B] dark:text-zinc-100 mb-1">
                Binding Legal Framework & Privacy Accord
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-zinc-300">
                This document constitutes a binding agreement between you (the "User", "Merchant Partner", or "Delivery Partner") and Flash Drops Technologies. It governs all orders, real-time inventory listings, automated dispatch routing, location tracking, and telecommunication masking across our web and mobile applications.
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION A: TERMS OF SERVICE (END USERS)                                   */}
        {/* ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'terms') && (
          <section id="section-a" className="bg-white dark:bg-[#162227] rounded-2xl p-6 sm:p-10 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6 content-visibility-auto">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-zinc-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 border border-amber-200 dark:border-amber-800/40">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 font-mono">Part A</span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1A2E3B] dark:text-zinc-100">
                  Flash Drops Terms of Service (End Users)
                </h2>
              </div>
            </div>

            <div className="space-y-6 text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
              {/* 1. Intermediary Status */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#142326]/60 border border-slate-200/80 dark:border-zinc-800 space-y-2">
                <h3 className="font-bold text-sm text-[#1A2E3B] dark:text-zinc-100 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  1. Intermediary Status & Platform Technology Facilitator
                </h3>
                <p>
                  Flash Drops functions strictly as a <strong>technology facilitator, digital marketplace, and booking agent</strong> connecting end users with independent artisanal bakeries, bistros, third-party merchants, and fulfillment centers.
                </p>
                <p className="text-slate-500 dark:text-zinc-400 text-xs">
                  • <em>Marketplace Model:</em> Flash Drops does not prepare, handle, cook, or hold title to food items. Merchant partners are independent third-party vendors solely responsible for food preparation, ingredient sourcing, health compliance, packaging, and allergen disclosures.<br />
                  • <em>Micro-Fulfillment/Dark Store Exception:</em> Where Flash Drops explicitly operates a licensed, inventory-led dark store directly, Flash Drops provides a limited direct-seller warranty covering packaging integrity and cold-chain custody until dispatch.
                </p>
              </div>

              {/* 2. Delivery Window Disclaimer */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#142326]/60 border border-slate-200/80 dark:border-zinc-800 space-y-2">
                <h3 className="font-bold text-sm text-[#1A2E3B] dark:text-zinc-100 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  2. Delivery Window Disclaimer (Estimated, Not Guaranteed)
                </h3>
                <p>
                  All rapid delivery windows displayed across the platform (such as "10–20 minute delivery", "Flash Route", or countdown timers) are <strong>strictly operational estimates based on algorithmically calculated transit factors, and do NOT constitute a legally binding, time-guaranteed commitment</strong>.
                </p>
                <div className="text-xs bg-amber-50/70 dark:bg-amber-950/30 p-3 rounded-lg border border-amber-200/60 dark:border-amber-800/40 text-amber-900 dark:text-amber-200">
                  <strong>Force Majeure & Traffic Exclusion:</strong> Flash Drops and our independent delivery fleet expressly exclude all financial liability for delivery delays caused by traffic congestion, municipal road closures, severe weather disruptions, electrical outages, cellular network failures, courier vehicle mechanical incidents, or force majeure events.
                </div>
              </div>

              {/* 3. Cancellations & Returns */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#142326]/60 border border-slate-200/80 dark:border-zinc-800 space-y-2">
                <h3 className="font-bold text-sm text-[#1A2E3B] dark:text-zinc-100 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-500 dark:text-rose-400" />
                  3. Rapid Dispatch Cancellation & Return Window (Perishables)
                </h3>
                <p>
                  Due to our hyper-local instant fulfillment architecture, orders are algorithmically routed, packed, and assigned to a delivery courier within <strong>60 to 120 seconds</strong> of placement.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-slate-500 dark:text-zinc-400">
                  <li><strong>Non-Cancellable Policy:</strong> Once an order is marked as "Packed" or "Courier Assigned" (within 60–120 seconds), orders <em>cannot be cancelled, refunded, or modified</em>.</li>
                  <li><strong>Perishable Food & Hygiene Products:</strong> In accordance with statutory consumer health regulations, fresh food, hot meals, artisanal pastries, and opened packaging are strictly non-returnable.</li>
                  <li><strong>Missed Handover:</strong> If the customer cannot be reached at the delivery address after 7 minutes of courier arrival, the order will be forfeited with no refund due to temperature-controlled food safety guidelines.</li>
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* SECTION B: MERCHANT & PARTNER AGREEMENT                                   */}
        {/* ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'merchant') && (
          <section id="section-b" className="bg-white dark:bg-[#162227] rounded-2xl p-6 sm:p-10 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6 content-visibility-auto">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-zinc-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 border border-amber-200 dark:border-amber-800/40">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 font-mono">Part B</span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1A2E3B] dark:text-zinc-100">
                  Flash Drops Merchant & Partner Agreement
                </h2>
              </div>
            </div>

            <div className="space-y-6 text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
              {/* 1. Product Quality & Expiry */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#142326]/60 border border-slate-200/80 dark:border-zinc-800 space-y-2">
                <h3 className="font-bold text-sm text-[#1A2E3B] dark:text-zinc-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  1. Product Quality, Shelf-Life Margins & Cold-Chain Integrity
                </h3>
                <p>
                  Every merchant partner, culinary kitchen, and food supplier listing items on Flash Drops explicitly warrants and guarantees that:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-slate-500 dark:text-zinc-400">
                  <li><strong>Shelf-Life Standards:</strong> All packaged groceries, prepared meals, and surplus items possess a valid minimum shelf-life buffer and are never sold past their official "Use-By" or expiration date.</li>
                  <li><strong>Temperature & Cold-Chain:</strong> Chilled, dairy, meat, and frozen products are stored continuously at statutory temperatures (below 4°C for refrigeration, below -18°C for frozen) until courier handover.</li>
                  <li><strong>Food Safety Compliance:</strong> All kitchens comply with local municipal health protocols, holding active certifications from the <strong>Food Safety and Standards Authority of India (FSSAI)</strong> in India, and the <strong>Dubai Municipality Food Safety Department / ADAFSA</strong> in the UAE.</li>
                </ul>
              </div>

              {/* 2. Indemnification */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#142326]/60 border border-slate-200/80 dark:border-zinc-800 space-y-2">
                <h3 className="font-bold text-sm text-[#1A2E3B] dark:text-zinc-100 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  2. Comprehensive Merchant Indemnification (Strict Vendor Liability)
                </h3>
                <p>
                  In accordance with leading global marketplace standards, the merchant partner agrees to <strong>fully defend, indemnify, and hold harmless</strong> Flash Drops Technologies, its officers, employees, and delivery agents against any and all:
                </p>
                <p className="text-xs bg-indigo-50/70 dark:bg-indigo-950/30 p-3 rounded-lg border border-indigo-200/60 dark:border-indigo-800/40 text-indigo-950 dark:text-indigo-200">
                  <em>"Third-party claims, customer illness, allergic reactions, food poisoning, personal injury, statutory penalties, municipal fines, consumer forum awards, or regulatory product recalls arising from substandard, unhygienic, mislabeled, defective, or expired food and beverage products provided by the merchant."</em>
                </p>
              </div>

              {/* 3. Commission & Payout Settlements */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#142326]/60 border border-slate-200/80 dark:border-zinc-800 space-y-2">
                <h3 className="font-bold text-sm text-[#1A2E3B] dark:text-zinc-100 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  3. Commission Schedules, Tax Deductions & Right of Set-Off
                </h3>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-500 dark:text-zinc-400">
                  <li><strong>Settlement Frequency:</strong> Partner payouts are settled on a scheduled cycle (weekly or bi-weekly) directly into the merchant's registered corporate bank account.</li>
                  <li><strong>Automated Deductions:</strong> Flash Drops automatically deducts the agreed platform commission (10–15%), payment gateway transaction fees (typically 1.8%–2.5%), and statutory taxes (TDS/TCS under GST in India, or VAT in the UAE).</li>
                  <li><strong>Right to Set-Off:</strong> Flash Drops reserves the express contractual right to offset verified customer refunds, spoiled item clawbacks, quality defect penalties, or unfulfilled order charges directly against the merchant's pending settlement balance.</li>
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* SECTION C: PRIVACY POLICY & DATA USAGE                                    */}
        {/* ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'privacy') && (
          <section id="section-c" className="bg-white dark:bg-[#162227] rounded-2xl p-6 sm:p-10 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6 content-visibility-auto">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-zinc-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 border border-emerald-200 dark:border-emerald-800/40">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono">Part C</span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1A2E3B] dark:text-zinc-100">
                  Flash Drops Privacy Policy & Telecommunications Safeguards
                </h2>
              </div>
            </div>

            <div className="space-y-6 text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
              {/* 1. Driver & Masking Architecture */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#142326]/60 border border-slate-200/80 dark:border-zinc-800 space-y-2">
                <h3 className="font-bold text-sm text-[#1A2E3B] dark:text-zinc-100 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  1. Driver & Merchant Number Masking Architecture (VoIP Virtual Routing)
                </h3>
                <p>
                  To uphold stringent privacy and prevent unsolicited contact or harassment, Flash Drops deploys <strong>bidirectional telephone number masking via secure VoIP virtual relays</strong>:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-slate-500 dark:text-zinc-400">
                  <li><strong>Zero Phone Exposure:</strong> Delivery couriers, restaurant dispatchers, and merchant personnel never view, receive, or store your actual personal telephone number.</li>
                  <li><strong>Temporary Virtual Session:</strong> Calls and in-app communications are bridged through a temporary virtual routing number that automatically expires 30 minutes after delivery completion.</li>
                  <li><strong>Recording & Auditing:</strong> Masked communications may be recorded and stored for 14 days solely for dispatch resolution and driver safety disputes.</li>
                </ul>
              </div>

              {/* 2. Precise Geolocation */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#142326]/60 border border-slate-200/80 dark:border-zinc-800 space-y-2">
                <h3 className="font-bold text-sm text-[#1A2E3B] dark:text-zinc-100 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  2. Precise Background Geolocation Tracking (Active Order Bound Only)
                </h3>
                <p>
                  Flash Drops collects precise device GPS coordinates <strong>exclusively while an order is actively in progress</strong> (from order confirmation through live courier dispatch to successful delivery handover).
                </p>
                <div className="text-xs bg-emerald-50/70 dark:bg-emerald-950/30 p-3 rounded-lg border border-emerald-200/60 dark:border-emerald-800/40 text-emerald-950 dark:text-emerald-200">
                  <strong>Strict Boundaries:</strong> Geolocation data is used solely to calculate optimal drop routes, verify arrival at the drop location, and ensure courier safety. Background location polling terminates automatically upon order fulfillment. Flash Drops does not sell, broker, or monetize your location history.
                </div>
              </div>

              {/* 3. Data Retention & Sharing */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#142326]/60 border border-slate-200/80 dark:border-zinc-800 space-y-2">
                <h3 className="font-bold text-sm text-[#1A2E3B] dark:text-zinc-100 flex items-center gap-2">
                  <Database className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  3. Restricted Data Sharing & Strict Anti-Export Marketing Prohibition
                </h3>
                <p>
                  Customer delivery data (drop address, customer first name, delivery instructions) is transmitted to third-party stores and couriers <strong>strictly for instantaneous order fulfillment</strong>.
                </p>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  All merchant partners and delivery fleet operators are legally bound by contract: they are <em>strictly prohibited from storing, downloading, exporting, sharing, or marketing to customer lists</em>. Any unauthorized marketing or customer contact constitutes a material breach resulting in immediate platform termination and statutory damages under relevant privacy laws.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* SECTION D: CONTENT & ACCEPTABLE USE POLICY                                */}
        {/* ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'acceptable') && (
          <section id="section-d" className="bg-white dark:bg-[#162227] rounded-2xl p-6 sm:p-10 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6 content-visibility-auto">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-zinc-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 border border-purple-200 dark:border-purple-800/40">
                <UserX className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 font-mono">Part D</span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1A2E3B] dark:text-zinc-100">
                  Content & Acceptable Use Policy
                </h2>
              </div>
            </div>

            <div className="space-y-6 text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#142326]/60 border border-slate-200/80 dark:border-zinc-800 space-y-2">
                <h3 className="font-bold text-sm text-[#1A2E3B] dark:text-zinc-100">
                  Zero-Tolerance User Prohibitions
                </h3>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-500 dark:text-zinc-400">
                  <li><strong>Fraudulent Accounts & Multi-Accounting:</strong> Creating duplicate accounts to circumvent promo code restrictions, harvest introductory discounts, or game referral credits is strictly prohibited and results in immediate permanent blacklisting.</li>
                  <li><strong>Abuse of Refund Protocols:</strong> Submitting false claims regarding missing items, fabricating food quality disputes, or systematically charging back delivered orders constitutes digital fraud subject to account suspension and civil recovery.</li>
                  <li><strong>Courier Fleet Safety:</strong> Verbal abuse, physical aggression, discriminatory remarks, or reckless endangerment toward delivery riders will lead to immediate police reporting and irreversible platform expulsion.</li>
                </ul>
              </div>

              {/* Regional Red Lines & Regulated Goods */}
              <div className="p-4 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/60 space-y-2">
                <h3 className="font-bold text-sm text-rose-900 dark:text-rose-200 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  Regional Red Lines: Regulated & Age-Gated Goods
                </h3>
                <p className="text-xs text-rose-800 dark:text-rose-300">
                  Flash Drops maintains strict zero-tolerance prohibitions against the unauthorized sale, distribution, or courier transit of regulated substances without explicit, verified regional trade licenses:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-white/80 dark:bg-black/40 border border-rose-200 dark:border-rose-900/40 text-slate-700 dark:text-zinc-300">
                    <strong>Tobacco, E-Cigarettes & Vapes:</strong> Strictly prohibited in jurisdictions lacking certified digital age-verification and specific retail permits. Mandatory biometric or photo ID age-check (18+/21+) required upon physical handover where legally permitted.
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/80 dark:bg-black/40 border border-rose-200 dark:border-rose-900/40 text-slate-700 dark:text-zinc-300">
                    <strong>Alcohol & Controlled Pharmaceuticals:</strong> Prescription medicines and alcohol may never be sold or dispatched without active statutory excise permits, licensed merchant credentials, and mandatory recipient signature verification.
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* SECTION E: GEOGRAPHIC VARIATIONS (INDIA & UAE)                            */}
        {/* ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'geographic') && (
          <section id="section-e" className="bg-white dark:bg-[#162227] rounded-2xl p-6 sm:p-10 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6 content-visibility-auto">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-zinc-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center flex-shrink-0 border border-teal-200 dark:border-teal-800/40">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 font-mono">Geographic Variations</span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1A2E3B] dark:text-zinc-100">
                  Regional Addenda & Statutory Jurisdictions
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
              {/* India Addendum */}
              {(selectedRegion === 'all' || selectedRegion === 'india') && (
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#162227]/80 border border-slate-200 dark:border-zinc-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base text-[#1A2E3B] dark:text-zinc-100 flex items-center gap-2">
                      <span>🇮🇳 India Addendum</span>
                    </h3>
                    <span className="text-[10px] font-mono uppercase bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full font-bold">
                      IT Act & Consumer Protection
                    </span>
                  </div>

                  <p className="text-slate-600 dark:text-zinc-300 text-xs">
                    Governed under the <strong>Information Technology Act, 2000</strong>, the <strong>Consumer Protection (E-Commerce) Rules, 2020</strong>, and the <strong>Food Safety and Standards Act, 2006</strong>.
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-zinc-800 text-xs text-slate-600 dark:text-zinc-300">
                    <div>
                      <strong>FSSAI License Display:</strong> Central License No. <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">#10024011000892</span>. All partner restaurants must display their 14-digit FSSAI number on their digital menu cards.
                    </div>
                    <div>
                      <strong>GST Statutory Invoicing:</strong> Invoices itemize Item Price + CGST/SGST/IGST + Restaurant Packaging Fee + Delivery Convenience Fee.
                    </div>
                    <div className="p-3 bg-white dark:bg-black/40 rounded-xl border border-slate-200 dark:border-zinc-800 space-y-1">
                      <div className="font-bold text-slate-800 dark:text-zinc-200 text-xs">Mandatory Grievance Redressal Officer:</div>
                      <div className="text-[11px] text-slate-500 dark:text-zinc-400 leading-tight">
                        <strong>Name:</strong> Mr. Rajeshwar Varma<br />
                        <strong>Designation:</strong> Chief Grievance & Compliance Officer<br />
                        <strong>Email:</strong> grievance-officer@flashdrops.app<br />
                        <strong>Redressal SLA:</strong> Grievances acknowledged within 48 hours; resolved within 1 month.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* UAE Addendum */}
              {(selectedRegion === 'all' || selectedRegion === 'uae') && (
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#162227]/80 border border-slate-200 dark:border-zinc-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base text-[#1A2E3B] dark:text-zinc-100 flex items-center gap-2">
                      <span>🇦🇪 UAE Addendum</span>
                    </h3>
                    <span className="text-[10px] font-mono uppercase bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full font-bold">
                      Dubai Courts & UAE Law
                    </span>
                  </div>

                  <p className="text-slate-600 dark:text-zinc-300 text-xs">
                    Governed in accordance with the <strong>Federal Decree-Law No. 46 of 2021 on Electronic Transactions and Trust Services</strong> and <strong>Federal Law No. 15 of 2020 on Consumer Protection</strong>.
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-zinc-800 text-xs text-slate-600 dark:text-zinc-300">
                    <div>
                      <strong>AED Pricing Transparency:</strong> All items displayed to users in the UAE are priced strictly in UAE Dirhams (AED) with an explicit breakdown of:
                      <ul className="list-disc pl-4 mt-1 text-[11px] text-slate-500 dark:text-zinc-400">
                        <li>Item Base Cost</li>
                        <li>5% UAE Value Added Tax (VAT)</li>
                        <li>Distance-based Courier Delivery Fee</li>
                        <li>Small Cart Surcharge (applicable for orders under AED 30)</li>
                      </ul>
                    </div>
                    <div>
                      <strong>Food Safety Standards:</strong> Food suppliers must hold verified accreditation with the <strong>Dubai Municipality Food Safety Department</strong> or <strong>Abu Dhabi Agriculture and Food Safety Authority (ADAFSA)</strong>.
                    </div>
                    <div className="p-3 bg-white dark:bg-black/40 rounded-xl border border-slate-200 dark:border-zinc-800 text-[11px] text-slate-500 dark:text-zinc-400">
                      <strong>Exclusive Jurisdiction:</strong> Any dispute, controversy, or claim arising out of or in connection with operations in the UAE shall be subject to the exclusive jurisdiction of the <strong>Courts of the Emirate of Dubai</strong>.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* SECTION F: IMPLEMENTATION CHECKLIST FOR LAUNCH                             */}
        {/* ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'checklist') && (
          <section id="section-f" className="bg-white dark:bg-[#162227] rounded-2xl p-6 sm:p-10 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6 content-visibility-auto">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-zinc-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-zinc-800 text-[#1A2E3B] dark:text-amber-400 flex items-center justify-center flex-shrink-0 border border-slate-200 dark:border-zinc-700">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 font-mono">Launch Protocol</span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1A2E3B] dark:text-zinc-100">
                  Implementation Checklist for Launch
                </h2>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-zinc-300">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-[#142326]/60 border border-slate-200/80 dark:border-zinc-800">
                <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#1A2E3B] dark:text-zinc-100">Operating Model Determination</h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                    Clear technical and legal delineation: marketplace aggregator nodes utilize intermediary liability shields under Section 79 of India's IT Act and equivalent e-commerce exemptions, while direct micro-fulfillment nodes maintain inventory-held limited warranty compliance.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-[#142326]/60 border border-slate-200/80 dark:border-zinc-800">
                <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#1A2E3B] dark:text-zinc-100">Dynamic Split Terms by User Geolocation</h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                    The Flash Drops engine dynamically serves jurisdictional addenda at checkout and registration based on user client IP and store location (defaulting to UAE Terms under Dubai Courts for UAE sessions, and Indian Contract Act/IT Act compliance for Indian sessions).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-[#142326]/60 border border-slate-200/80 dark:border-zinc-800">
                <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#1A2E3B] dark:text-zinc-100">Restricted Category Audit & Age-Gating Procedures</h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                    Automated pre-checkout modal prompts and courier verification workflows for age-restricted items, preventing checkout unless verified credentials or affirmative age attestations (18+/21+) are registered.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Contact DPO & Grievance Officer Card */}
        <div className="bg-[#1A2E3B] dark:bg-zinc-950 text-white rounded-2xl p-6 sm:p-10 shadow-sm space-y-4 border border-transparent dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <Mail className="w-6 h-6 text-amber-400" />
            <h3 className="text-xl sm:text-2xl font-serif font-bold">Contact Our Legal & Privacy Office</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 dark:text-zinc-400 leading-relaxed">
            For data subject access requests, statutory grievance submissions, or legal notices, contact our Data Protection Office directly at{' '}
            <a href="mailto:privacy@flashdrops.app" className="text-amber-400 underline font-medium hover:text-amber-300">
              privacy@flashdrops.app
            </a>{' '}
            or reach the Grievance Officer at{' '}
            <a href="mailto:grievance-officer@flashdrops.app" className="text-amber-400 underline font-medium hover:text-amber-300">
              grievance-officer@flashdrops.app
            </a>.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('help-support')}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl transition-colors inline-flex items-center gap-2 shadow-md hover:shadow-amber-500/20 cursor-pointer"
            >
              <span>Visit Help & Support</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('terms-guide')}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl transition-colors inline-flex items-center gap-2 border border-white/20 cursor-pointer"
            >
              <span>Master Terms Guide</span>
            </button>
          </div>
        </div>

        {/* Footer Navigation Bar matching selector parent */}
        <div className="flex flex-wrap justify-center items-center gap-6 pt-6 text-sm text-slate-500 dark:text-zinc-400 font-medium">
          <button onClick={() => onNavigate('landing')} className="hover:text-[#1A2E3B] dark:hover:text-zinc-100 transition-colors cursor-pointer">About Us</button>
          <span>·</span>
          <button onClick={() => onNavigate('terms-guide')} className="hover:text-[#1A2E3B] dark:hover:text-zinc-100 transition-colors cursor-pointer">Terms Guide</button>
          <span>·</span>
          <button onClick={() => onNavigate('contact')} className="hover:text-[#1A2E3B] dark:hover:text-zinc-100 transition-colors cursor-pointer">Contact</button>
        </div>

      </main>
    </div>
  );
}
