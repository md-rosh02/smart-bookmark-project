# 🔖 Smart Bookmark App

A simple and secure bookmark manager built using **Next.js App Router** and **Supabase**.  
The application allows users to sign in using **Google OAuth**, manage their bookmarks privately, and see real-time updates across multiple sessions.

---

## 🔗 Live Demo & Repository

- **Live App (Vercel):**  
  https://your-vercel-project.vercel.app

- **GitHub Repository:**  
  https://github.com/md-rosh02/smart-bookmark-project

---

## ✨ Features

- Google OAuth authentication (no email/password)
- Add bookmarks with title and URL
- Bookmarks are **private to each user**
- Real-time updates (sync across multiple tabs)
- Delete your own bookmarks
- Clean, responsive UI using Tailwind CSS
- Fully deployed on Vercel

---

## 🛠 Tech Stack

- **Next.js** (App Router)
- **Supabase**
  - Authentication (Google OAuth)
  - PostgreSQL Database
  - Realtime subscriptions
- **Tailwind CSS**
- **Vercel** (Deployment)

---

## 🔐 Security & Privacy

- Supabase **Row Level Security (RLS)** enabled
- Each bookmark is linked to the authenticated user
- Policies ensure users can:
  - Read only their own bookmarks
  - Insert their own bookmarks
  - Delete only their own bookmarks

This guarantees that **User A cannot see or modify User B’s bookmarks**.

---

## 🗃 Database Schema

**Table: `bookmarks`**

| Column       | Type      | Description |
|-------------|----------|-------------|
| id          | uuid     | Primary key |
| title       | text     | Bookmark title |
| url         | text     | Bookmark URL |
| user_id     | uuid     | References authenticated user |
| created_at | timestamp | Auto-generated |

---

## ⚙️ Environment Variables

Create a `.env.local` file with the following:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
