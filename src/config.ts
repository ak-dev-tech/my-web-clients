/**
 * =====================================================================
 * 📍 MASTER API ARCHITECTURE & LOCATION CONFIG
 * =====================================================================
 * 
 * ❓ USER QUESTION:
 * "Community Events & Gatherings, Live Food Surplus Drops Feed,
 *  Partner Restaurants, Our Delivery & Green Fleet — all these things
 *  are in one app. Do I need to make multiple APIs?"
 * 
 * 💡 THE SHORT ANSWER:
 * NO! You do NOT need to make multiple APIs unless you choose to.
 * 
 * You have three clear choices:
 * 
 * ---------------------------------------------------------------------
 * 🟢 OPTION 1: ONE SINGLE BACKEND API (RECOMMENDED STANDARD)
 * ---------------------------------------------------------------------
 * You run ONE backend server (Express/Node, Python/FastAPI, Django, etc.).
 * Just put your base URL into `BASE_API_URL` below.
 * That one API server handles 4 simple routes:
 *   • GET /api/drops        -> Live Food Surplus Drops Feed
 *   • GET /api/restaurants  -> Partner Restaurants Directory
 *   • GET /api/fleet        -> Delivery & Green Fleet
 *   • GET /api/events       -> Community Events & Gatherings
 * All 4 features share the SAME domain, SAME API Key, and SAME database!
 * 
 * ---------------------------------------------------------------------
 * 🟡 OPTION 2: MULTIPLE / SEPARATE APIs (MICROSERVICES)
 * ---------------------------------------------------------------------
 * If your fleet comes from an external courier provider (e.g. DoorDash Drive,
 * Dunzo), your events come from Eventbrite/Luma, and your drops come from
 * your own server, you can set individual URLs below.
 * 
 * ---------------------------------------------------------------------
 * 🔵 OPTION 3: FIREBASE FIRESTORE DIRECT (ZERO BACKEND SERVER)
 * ---------------------------------------------------------------------
 * Your app already has Firebase Firestore configured! You can store and
 * update documents in 4 Firestore collections without writing any API server:
 *   • 'drops'
 *   • 'restaurants'
 *   • 'fleet'
 *   • 'events'
 * =====================================================================
 */

const env = (import.meta as any).env || {};

/**
 * =====================================================================
 * 📍 EXACT LOCATION 1: SINGLE BASE API URL (RECOMMENDED)
 * =====================================================================
 * If you have ONE backend (Express, Django, FastAPI, Laravel, NestJS, etc.)
 * that handles /drops, /restaurants, /fleet, and /events:
 * 
 * 👉 PASTE YOUR BASE API URL ON THE LINE BELOW:
 * Example: const BASE_API_URL = 'https://api.yourdomain.com/api';
 */
const BASE_API_URL = (env.VITE_BASE_API_URL as string) || '/api';

export const API_CONFIG = {
  /**
   * BASE URL for the unified backend server.
   */
  BASE_API_URL,

  /**
   * =====================================================================
   * 📍 EXACT LOCATION 2: FEATURE 1 — LIVE FOOD SURPLUS DROPS FEED
   * =====================================================================
   * Endpoint: GET /api/drops
   * Default: ${BASE_API_URL}/drops
   * 
   * 👉 PASTE INDIVIDUAL DROPS API URL HERE (if not using base URL):
   */
  DROPS_API_URL: (env.VITE_DROPS_API_URL as string) || (BASE_API_URL ? `${BASE_API_URL.replace(/\/$/, '')}/drops` : ''),

  /**
   * =====================================================================
   * 📍 EXACT LOCATION 3: FEATURE 2 — PARTNER RESTAURANTS DIRECTORY
   * =====================================================================
   * Endpoint: GET /api/restaurants
   * Default: ${BASE_API_URL}/restaurants
   * 
   * 👉 PASTE INDIVIDUAL RESTAURANTS API URL HERE (if not using base URL):
   */
  RESTAURANTS_API_URL: (env.VITE_RESTAURANTS_API_URL as string) || (BASE_API_URL ? `${BASE_API_URL.replace(/\/$/, '')}/restaurants` : ''),

  /**
   * =====================================================================
   * 📍 EXACT LOCATION 4: FEATURE 3 — OUR DELIVERY & GREEN FLEET
   * =====================================================================
   * Endpoint: GET /api/fleet
   * Default: ${BASE_API_URL}/fleet
   * 
   * 👉 PASTE INDIVIDUAL FLEET API URL HERE (if not using base URL):
   */
  FLEET_API_URL: (env.VITE_FLEET_API_URL as string) || (BASE_API_URL ? `${BASE_API_URL.replace(/\/$/, '')}/fleet` : ''),

  /**
   * =====================================================================
   * 📍 EXACT LOCATION 5: FEATURE 4 — COMMUNITY EVENTS & GATHERINGS
   * =====================================================================
   * Endpoint: GET /api/events
   * Default: ${BASE_API_URL}/events
   * 
   * 👉 PASTE INDIVIDUAL EVENTS API URL HERE (if not using base URL):
   */
  COMMUNITY_API_URL: (env.VITE_COMMUNITY_API_URL as string) || (BASE_API_URL ? `${BASE_API_URL.replace(/\/$/, '')}/events` : ''),

  /**
   * =====================================================================
   * 📍 EXACT LOCATION 6: API KEYS & AUTHENTICATION HEADERS
   * =====================================================================
   * If your API requires an API Key (e.g. x-api-key) or Bearer Token:
   * 
   * 👉 PASTE YOUR API KEY / TOKEN HERE:
   */
  API_HEADERS: {
    'Content-Type': 'application/json',
    ...(env.VITE_API_KEY ? { 'x-api-key': env.VITE_API_KEY as string } : {}),
    ...(env.VITE_API_TOKEN ? { 'Authorization': `Bearer ${env.VITE_API_TOKEN}` } : {}),
  } as Record<string, string>
};

export const APP_VERSION = '1.0.0';
export const APP_GIT_TAG = 'v1.0.0';

