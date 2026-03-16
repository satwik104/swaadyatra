"use client";

import { useState } from "react";
import VendorSection from "@/components/VendorSection";
import { MessageCircle, ChevronDown, Send } from "lucide-react";
import { useFormSubmit } from "@/hooks/useFormSubmit";

const faqs = [
  {
    q: "How can I suggest a food spot?",
    a: "Fill out the contact form with the subject 'Food Spot Suggestion' and share the name, city, and a brief description. Our team reviews every suggestion.",
  },
  {
    q: "How can restaurants get listed on SwaadYatra?",
    a: "Use the 'Apply For Listing' button or write to business@swaadyatra.com. We verify each listing to ensure quality and authenticity for our travellers.",
  },
  {
    q: "Is SwaadYatra free for travelers?",
    a: "Yes! SwaadYatra is completely free for travelers. Discover famous food spots, get directions, and explore food travel in India at no cost.",
  },
  {
    q: "How do you select food spots?",
    a: "Our team researches local recommendations, traveller reviews, and cultural significance. We prioritise authentic, locally loved spots over tourist traps.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-900 text-lg pr-4">{q}</span>
        <ChevronDown
          className={`w-5 h-5 text-[#E23744] flex-shrink-0 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="px-6 pb-5 text-gray-500 text-base leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

type FormState = { name: string; email: string; city: string; subject: string; message: string };

function ContactForm() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", city: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Partial<FormState>>({});

  const validate = (): Partial<FormState> => {
    const e: Partial<FormState> = {};
    if (!form.name.trim()) e.name = "Full name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.city.trim()) e.city = "City is required.";
    if (!form.subject.trim()) e.subject = "Subject is required.";
    if (!form.message.trim()) e.message = "Message cannot be empty.";
    return e;
  };

  const { status, apiMessage, submit, reset } = useFormSubmit<FormState>({
    url: "/api/contact",
    headers: { "Content-Type": "application/json" },
    onSuccess: () => { setForm({ name: "", email: "", city: "", subject: "", message: "" }); setErrors({}); },
    buildBody: (data) => JSON.stringify({
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: `City: ${data.city}\n\n${data.message}`,
    }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    submit(form);
  };

  const field = (id: keyof FormState, label: string, type = "text", placeholder = "") => (
    <div>
      <label htmlFor={id} className="block text-base font-semibold text-gray-700 mb-2">{label}</label>
      <input
        id={id} type={type} value={form[id]} placeholder={placeholder}
        onChange={(e) => { setForm(f => ({ ...f, [id]: e.target.value })); setErrors(er => ({ ...er, [id]: undefined })); }}
        className={`w-full px-4 py-3 rounded-xl border text-base focus:outline-none focus:ring-2 focus:ring-[#E23744] focus:border-transparent transition-all ${
          errors[id] ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
        }`}
      />
      {errors[id] && <p className="text-red-500 text-sm mt-1">{errors[id]}</p>}
    </div>
  );

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 md:p-10">
      {status === "success" ? (
        <div className="text-center py-10">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-7 h-7 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
          <p className="text-gray-500 text-base">{apiMessage}</p>
          <button onClick={reset} className="mt-5 text-[#E23744] font-semibold hover:underline text-base">
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {status === "error" && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              <span className="mt-0.5">⚠️</span>
              <span>{apiMessage}</span>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {field("name", "Full Name", "text", "Your full name")}
            {field("email", "Email Address", "email", "you@example.com")}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {field("city", "City", "text", "e.g. Delhi, Varanasi")}
            {field("subject", "Subject", "text", "What is this about?")}
          </div>
          <div>
            <label htmlFor="message" className="block text-base font-semibold text-gray-700 mb-2">Message</label>
            <textarea
              id="message" rows={4} value={form.message} placeholder="Tell us more..."
              onChange={(e) => { setForm(f => ({ ...f, message: e.target.value })); setErrors(er => ({ ...er, message: undefined })); }}
              className={`w-full px-4 py-3 rounded-xl border text-base focus:outline-none focus:ring-2 focus:ring-[#E23744] focus:border-transparent transition-all resize-none ${
                errors.message ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
              }`}
            />
            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
          </div>
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-[#E23744] hover:bg-[#c72d38] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 text-base"
          >
            {status === "loading" ? (
              <><span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />Sending...</>
            ) : (
              <><Send className="w-5 h-5" />Send Message</>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ContactPageClient() {
  return (
    <>
      {/* ── 1. HERO ── */}
      <section className="relative overflow-hidden py-16 md:py-24 contact-hero-bg">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full opacity-30 contact-blob-red float-a" />
          <div className="absolute -bottom-10 -left-10 w-56 h-56 rounded-full opacity-20 contact-blob-red float-b" />
          <div className="absolute top-1/2 right-[15%] w-28 h-28 rounded-full opacity-25 contact-blob-yellow float-c" />
          <div className="absolute top-[20%] left-[10%] w-14 h-14 rounded-full opacity-20 contact-blob-red float-b1" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-[#E23744]/10 border border-[#E23744]/20 rounded-full px-5 py-2 mb-6">
            <MessageCircle className="w-4 h-4 text-[#E23744]" />
            <span className="text-[#E23744] text-sm font-bold tracking-wide uppercase">Contact Us</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 leading-tight">
            Get In Touch With{" "}
            <span className="text-[#E23744]">SwaadYatra</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            Have a question, want to suggest a famous food spot, or want to list your food shop?
            We would love to hear from you.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-14 bg-white pointer-events-none contact-hero-clip" />
      </section>

      {/* ── 2. CONTACT FORM ── */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-6 max-w-2xl">
          <ContactForm />
        </div>
      </section>

      {/* ── 3. VENDOR LISTING FORM ── */}
      <div id="vendor-listing">
        <VendorSection />
      </div>

      {/* ── 4. FAQ ── */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                Frequently Asked <span className="text-[#E23744]">Questions</span>
              </h2>
              <p className="text-gray-500 text-lg">Quick answers about our food travel platform.</p>
            </div>
            <div className="space-y-3">
              {faqs.map((faq) => <FAQItem key={faq.q} q={faq.q} a={faq.a} />)}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
