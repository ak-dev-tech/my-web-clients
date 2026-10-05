/**
 * Community API Integration Service
 * 
 * Instructions for adding your API:
 * 1. Set `VITE_COMMUNITY_API_URL` in your .env or replace `DEFAULT_API_ENDPOINT` below.
 * 2. Whenever you connect your API, every community detail (events, dates, locations, attendees, 
 *    types, status) will automatically adapt and populate directly according to your API response.
 * 3. In the meantime, all community sections display a polished "Coming Soon" state with preview teasers.
 */

export interface CommunityEvent {
  id: string;
  event_name: string;
  date: string;
  location: string;
  attendees: number;
  event_type: string;
  description?: string;
  is_coming_soon?: boolean;
  status?: 'coming_soon' | 'active' | 'scheduled';
  badge?: string;
}

export interface CommunityDataResult {
  isComingSoon: boolean;
  announcement: string;
  events: CommunityEvent[];
  apiUrl?: string;
}

import { API_CONFIG } from '../config';

// Default configuration: change this in src/config.ts or via VITE_COMMUNITY_API_URL in .env
export const DEFAULT_API_ENDPOINT = API_CONFIG.COMMUNITY_API_URL;

// Fallback preview data shown in "Coming Soon" mode
export const COMING_SOON_COMMUNITY_EVENTS: CommunityEvent[] = [
  {
    id: 'comm-soon-1',
    event_name: 'Metro Food Rescue & Community Drive',
    date: 'Launching Q4 • Dates Coming Soon',
    location: 'Harbor Community Center & Central Hubs',
    attendees: 0,
    event_type: 'Food Drive',
    description: 'Citywide surplus collection & volunteer distribution for local shelters. Scheduled to launch alongside our regional drop network.',
    is_coming_soon: true,
    status: 'coming_soon',
    badge: 'Coming Soon'
  },
  {
    id: 'comm-soon-2',
    event_name: 'Zero-Waste Kitchen Masterclass',
    date: 'Curating Schedule • Coming Soon',
    location: 'Green Garden Bistro & Culinary Loft',
    attendees: 0,
    event_type: 'Zero-Waste Workshop',
    description: 'Hands-on culinary techniques turning surplus kitchen produce into artisan broths, preserves, and gourmet meals.',
    is_coming_soon: true,
    status: 'coming_soon',
    badge: 'Coming Soon'
  },
  {
    id: 'comm-soon-3',
    event_name: 'Neighborhood Surplus Feast & Swap',
    date: 'Summer/Autumn Season • Coming Soon',
    location: 'Sunset Pier Market Pavilion',
    attendees: 0,
    event_type: 'Surplus Feast',
    description: 'A community gathering bringing neighbors together to share rescued kitchen creations and celebrate sustainable food culture.',
    is_coming_soon: true,
    status: 'coming_soon',
    badge: 'Coming Soon'
  }
];

/**
 * Flexible normalizer to accept any API shape / field names
 * (e.g., event_name, name, title; date, event_date, timestamp; location, venue, address; etc.)
 */
function normalizeEventItem(raw: any, index: number): CommunityEvent {
  return {
    id: String(raw.id || raw._id || raw.eventId || `event-${index + 1}`),
    event_name: String(raw.event_name || raw.name || raw.title || raw.eventName || `Community Gathering #${index + 1}`),
    date: String(raw.date || raw.event_date || raw.datetime || raw.schedule || 'Date To Be Announced'),
    location: String(raw.location || raw.venue || raw.place || raw.address || 'Location TBA'),
    attendees: Number(raw.attendees || raw.attendee_count || raw.rsvps || raw.capacity || 0),
    event_type: String(raw.event_type || raw.type || raw.category || raw.eventType || 'Community'),
    description: raw.description || raw.summary || raw.about || '',
    is_coming_soon: Boolean(raw.is_coming_soon ?? raw.comingSoon ?? raw.status === 'coming_soon'),
    status: (raw.status as any) || (raw.is_coming_soon ? 'coming_soon' : 'active'),
    badge: raw.badge || (raw.is_coming_soon ? 'Coming Soon' : undefined)
  };
}

/**
 * Fetches community data from either:
 * 1. Saved localStorage API endpoint (if tester configured in UI)
 * 2. DEFAULT_API_ENDPOINT from environment / config
 * 3. Or falls back to the clean "Coming Soon" dataset
 */
export async function fetchCommunityData(overrideUrl?: string): Promise<CommunityDataResult> {
  const customUrl = overrideUrl || (typeof window !== 'undefined' ? localStorage.getItem('custom_community_api_url') : null) || DEFAULT_API_ENDPOINT;

  if (customUrl && customUrl.trim() !== '') {
    try {
      const response = await fetch(customUrl.trim(), {
        headers: API_CONFIG.API_HEADERS
      });
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      const data = await response.json();

      // Flexible extraction: check for array directly, or properties like { events: [...] } or { data: [...] }
      const rawEvents = Array.isArray(data) 
        ? data 
        : Array.isArray(data.events) 
          ? data.events 
          : Array.isArray(data.data) 
            ? data.data 
            : Array.isArray(data.items) 
              ? data.items 
              : [];

      if (rawEvents.length > 0) {
        const events = rawEvents.map((item: any, idx: number) => normalizeEventItem(item, idx));
        return {
          isComingSoon: Boolean(data.is_coming_soon ?? data.isComingSoon ?? false),
          announcement: data.announcement || 'Live community events synchronized from your connected API.',
          events,
          apiUrl: customUrl.trim()
        };
      }
    } catch (err) {
      console.warn('Failed to load live community API data, falling back to Coming Soon state:', err);
    }
  }

  // Default: Return "Coming Soon" state with preview mock placeholders
  return {
    isComingSoon: true,
    announcement: 'Our Community Hub and neighborhood events are officially coming soon. Connect your API anytime to populate live events dynamically.',
    events: COMING_SOON_COMMUNITY_EVENTS,
    apiUrl: customUrl || ''
  };
}
