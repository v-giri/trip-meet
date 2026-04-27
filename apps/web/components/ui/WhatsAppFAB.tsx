'use client'

import { MessageCircle } from 'lucide-react'

export default function WhatsAppFAB() {
  return (
    <a
      href="https://wa.me/919876543210?text=Hi%2C%20I%20need%20help%20with%20TripMeet!"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-green-200 group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 flex-shrink-0" />
      <span className="text-sm max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
        Chat with us
      </span>
    </a>
  )
}
