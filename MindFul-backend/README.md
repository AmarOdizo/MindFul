# 🌿 MindFul Backend API (Supabase & Node.js)

RESTful API backend for the **MindFul** mobile wellness application. Powered by **Node.js**, **Express.js**, and **Supabase (PostgreSQL)**.

---

## ⚡ Supabase Setup (2 Easy Steps)

### 1. Run Database Schema in Supabase
1. Open your project on [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to **SQL Editor** in the left sidebar.
3. Open [`supabase_schema.sql`](./supabase_schema.sql), copy all content, paste it into the SQL Editor, and click **Run**.
4. This creates all 4 tables with performance indexes and RLS policies:
   - `public.users`
   - `public.mood_logs`
   - `public.journal_entries`
   - `public.chat_messages`

### 2. Configure Environment Variables
Open [`MindFul-backend/.env`](./.env) and add your project keys from **Project Settings ➔ API**:
```env
PORT=5000
JWT_SECRET=mindful_jwt_secret_token_secure_2026
GEMINI_API_KEY=your_optional_gemini_api_key

SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-or-service-role-key
```

---

## 🚀 Running the Server

```bash
cd MindFul-backend

# Start development server (auto-reloads on file change)
npm run dev

# Or start in production
npm start
```

Server URL: `http://localhost:5000`
Health Check: `http://localhost:5000/api/health`

---

## 📡 API Endpoints

### 🩺 Health & Info
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | API status & available endpoints |
| `GET` | `/api/health` | Healthcheck and server uptime |

---

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new account (`name`, `email`, `password`) |
| `POST` | `/api/auth/login` | Public | Login with credentials (`email`, `password`) |
| `GET` | `/api/auth/profile` | Bearer Token | Get user profile and usage statistics |
| `PUT` | `/api/auth/profile` | Bearer Token | Update user profile name |

---

### 💖 Mood Check-ins (`/api/mood`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/mood/log` | Optional | Record mood log (`mood_id`, `mood_label`, `intensity`, `tags`, `reflection`) |
| `GET` | `/api/mood/history` | Optional | Fetch recent mood history entries |
| `GET` | `/api/mood/stats` | Optional | Get mood analytics, intensity averages, and distribution |

---

### 📖 Journal Entries (`/api/journal`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/journal` | Optional | Create new journal reflection (`title`, `content`, `category`, `mood_tag`) |
| `GET` | `/api/journal` | Optional | Get journal entries (supports `?search=` and `?category=`) |
| `GET` | `/api/journal/:id` | Optional | Fetch single journal entry by ID |
| `PUT` | `/api/journal/:id` | Optional | Update journal entry |
| `DELETE` | `/api/journal/:id` | Optional | Delete journal entry |

---

### 💬 Maya AI Chat Companion (`/api/chat`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/chat` | Optional | Send message to Maya companion (`message`, `history`) |
| `GET` | `/api/chat/history` | Optional | Fetch chat message history |
