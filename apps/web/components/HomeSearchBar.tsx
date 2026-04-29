'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Calendar, Users, Search } from 'lucide-react'

export default function HomeSearchBar() {
  const router = useRouter()
  const [destination, setDestination] = useState('')
  const [date, setDate] = useState('')
  const [travelers, setTravelers] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (destination.trim()) params.set('q', destination.trim())
    if (date) params.set('date', date)
    if (travelers) params.set('travelers', travelers)
    router.push(`/tours?${params.toString()}`)
  }

  return (
    <section className="max-w-5xl mx-auto px-4 -mt-20 relative z-20 mb-16">
      <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 border border-gray-100">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Destination</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Where to?"
                value={destination}
                onChange={e => setDestination(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Dates</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400 pointer-events-none z-10" />
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50 text-gray-700 cursor-pointer"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Travelers</label>
            <div className="relative">
              <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
              <input
                type="number"
                min="1"
                max="50"
                placeholder="Guests"
                value={travelers}
                onChange={e => setTravelers(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-bold flex items-center justify-center transition shadow-md w-full hover:-translate-y-0.5 active:translate-y-0"
          >
            <Search className="w-5 h-5 mr-2" />
            Search Tours
          </button>
        </form>
      </div>
    </section>
  )
}
