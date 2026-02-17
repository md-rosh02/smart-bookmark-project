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

🚧 Problems Faced & How I Solved Them

During the development and deployment of this project, I encountered several real-world issues related to authentication, routing, real-time updates, styling, and deployment. Below are the key problems and how I resolved them.

1️⃣ Google OAuth Redirect Resulted in 404 Error

Problem:
After logging in with Google, the application redirected to /auth/callback and showed a 404 NOT FOUND page.

Cause:
Supabase redirects OAuth logins to /auth/callback by default, but this route did not exist in the Next.js App Router.

Solution:
I created the required route using the App Router:

src/app/auth/callback/page.js


This page completes the authentication process and redirects the user back to the home page.

2️⃣ Hydration Mismatch Warning in Development

Problem:
React showed a hydration mismatch warning during development.

Cause:
A browser extension injected attributes into the <body> element before React hydration.

Solution:
I added suppressHydrationWarning to the <body> tag in layout.js, which safely resolved the warning without affecting production behavior.

3️⃣ Bookmark Deletion Failed with 400 Error

Problem:
Deleting a bookmark sometimes failed with a 400 error from Supabase.

Cause:
An optimistic UI update initially used temporary IDs, which did not match the actual database record IDs.

Solution:
I removed temporary IDs and used the real ID returned by Supabase by calling .select() after inserting a bookmark, ensuring delete operations always used valid IDs.

4️⃣ Real-Time Updates Were Not Syncing Consistently

Problem:
Bookmarks added in one tab were not always reflected in another tab.

Cause:
The bookmarks table was not enabled for real-time replication, and WebSocket connections were restarting during development hot reloads.

Solution:
I enabled real-time replication for the bookmarks table in Supabase and scoped real-time subscriptions by user_id.

5️⃣ Tailwind CSS Styles Were Not Applied

Problem:
The UI rendered correctly, but Tailwind CSS styles were missing.

Cause:
Incorrect content paths in tailwind.config.js when using the src/app directory structure.

Solution:
I updated the Tailwind configuration to include:

./src/app/**/*.{js,jsx}


and ensured globals.css was properly imported in layout.js.

6️⃣ Git & Deployment Issues During Submission

Problem:
Git push errors (non-fast-forward) and initial 404 errors on Vercel deployment.

Cause:
Remote repository history mismatch and incorrect Vercel root directory configuration.

Solution:
I resolved Git conflicts using git pull --rebase, ensured the root directory was set to ./ in Vercel, and redeployed the application successfully.
