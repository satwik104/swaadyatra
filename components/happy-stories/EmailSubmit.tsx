"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { useFormSubmit } from "@/hooks/useFormSubmit";

type StoryForm = { name: string; email: string; story: string };

export default function EmailSubmit() {
  const [form, setForm] = useState<StoryForm>({ name: "", email: "", story: "" });

  const { status, apiMessage, submit } = useFormSubmit<StoryForm>({
    url: "/api/story",
    headers: { "Content-Type": "application/json" },
    onSuccess: () => setForm({ name: "", email: "", story: "" }),
    buildBody: (data) => JSON.stringify(data),
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    submit(form);
  }

  return (
    <section className="relative overflow-hidden py-20 px-4 story-submit-bg">
      {/* Animated blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full opacity-30 contact-blob-red float-a" />
        <div className="absolute -bottom-10 -left-10 w-56 h-56 rounded-full opacity-20 contact-blob-red float-b" />
        <div className="absolute top-1/2 right-[15%] w-28 h-28 rounded-full opacity-20 contact-blob-red float-c" />
        <div className="absolute top-[20%] left-[10%] w-14 h-14 rounded-full opacity-20 contact-blob-red float-b1" />
      </div>

      <div className="relative z-10 max-w-xl mx-auto text-center">
        <span className="inline-block bg-[#E23744]/10 border border-[#E23744]/20 text-[#E23744] text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
          Share Your Story
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
          Have an amazing food travel experience?
        </h2>
        <p className="text-gray-600 mb-8 text-lg">
          Write it below — we'll reach out if we'd like to feature your story.
        </p>

        {status === "success" ? (
          <div className="bg-white rounded-2xl px-8 py-6 text-gray-800 font-semibold text-lg shadow-md">
            🎉 Thanks! We'll be in touch soon.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              className="w-full px-5 py-3.5 rounded-2xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/60 shadow-md"
            />
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="Your email address"
              className="w-full px-5 py-3.5 rounded-2xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/60 shadow-md"
            />
            <textarea
              name="story"
              required
              value={form.story}
              onChange={handleChange}
              placeholder="Tell us about your food experience — which city, what dish, what made it special..."
              rows={5}
              className="w-full px-5 py-3.5 rounded-2xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/60 shadow-md resize-none"
            />
            {status === "error" && (
              <p className="text-white bg-white/20 rounded-xl px-4 py-2 text-sm">{apiMessage}</p>
            )}
            <button
              type="submit"
              disabled={status === "loading"}
              className="flex items-center justify-center gap-2 bg-[#E23744] hover:bg-[#c72d38] disabled:opacity-60 text-white font-semibold px-7 py-3.5 rounded-full transition-all duration-300 hover:scale-105 shadow-md"
            >
              <Send className="w-4 h-4" />
              {status === "loading" ? "Submitting..." : "Submit Your Story"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
