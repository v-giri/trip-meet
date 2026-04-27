'use client'

import Link from 'next/link'
import { Heart, MapPin, Clock, Star } from 'lucide-react'
import { useState } from 'react'

interface TourCardProps {
  tour: any
}

export default function TourCard({ tour }: TourCardProps) {
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault()
    // TODO: Connect to wishlists table in Supabase
    setIsSaved(!isSaved)
  }

  const categoryColors: Record<string, string> = {
    'family': 'bg-orange-100 text-orange-700',
    'honeymoon': 'bg-pink-100 text-pink-700',
    'group': 'bg-blue-100 text-blue-700',
    'student': 'bg-green-100 text-green-700',
  }

  const badgeClass = tour.category ? categoryColors[tour.category.toLowerCase()] || 'bg-gray-100 text-gray-700' : 'bg-gray-100 text-gray-700'

  return (
    <Link href={`/tours/${tour.slug || tour.id}`} className="group border border-gray-200 rounded-2xl bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
      <div className="relative h-56 w-full bg-gray-200 overflow-hidden">
        {tour.images && tour.images.length > 0 ? (
          <img src={tour.images[0]} alt={tour.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex justify-center items-center text-gray-400 bg-gray-100 flex-col">
            <MapPin className="w-8 h-8 mb-2 opacity-50" />
            <span>No Image</span>
          </div>
        )}
        <button 
          onClick={handleSave} 
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 transition-transform"
          aria-label="Save to wishlist"
        >
          <Heart className={`w-5 h-5 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-500 hover:text-red-500'}`} />
        </button>
        {tour.category && (
          <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${badgeClass}`}>
            {tour.category}
          </div>
        )}
      </div>
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-xl text-gray-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
              {tour.title}
            </h3>
          </div>
          <p className="text-gray-500 text-sm mb-4 line-clamp-2">
            {tour.short_description || tour.description}
          </p>
          <div className="grid grid-cols-2 gap-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
              <span className="truncate">{tour.destination}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
              <span>{tour.duration_days} Days</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Star className="w-4 h-4 mr-2 text-yellow-400 fill-current flex-shrink-0" />
              <span>4.8 <span className="text-gray-400">(24)</span></span>
            </div>
            <div className="flex items-center text-sm text-gray-600 font-medium">
              <span className="text-gray-400 mr-2">From</span>
              <span className="font-bold text-lg text-gray-900">₹{tour.price_per_person?.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
        <div className="w-full bg-blue-50 text-blue-700 font-bold py-3 mt-2 rounded-xl text-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
          View Details
        </div>
      </div>
    </Link>
  )
}
