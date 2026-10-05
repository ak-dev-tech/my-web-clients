import { API_CONFIG } from '../config';

export interface Restaurant {
  id: string;
  name: string;
  food_type: string;
  rating: number;
  surplus_active: boolean;
  address: string;
  cuisine: string;
  image?: string;
}

export interface DeliveryPartner {
  id: string;
  name: string;
  vehicle: string;
  fleet_type: 'green' | 'delivery';
  total_deliveries: number;
  status: string;
  rating: number;
  impact_saved_kg: number;
  delivery_time?: string;
  badge?: string;
}

export const DEFAULT_RESTAURANTS: Restaurant[] = [
  {
    id: 'rest-1',
    name: 'Artisan Sourdough Bakery',
    food_type: 'Bakery & Pastries',
    rating: 4.9,
    surplus_active: true,
    address: '42 Baker Square, Downtown',
    cuisine: 'European Artisanal'
  },
  {
    id: 'rest-2',
    name: 'Green Garden Bistro',
    food_type: 'Mediterranean & Bowls',
    rating: 4.8,
    surplus_active: true,
    address: '108 Flora Way, Botanical Quarter',
    cuisine: 'Farm-to-Table & Vegan Friendly'
  },
  {
    id: 'rest-3',
    name: 'Coastal Woodfire Pizza',
    food_type: 'Italian & Wood-Fired',
    rating: 4.7,
    surplus_active: false,
    address: '15 Ocean Avenue, Marina District',
    cuisine: 'Neapolitan Artisan'
  },
  {
    id: 'rest-4',
    name: 'Golden Lotus Dumpling House',
    food_type: 'Dim Sum & Asian Comfort',
    rating: 4.8,
    surplus_active: true,
    address: '77 Silk Street, Chinatown',
    cuisine: 'Handmade Dim Sum'
  }
];

export const DEFAULT_FLEET: DeliveryPartner[] = [
  {
    id: 'fleet-1',
    name: 'Marcus Sterling',
    vehicle: 'E-Bike (Zero Emission)',
    fleet_type: 'green',
    total_deliveries: 1420,
    status: 'Active on Route',
    rating: 4.98,
    impact_saved_kg: 840,
    delivery_time: '12-18 min',
    badge: '100% Eco Pedal'
  },
  {
    id: 'fleet-2',
    name: 'Priya Patel',
    vehicle: 'Electric Cargo Scooter',
    fleet_type: 'green',
    total_deliveries: 980,
    status: 'Available for Drop',
    rating: 4.95,
    impact_saved_kg: 610,
    delivery_time: '10-15 min',
    badge: 'Green Fleet Hero'
  },
  {
    id: 'fleet-3',
    name: 'Liam Chen',
    vehicle: 'Rapid Transit Courier',
    fleet_type: 'delivery',
    total_deliveries: 2150,
    status: 'Active on Route',
    rating: 4.92,
    impact_saved_kg: 1120,
    delivery_time: '8-14 min',
    badge: 'Express Dispatch'
  }
];

/**
 * Fetches Partner Restaurants from REST API or falls back to default collection.
 */
export async function fetchRestaurants(): Promise<Restaurant[]> {
  const url = API_CONFIG.RESTAURANTS_API_URL?.trim();
  if (url) {
    try {
      const res = await fetch(url, { headers: API_CONFIG.API_HEADERS });
      if (res.ok) {
        const data = await res.json();
        const items = Array.isArray(data)
          ? data
          : Array.isArray(data.restaurants)
            ? data.restaurants
            : Array.isArray(data.items)
              ? data.items
              : [];
        if (items.length > 0) {
          return items.map((r: any, idx: number) => ({
            id: String(r.id || `rest-${idx + 1}`),
            name: String(r.name || r.restaurant || 'Partner Kitchen'),
            food_type: String(r.food_type || r.type || 'Artisanal Meals'),
            rating: Number(r.rating || 4.8),
            surplus_active: Boolean(r.surplus_active ?? r.hasSurplus ?? true),
            address: String(r.address || r.location || 'Local District'),
            cuisine: String(r.cuisine || 'Gourmet'),
            image: r.image || r.photoUrl
          }));
        }
      }
    } catch (err) {
      console.warn('Failed to load restaurants from API, using default list:', err);
    }
  }
  return [...DEFAULT_RESTAURANTS];
}

/**
 * Fetches Delivery & Green Fleet from REST API or falls back to default fleet.
 */
export async function fetchDeliveryFleet(): Promise<DeliveryPartner[]> {
  const url = API_CONFIG.FLEET_API_URL?.trim();
  if (url) {
    try {
      const res = await fetch(url, { headers: API_CONFIG.API_HEADERS });
      if (res.ok) {
        const data = await res.json();
        const items = Array.isArray(data)
          ? data
          : Array.isArray(data.fleet)
            ? data.fleet
            : Array.isArray(data.couriers)
              ? data.couriers
              : Array.isArray(data.items)
                ? data.items
                : [];
        if (items.length > 0) {
          return items.map((f: any, idx: number) => ({
            id: String(f.id || `fleet-${idx + 1}`),
            name: String(f.name || f.courierName || `Courier #${idx + 1}`),
            vehicle: String(f.vehicle || (f.fleet_type === 'green' ? 'E-Bike (Zero Emission)' : 'Urban Courier')),
            fleet_type: (f.fleet_type === 'green' || f.isEco || f.vehicle?.toLowerCase().includes('bike') || f.vehicle?.toLowerCase().includes('electric')) ? 'green' : 'delivery',
            total_deliveries: Number(f.total_deliveries || f.deliveries || 100),
            status: String(f.status || 'Active on Route'),
            rating: Number(f.rating || 4.9),
            impact_saved_kg: Number(f.impact_saved_kg || f.co2Saved || 500),
            delivery_time: f.delivery_time || '10-20 min',
            badge: f.badge || (f.fleet_type === 'green' ? 'Eco Courier' : 'Active Fleet')
          }));
        }
      }
    } catch (err) {
      console.warn('Failed to load fleet from API, using default fleet:', err);
    }
  }
  return [...DEFAULT_FLEET];
}
