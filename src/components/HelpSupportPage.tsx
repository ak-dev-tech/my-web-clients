import { useState } from 'react';
import { 
  Search, 
  ShoppingBag, 
  CreditCard, 
  Truck, 
  UserCheck, 
  ChevronDown, 
  Mail, 
  Phone, 
  MessageSquare, 
  ArrowLeft,
  Clock,
  ExternalLink
} from 'lucide-react';
import { motion } from 'motion/react';

interface HelpSupportPageProps {
  onNavigate: (page: string) => void;
}

export function HelpSupportPage({ onNavigate }: HelpSupportPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<string | null>('orders-1');
  const [notification, setNotification] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const handleActionClick = (topicName: string) => {
    setNotification(`Navigating to ${topicName}... (Flash Drops Web Preview)`);
    setTimeout(() => setNotification(null), 3000);
  };

  const categories = [
    {
      id: 'orders',
      icon: ShoppingBag,
      title: 'Orders & Pickup',
      desc: 'Vouchers, timing, cancellations',
      btnText: 'View My Orders',
    },
    {
      id: 'payments',
      icon: CreditCard,
      title: 'Payments & Refunds',
      desc: 'UPI, cards, refund timelines',
      btnText: 'View Order Payments',
    },
    {
      id: 'delivery',
      icon: Truck,
      title: 'Delivery',
      desc: 'Tracking, partner issues, tips',
      btnText: 'Track My Orders',
    },
    {
      id: 'account',
      icon: UserCheck,
      title: 'Account & Flash Pass',
      desc: 'Profile, rewards, subscription',
      btnText: 'Go to My Profile',
    },
  ];

  const faqSections = [
    {
      category: 'Orders & Pickup',
      items: [
        {
          id: 'orders-1',
          question: 'How do I redeem my Flash Drop at the restaurant?',
          answer:
            'Open the order from your Orders tab, tap "Collect", and show the redemption code to the restaurant staff during your pickup window. They will verify it and hand over your bundle.',
        },
        {
          id: 'orders-2',
          question: 'What is the pickup window?',
          answer:
            'Each Flash Drop lists a specific pickup window (e.g. 7:00 PM - 9:30 PM). You can only collect your order within this window. It is shown on the bundle, your order tracking page, and your collection voucher.',
        },
        {
          id: 'orders-3',
          question: 'Can I cancel my order?',
          answer:
            'You can cancel before the restaurant accepts it. Once accepted, the surplus is reserved for you and cancellations are no longer available — this is how we prevent food waste.',
        },
      ],
    },
    {
      category: 'Payments & Refunds',
      items: [
        {
          id: 'pay-1',
          question: 'When will I get my refund?',
          answer:
            'Refunds for failed or cancelled payments are initiated within 24 hours and typically reach your original payment method in 5-7 business days, depending on your bank.',
        },
        {
          id: 'pay-2',
          question: 'What payment methods are supported?',
          answer:
            'We accept UPI (Google Pay, PhonePe, Paytm), Credit & Debit Cards (Visa, MasterCard, RuPay), and Flash Coins balance.',
        },
      ],
    },
    {
      category: 'Account & Membership',
      items: [
        {
          id: 'acc-1',
          question: 'What is a Flash Pass?',
          answer:
            'Flash Pass is an optional membership that unlocks extra perks like priority drops and exclusive discounts. It is completely optional — you can use Flash Drops fully without it.',
        },
        {
          id: 'acc-2',
          question: 'How do I become a restaurant or delivery partner?',
          answer:
            'Tap "Become a Partner" in your Profile menu, or visit /restaurant/register or /delivery/register to apply. Our team reviews applications within 2-3 business days.',
        },
      ],
    },
  ];

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

      {/* Hero Header */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10 text-center">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800/80 text-xs font-semibold tracking-wider uppercase text-amber-800 dark:text-amber-300 mb-3 shadow-2xs">
          Knowledge Base
        </span>
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-5xl font-bold font-serif text-[#1A2E3B] dark:text-zinc-100 mb-3 tracking-tight"
        >
          Help & Support
        </motion.h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-400 max-w-xl mx-auto mb-8 font-light leading-relaxed">
          We're here to help. Find quick answers or reach out directly to our community desk.
        </p>

        {/* Search input */}
        <div className="max-w-xl mx-auto relative">
          <Search className="w-5 h-5 text-slate-400 dark:text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FAQs, refunds, orders, deliveries..."
            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white dark:bg-[#162227] border border-slate-200/80 dark:border-zinc-800 shadow-sm text-xs sm:text-sm font-medium text-[#1A2E3B] dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
          />
        </div>

        {notification && (
          <div className="mt-4 p-3 bg-white dark:bg-[#162227] border border-slate-200 dark:border-zinc-800 shadow-sm text-slate-700 dark:text-zinc-200 rounded-xl text-xs max-w-md mx-auto font-medium">
            {notification}
          </div>
        )}
      </section>

      {/* Browse by Topic */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-zinc-400 mb-6">
          Browse by Topic
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                className="bg-white dark:bg-[#162227] rounded-2xl p-5 border border-slate-200/80 dark:border-zinc-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/80 flex items-center justify-center mb-3">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold font-serif text-[#1A2E3B] dark:text-zinc-100 text-lg mb-1">{cat.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 font-normal mb-4">{cat.desc}</p>
                </div>
                <button
                  onClick={() => handleActionClick(cat.btnText)}
                  className="w-full py-2.5 px-3 text-xs font-semibold text-slate-700 dark:text-zinc-200 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 rounded-xl border border-slate-200 dark:border-zinc-700 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <span>{cat.btnText}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#1A2E3B] dark:text-zinc-100 mb-6 tracking-tight">
          Frequently Asked Questions
        </h2>

        <div className="space-y-8">
          {faqSections.map((section, sIdx) => {
            const filteredItems = section.items.filter(
              (item) =>
                item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.answer.toLowerCase().includes(searchQuery.toLowerCase())
            );

            if (filteredItems.length === 0) return null;

            return (
              <div key={sIdx} className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  {section.category}
                </h3>
                <div className="space-y-3">
                  {filteredItems.map((item) => {
                    const isOpen = openFaq === item.id;
                    return (
                      <div
                        key={item.id}
                        className="bg-white dark:bg-[#162227] rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-xs overflow-hidden"
                      >
                        <button
                          onClick={() => toggleFaq(item.id)}
                          className="w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/80 dark:hover:bg-zinc-800/50 transition-colors"
                        >
                          <span className="font-semibold text-[#1A2E3B] dark:text-zinc-100 text-sm sm:text-base">
                            {item.question}
                          </span>
                          <ChevronDown
                            className={`w-5 h-5 text-slate-400 dark:text-zinc-500 flex-shrink-0 transition-transform duration-200 ${
                              isOpen ? 'rotate-180 text-amber-600 dark:text-amber-400' : ''
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-zinc-300 font-normal leading-relaxed border-t border-slate-100 dark:border-zinc-800">
                            {item.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Still Need Help Card */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1A2E3B] dark:bg-zinc-950 text-white rounded-3xl p-8 sm:p-10 border border-slate-200/20 dark:border-zinc-800 shadow-lg relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-white/10 text-amber-300 border border-white/15">
              24/7 Community Desk
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold font-serif text-white">Still Need Help?</h3>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl font-normal leading-relaxed">
              Can't find what you are looking for? Our local team is here to assist with pickups, deliveries, and partnerships.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <a
                href="mailto:flashdrops111@gmail.com"
                className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-3"
              >
                <div className="p-2.5 rounded-lg bg-amber-400/20 text-amber-300">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Email Support</div>
                  <div className="text-xs font-medium text-white truncate">flashdrops111@gmail.com</div>
                </div>
              </a>

              <a
                href="tel:+919991155983"
                className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-3"
              >
                <div className="p-2.5 rounded-lg bg-amber-400/20 text-amber-300">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Call Us</div>
                  <div className="text-xs font-medium text-white">+91 9991155983</div>
                </div>
              </a>

              <button
                onClick={() => onNavigate('contact')}
                className="p-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold shadow-sm transition-all flex items-center gap-3 text-left cursor-pointer"
              >
                <div className="p-2.5 rounded-lg bg-white/20 text-white">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider opacity-90 font-medium">Send a Message</div>
                  <div className="text-xs font-semibold">Open Contact Form</div>
                </div>
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 pt-2 border-t border-white/10 font-normal">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Support hours: Mon-Sat, 9 AM - 7 PM IST. Typical response within 24 hours.</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
