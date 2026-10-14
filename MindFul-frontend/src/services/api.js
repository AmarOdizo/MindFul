import { NativeModules, Platform } from 'react-native';

// In Expo development:
// - Physical mobile devices (Android/iOS via Expo Go) need your computer's local Wi-Fi IP
// - Web uses localhost
const getDevBaseUrl = () => {
  if (Platform.OS === 'web') {
    return 'http://localhost:5000';
  }

  // Auto-detect the host machine's IP from Metro bundler scriptURL
  try {
    const scriptURL = NativeModules?.SourceCode?.scriptURL;
    if (scriptURL) {
      const host = scriptURL.split('://')[1]?.split('/')[0]?.split(':')[0];
      if (host && host !== 'localhost' && host !== '127.0.0.1') {
        return `http://${host}:5000`;
      }
    }
  } catch (e) {
    // ignore
  }

  // Your computer's active Wi-Fi LAN IP
  return 'http://192.168.1.5:5000';
};

export const API_BASE_URL = getDevBaseUrl();

let currentAuthToken = null;

export const setAuthToken = (token) => {
  currentAuthToken = token;
};

export const getAuthToken = () => {
  return currentAuthToken;
};

// Generic request helper with timeout and fallback handling
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(currentAuthToken ? { Authorization: `Bearer ${currentAuthToken}` } : {}),
    ...(options.headers || {}),
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const json = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(json.error || json.message || `HTTP ${response.status}`);
    }

    return json;
  } catch (error) {
    console.warn(`[API] Error on ${options.method || 'GET'} ${endpoint}:`, error.message);
    throw error;
  }
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
};
