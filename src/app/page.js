"use client";

import { useEffect, useState, useCallback } from "react";
import { useSupabase } from "../context/SupabaseProvider";

export default function Home() {
  const { supabase, session, user, loading } = useSupabase();

  const [bookmarks, setBookmarks] = useState([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  /* ---------------- FETCH BOOKMARKS ---------------- */

  const fetchBookmarks = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error) {
      setBookmarks(data);
    }
  }, [supabase, user]);

  /* ---------------- REALTIME ---------------- */

  useEffect(() => {
    if (!user) return;
  
    fetchBookmarks();
  
    const channel = supabase
      .channel("realtime-bookmarks")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${user.id}`,
        },
        fetchBookmarks
      )
      .subscribe();
  
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);
  

  /* ---------------- ADD BOOKMARK ---------------- */

  const addBookmark = async () => {
    setError(null);
  
    if (!title || !url) {
      setError("Title and URL are required");
      return;
    }
  
    try {
      new URL(url);
    } catch {
      setError("Invalid URL format");
      return;
    }
  
    setSubmitting(true);
  
    const { data, error } = await supabase
      .from("bookmarks")
      .insert([
        {
          title,
          url,
          user_id: user.id,
        },
      ])
      .select(); // VERY IMPORTANT
  
    if (error) {
      setError(error.message);
    } else if (data) {
      setBookmarks((prev) => [data[0], ...prev]);
    }
  
    setTitle("");
    setUrl("");
    setSubmitting(false);
  };
  

  /* ---------------- DELETE BOOKMARK ---------------- */

  const deleteBookmark = async (id) => {
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id);
  
    if (error) {
      setError(error.message);
    } else {
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
    }
  };
  

  /* ---------------- AUTH ---------------- */

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  /* ---------------- UI ---------------- */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-indigo-100">
        <p className="text-lg text-gray-600 animate-pulse">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 to-blue-600 text-white px-4">
        <h1 className="text-5xl font-extrabold mb-4">Smart Bookmark</h1>
        <p className="text-lg opacity-90 mb-8 text-center">
          Save, organize and access your favorite links.
        </p>

        <button
          onClick={loginWithGoogle}
          className="bg-white text-indigo-600 font-semibold px-8 py-3 rounded-2xl shadow-lg hover:scale-105 transition"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Smart Bookmarks
            </h1>
            <p className="text-gray-500 mt-1">
              Organize your web like a pro.
            </p>
          </div>

          <button
            onClick={logout}
            className="px-5 py-2 rounded-xl bg-red-500 text-white font-medium shadow-md hover:shadow-lg hover:scale-105 transition"
          >
            Logout
          </button>
        </div>

        {/* Add Bookmark */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-xl rounded-2xl p-6 mb-8">
          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Bookmark title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="p-3 rounded-xl border text-black border-gray-200 focus:ring-2 focus:ring-indigo-400 outline-none transition"
            />

            <input
              type="text"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="p-3 rounded-xl border text-black border-gray-200 focus:ring-2 focus:ring-indigo-400 outline-none transition"
            />
          </div>

          <button
            onClick={addBookmark}
            disabled={submitting}
            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-50"
          >
            {submitting ? "Adding..." : "Add Bookmark"}
          </button>
        </div>

        {/* Bookmark List */}
        <div className="space-y-4">
          {bookmarks.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-4">📂</div>
              <p className="text-lg font-medium">No bookmarks yet</p>
              <p className="text-sm">Start building your collection.</p>
            </div>
          )}

          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="group bg-white/80 backdrop-blur-xl border border-gray-200 p-5 rounded-2xl shadow-md hover:shadow-xl transition hover:-translate-y-1 flex justify-between items-center"
            >
              <div className="overflow-hidden">
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-semibold text-indigo-600 group-hover:underline"
                >
                  {bookmark.title}
                </a>
                <p className="text-xs text-gray-500 truncate max-w-md">
                  {bookmark.url}
                </p>
              </div>

              <button
                onClick={() => deleteBookmark(bookmark.id)}
                className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
