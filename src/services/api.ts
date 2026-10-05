import { API_CONFIG } from '../config';

export interface DropItem {
  id: string;
  restaurant: string;
  cuisine: string;
  category: 'all' | 'bakery' | 'plant' | 'patisserie' | 'gourmet';
  title: string;
  description: string;
  image: string;
  retailPrice: number;
  dropPrice: number;
  discountPercent: number;
  remaining: number;
  total: number;
  status: 'active' | 'sold_out' | 'last_few';
  pickupWindow: string;
  address: string;
  dietaryTags: string[];
  chefNote: string;
}

export const ACTIVE_PARTNER_DROPS: DropItem[] = [
  {
    id: 'drop-1',
    restaurant: 'Artisan Sourdough Bakery',
    cuisine: 'Slow Ferment & Ancient Grains',
    category: 'bakery',
    title: 'Heritage Spelt Batard & Morning Brioche Crate',
    description: 'Crisp stone-baked sourdough loaf alongside three hand-laminated brioche pastries baked this morning with organic butter.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    retailPrice: 599,
    dropPrice: 199,
    discountPercent: 67,
    remaining: 3,
    total: 12,
    status: 'last_few',
    pickupWindow: '18:00 – 19:30 Today',
    address: '42 Baker St, Bandra West, Mumbai',
    dietaryTags: ['Vegetarian', 'Zero Additives', 'Organic Grain'],
    chefNote: 'Baked at 6:00 AM with 36-hour slow cold fermentation. Perfect for evening toast or French toast tomorrow.'
  },
  {
    id: 'drop-2',
    restaurant: 'Green Garden Bistro',
    cuisine: 'Farm-to-Table & Botanical Bowls',
    category: 'plant',
    title: 'Harvest Truffle Mezze & Smoked Quinoa Hearth',
    description: 'Roasted heirloom carrots, charred broccolini, herb-infused hummus, wild foraged mushrooms, and crispy ancient grains.',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    retailPrice: 799,
    dropPrice: 269,
    discountPercent: 66,
    remaining: 6,
    total: 15,
    status: 'active',
    pickupWindow: '18:30 – 20:00 Today',
    address: '18 Greenhouse Mews, Indiranagar, Bengaluru',
    dietaryTags: ['100% Plant-Based', 'Gluten-Free', 'Eco-Harvest'],
    chefNote: 'All produce harvested yesterday from our partner micro-farm. Dressings packed on the side.'
  },
  {
    id: 'drop-3',
    restaurant: 'L\'Étoile Patisserie & Salon',
    cuisine: 'Haute Pâtisserie & Confectionery',
    category: 'patisserie',
    title: 'Grand Reserve Ganache Tart & Pistachio Choux Duo',
    description: 'Single-origin 72% dark chocolate silk tart paired with caramelized Bronte pistachio cream craquelin puffs.',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    retailPrice: 899,
    dropPrice: 329,
    discountPercent: 63,
    remaining: 2,
    total: 8,
    status: 'last_few',
    pickupWindow: '19:00 – 20:15 Today',
    address: '9 Royale Arcade, Hauz Khas, New Delhi',
    dietaryTags: ['Vegetarian', 'Fair Trade Cocoa', 'Artisanal'],
    chefNote: 'Crafted by Master Pastry Chef. Chilled packaging ready for immediate dessert or chilled indulgence.'
  },
  {
    id: 'drop-4',
    restaurant: 'Truffle & Herb Brasserie',
    cuisine: 'Contemporary Northern Italian',
    category: 'gourmet',
    title: 'Porcini Agnolotti & Hand-Stretched Truffle Focaccia',
    description: 'Fresh egg pasta parcels with ricotta & black winter truffle emulsion, accompanied by rosemary garlic sea-salt focaccia.',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
    retailPrice: 999,
    dropPrice: 349,
    discountPercent: 65,
    remaining: 0,
    total: 10,
    status: 'sold_out',
    pickupWindow: '20:00 – 21:00 Today',
    address: '104 Piazza Verde, Koregaon Park, Pune',
    dietaryTags: ['Vegetarian', 'Fresh Pasta', 'Italian DOC'],
    chefNote: 'Sold out in 14 minutes today. Pre-register for tomorrow’s vault drop alert at 12:00 PM.'
  },
  {
    id: 'drop-5',
    restaurant: 'Botanica Hearth & Roastery',
    cuisine: 'Woodfire Mediterranean',
    category: 'gourmet',
    title: 'Charred Aubergine Shakshuka & Wood-Fired Pave',
    description: 'Slow-simmered San Marzano tomato reduction, fire-roasted aubergine, crumbled goat cheese, and toasted sourdough slice.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    retailPrice: 649,
    dropPrice: 219,
    discountPercent: 66,
    remaining: 5,
    total: 14,
    status: 'active',
    pickupWindow: '18:15 – 19:45 Today',
    address: '77 Jubilee Hills, Road No. 36, Hyderabad',
    dietaryTags: ['Vegetarian', 'Woodfire Slow Cooked', 'High Fiber'],
    chefNote: 'Cooked over wood coals. Reheats beautifully in 3 minutes or enjoyed warm straight from the box.'
  },
  {
    id: 'drop-6',
    restaurant: 'Sakura Nori Lounge',
    cuisine: 'Modern Japanese & Izakaya',
    category: 'gourmet',
    title: 'Chef’s Omakase Temaki & Smoked Edamame Reserve',
    description: 'Four hand-rolled nori wraps featuring king oyster mushroom tare, pickled daikon, avocado, and toasted sesame furikake.',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
    retailPrice: 1199,
    dropPrice: 429,
    discountPercent: 64,
    remaining: 4,
    total: 10,
    status: 'active',
    pickupWindow: '20:15 – 21:30 Today',
    address: '5 Crescent Walk, Alwarpet, Chennai',
    dietaryTags: ['Pescatarian / Plant Friendly', 'Gluten-Conscious'],
    chefNote: 'Made fresh 1 hour before pickup window. Stored in temperature-regulated insulated chill lockers.'
  }
];

/**
 * Fetches Live Surplus Drops from the connected REST API (API_CONFIG.DROPS_API_URL).
 * If no API endpoint is provided or the network request fails, it falls back
 * smoothly to the verified local partner drops collection.
 */
export async function fetchLiveDrops(): Promise<DropItem[]> {
  const customDropsUrl = API_CONFIG.DROPS_API_URL?.trim();

  if (customDropsUrl) {
    try {
      const res = await fetch(customDropsUrl, {
        headers: API_CONFIG.API_HEADERS
      });
      if (res.ok) {
        const data = await res.json();
        const rawDrops = Array.isArray(data)
          ? data
          : Array.isArray(data.drops)
            ? data.drops
            : Array.isArray(data.items)
              ? data.items
              : [];
        if (rawDrops.length > 0) {
          return rawDrops.map((d: any, idx: number) => ({
            id: String(d.id || `drop-${idx + 1}`),
            restaurant: String(d.restaurant || d.partner || 'Partner Kitchen'),
            cuisine: String(d.cuisine || 'Artisanal'),
            category: d.category || 'all',
            title: String(d.title || d.name || 'Surplus Meal Crate'),
            description: String(d.description || ''),
            image: String(d.image || d.photoUrl || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80'),
            retailPrice: Number(d.retailPrice || d.originalPrice || 499),
            dropPrice: Number(d.dropPrice || d.price || 199),
            discountPercent: Number(d.discountPercent || Math.round((1 - (Number(d.dropPrice || 199) / Number(d.retailPrice || 499))) * 100)),
            remaining: Number(d.remaining ?? d.quantity ?? 5),
            total: Number(d.total ?? 10),
            status: d.status || 'active',
            pickupWindow: String(d.pickupWindow || d.pickup_time || '18:00 – 19:30 Today'),
            address: String(d.address || d.location || 'Local Partner Kitchen'),
            dietaryTags: Array.isArray(d.dietaryTags) ? d.dietaryTags : ['Vegetarian'],
            chefNote: String(d.chefNote || d.note || '')
          }));
        }
      }
    } catch (err) {
      console.warn('Failed to load drops from DROPS_API_URL, falling back to local dataset:', err);
    }
  }

  // Simulated backend REST API response for the Live Surplus Feed
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...ACTIVE_PARTNER_DROPS]);
    }, 400);
  });
}
