import { NativeModules, Platform } from 'react-native';

// Detect if running inside an Android Emulator
const isAndroidEmulator = () => {
  if (Platform.OS !== 'android') return false;
  const c = Platform.constants || {};
  const model = (c.Model || '').toLowerCase();
  const brand = (c.Brand || '').toLowerCase();
  const manufacturer = (c.Manufacturer || '').toLowerCase();
  const fingerprint = (c.Fingerprint || '').toLowerCase();
  const hardware = (c.Hardware || '').toLowerCase();

  return (
    model.includes('sdk') ||
    model.includes('emulator') ||
    model.includes('google_sdk') ||
    (brand.includes('google') && model.includes('gphone')) ||
    manufacturer.includes('genymotion') ||
    fingerprint.includes('generic') ||
    hardware.includes('goldfish') ||
    hardware.includes('ranchu')
  );
};

let cachedWorkingBaseUrl = null;

// Returns an array of candidate URLs to try in priority order
export const getApiBaseUrls = () => {
  if (Platform.OS === 'web') {
    return ['http://localhost:5000'];
  }

  const list = [];
  // Prioritize previously verified working base URL
  if (cachedWorkingBaseUrl) {
    list.push(cachedWorkingBaseUrl);
  }

  const isEmulator = isAndroidEmulator();

  // If in Android Emulator, 10.0.2.2 is the official virtual router alias to PC localhost
  if (isEmulator && !list.includes('http://10.0.2.2:5000')) {
    list.push('http://10.0.2.2:5000');
  }

  // Auto-detect from Metro scriptURL if available
  try {
    const scriptURL = NativeModules?.SourceCode?.scriptURL;
    if (scriptURL) {
      const match = scriptURL.match(/https?:\/\/([^/:]+)/);
      const host = match ? match[1] : null;
      if (host && host !== 'localhost' && host !== '127.0.0.1') {
        const metroHost = `http://${host}:5000`;
        if (!list.includes(metroHost)) list.push(metroHost);
      }
    }
  } catch (e) {
    // ignore
  }

  // Active Wi-Fi LAN IP (192.168.1.3)
  if (!list.includes('http://192.168.1.3:5000')) {
    list.push('http://192.168.1.3:5000');
  }

  // 10.0.2.2 for Android in general
  if (Platform.OS === 'android' && !list.includes('http://10.0.2.2:5000')) {
    list.push('http://10.0.2.2:5000');
  }

  // Localhost (works when using: adb reverse tcp:5000 tcp:5000)
  if (!list.includes('http://localhost:5000')) {
    list.push('http://localhost:5000');
  }

  return list;
};

export const getApiBaseUrl = () => {
  return getApiBaseUrls()[0];
};

// Export base URL for backward compatibility
export const API_BASE_URL = getApiBaseUrl();

let currentAuthToken = null;

export const setAuthToken = (token) => {
  currentAuthToken = token;
};

export const getAuthToken = () => {
  return currentAuthToken;
};

// Generic request helper with multi-candidate auto-fallback
async function request(endpoint, options = {}) {
  const candidateUrls = getApiBaseUrls();
  const headers = {
    'Content-Type': 'application/json',
    ...(currentAuthToken ? { Authorization: `Bearer ${currentAuthToken}` } : {}),
    ...(options.headers || {}),
  };

  let lastError = null;

  for (let i = 0; i < candidateUrls.length; i++) {
    const baseUrl = candidateUrls[i];
    const url = `${baseUrl}${endpoint}`;

    // Faster timeout for early candidates so fallback happens promptly
    const isSingleCandidate = candidateUrls.length === 1 || Boolean(cachedWorkingBaseUrl);
    const timeoutMs = isSingleCandidate ? 15000 : 4000;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    console.log(`[API] ${options.method || 'GET'} ${url} (target ${i + 1}/${candidateUrls.length})`);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const json = await response.json().catch(() => ({}));

      // Server answered! Lock in this working host for future calls
      cachedWorkingBaseUrl = baseUrl;

      if (!response.ok) {
        throw new Error(json.error || json.message || `HTTP ${response.status}`);
      }

      return json;
    } catch (error) {
      clearTimeout(timeoutId);
      lastError = error;

      // If the server answered with an HTTP error status (400, 401, 500 etc), it's reachable
      if (
        error.message &&
        (error.message.startsWith('HTTP ') ||
          (!error.message.includes('canceled') &&
            !error.message.includes('Network request failed') &&
            !error.message.includes('fetch') &&
            error.name !== 'AbortError'))
      ) {
        throw error;
      }

      console.warn(`[API] Unreachable: ${baseUrl}. Trying alternative...`);
    }
  }

  console.warn(`[API] All backend endpoints unreachable:`, candidateUrls);
  throw new Error(
    `Unable to connect to backend server. Tried: ${candidateUrls.join(', ')}. Please verify backend is running on port 5000.`
  );
}

// -------------------------------------------------------------
// Mood APIs
// -------------------------------------------------------------
export const moodApi = {
  logMood: async (data) => {
    return request('/api/mood/log', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getMoodHistory: async (limit = 10) => {
    return request(`/api/mood/history?limit=${limit}`);
  },

  getMoodStats: async (days = 7) => {
    return request(`/api/mood/stats?days=${days}`);
  },
};

// -------------------------------------------------------------
// Journal APIs
// -------------------------------------------------------------
export const journalApi = {
  getEntries: async (search = '', category = '') => {
    let query = '';
    const params = [];
    if (search) params.push(`search=${encodeURIComponent(search)}`);
    if (category && category !== 'All Entries') params.push(`category=${encodeURIComponent(category)}`);
    if (params.length > 0) query = `?${params.join('&')}`;

    return request(`/api/journal${query}`);
  },

  getEntryById: async (id) => {
    return request(`/api/journal/${id}`);
  },

  createEntry: async (entryData) => {
    return request('/api/journal', {
      method: 'POST',
      body: JSON.stringify(entryData),
    });
  },

  updateEntry: async (id, entryData) => {
    return request(`/api/journal/${id}`, {
      method: 'PUT',
      body: JSON.stringify(entryData),
    });
  },

  deleteEntry: async (id) => {
    return request(`/api/journal/${id}`, {
      method: 'DELETE',
    });
  },
};

// -------------------------------------------------------------
// Maya Companion Chat APIs
// -------------------------------------------------------------
export const chatApi = {
  sendMessage: async (message, history = []) => {
    return request('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message, history }),
    });
  },

  getChatHistory: async (limit = 30) => {
    return request(`/api/chat/history?limit=${limit}`);
  },

  clearChatHistory: async () => {
    return request('/api/chat/history', { method: 'DELETE' });
  },
};

// -------------------------------------------------------------
// Auth & User APIs
// -------------------------------------------------------------
export const authApi = {
  register: async (credentials) => {
    return request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  login: async (credentials) => {
    return request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  getProfile: async (token) => {
    return request('/api/auth/profile', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },
};

export default {
  mood: moodApi,
  journal: journalApi,
  chat: chatApi,
  auth: authApi,
  API_BASE_URL,
  getApiBaseUrl,
};
