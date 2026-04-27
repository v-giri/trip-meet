'use client'

import type { Metadata } from 'next'
import { useState } from 'react'
import { Mail, MessageCircle, MapPin, Send, CheckCircle } from 'lucide-react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate send — wire to your backend / Resend / Formspree as needed
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-gray-500 text-xl">We'd love to hear from you. Our team usually responds within 2 hours.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Cards */}
          <div className="space-y-6">
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer"
              className="flex items-start gap-4 bg-green-50 border border-green-100 hover:border-green-300 p-6 rounded-2xl transition group shadow-sm">
              <div className="w-12 h-12 bg-green-500 text-white rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">WhatsApp</h3>
                <p className="text-gray-500 text-sm mt-1">Chat with us instantly</p>
                <p className="font-semibold text-green-700 mt-1">+91 98765 43210</p>
              </div>
            </a>

            <div className="flex items-start gap-4 bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Email</h3>
                <p className="text-gray-500 text-sm mt-1">We respond within 2–4 hours</p>
                <p className="font-semibold text-blue-700 mt-1">hello@tripmeet.in</p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
              <div className="w-12 h-12 bg-gray-100 text-gray-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Office</h3>
                <p className="text-gray-500 text-sm mt-1">91springboard, Koramangala</p>
                <p className="font-semibold text-gray-700 mt-1">Bengaluru, Karnataka 560034</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            {sent ? (
              <div className="text-center py-16">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-500">We'll get back to you within 2–4 hours.</p>
                <button onClick={() => setSent(false)} className="mt-6 text-blue-600 hover:underline font-medium">Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Your Name *</label>
                    <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ravi Kumar" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
                    <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="you@example.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Subject *</label>
                  <input required value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Booking query, Partnership, etc." />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Message *</label>
                  <textarea required rows={6} value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Tell us how we can help…" />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 rounded-2xl shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50">
                  <Send className="w-5 h-5" /> {loading ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
