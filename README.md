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


### 🔐 Row Level Security (RLS)

Enabled to ensure:
- Users can read only their own bookmarks
- Users can insert only their own bookmarks
- Users can delete only their own bookmarks

---

## 🚧 Problems Faced & How I Solved Them

This project involved multiple real-world issues related to authentication, routing, real-time updates, styling, and deployment.

---

### 1️⃣ Google OAuth Redirect Caused 404 Error

**Problem:**  
After logging in with Google, the app redirected to `/auth/callback` and showed a **404 NOT FOUND** error.

**Cause:**  
Supabase redirects OAuth users to `/auth/callback` by default, but this route did not exist in the Next.js App Router.

**Solution:**  
Created the required route:

src/app/auth/callback/page.js


This route completes the OAuth flow and redirects the user back to the homepage.

---

### 2️⃣ Hydration Mismatch Warning in Development

**Problem:**  
React showed a hydration mismatch warning during development.

**Cause:**  
A browser extension injected attributes into the `<body>` tag before React hydration.

**Solution:**  
Used `suppressHydrationWarning` on the `<body>` element in `layout.js`.  
This resolved the warning without affecting production.

---

### 3️⃣ Bookmark Deletion Returned 400 Error

**Problem:**  
Deleting a bookmark sometimes returned a **400 error** from Supabase.

**Cause:**  
Temporary IDs were used for optimistic UI updates, which did not match actual database IDs.

**Solution:**  
Removed fake IDs and used the real ID returned by Supabase using `.select()` after insertion.

---

### 4️⃣ Realtime Updates Were Not Syncing Across Tabs

**Problem:**  
Changes in one tab were not reflected in another.

**Cause:**  
The `bookmarks` table was not enabled for realtime replication.

**Solution:**  
Enabled realtime replication in Supabase and scoped realtime subscriptions by `user_id`.

---

### 5️⃣ Tailwind CSS Styles Were Not Applied

**Problem:**  
The UI rendered without Tailwind styles.

**Cause:**  
Incorrect `content` paths in `tailwind.config.js` when using the `src/app` directory.

**Solution:**  
Updated Tailwind configuration to include:

./src/app/**/*.{js,jsx}


and ensured `globals.css` was imported in `layout.js`.

---

## ⚡ Real-Time Implementation

- Supabase Realtime channels used
- Subscribed to INSERT and DELETE events
- Filtered updates by authenticated user
- UI updates instantly without refresh

---

## 🧠 What I Learned

- Handling OAuth with Next.js App Router
- Using Supabase Row Level Security
- Managing realtime subscriptions
- Debugging hydration issues
- Deploying OAuth-based apps to Vercel

---

## 🏁 Conclusion

This project demonstrates secure authentication, private per-user data access, real-time updates, and a production-ready deployment workflow.  
All assignment requirements have been successfully implemented.

---
