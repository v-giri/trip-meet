import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin } from 'lucide-react'

export const metadata: Metadata = { title: 'Page Not Found | TripMeet' }

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-20 text-center">
      <div className="w-24 h-24 bg-blue-50 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-8">
        <MapPin className="w-12 h-12" />
      </div>
      <h1 className="text-8xl font-extrabold text-gray-200 mb-4">404</h1>
      <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Destination Not Found</h2>
      <p className="text-gray-500 text-lg max-w-md mx-auto mb-10">
        Looks like you've wandered off the map! This page doesn't exist or may have been moved.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link href="/" className="bg-blue-600 text-white font-bold px-8 py-4 rounded-2xl hover:bg-blue-700 transition shadow-md">
          Back to Home
        </Link>
        <Link href="/tours" className="bg-white text-gray-700 font-bold px-8 py-4 rounded-2xl border border-gray-200 hover:bg-gray-50 transition shadow-sm">
          Explore Tours
        </Link>
      </div>
    </div>
  )
}
