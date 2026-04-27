'use client'

import { MapPin } from 'lucide-react'

export default function GemCard({ gem, onClick }: { gem: any; onClick?: () => void }) {
  return (
    <div 
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer"
      onClick={onClick}
    >
      <div className="h-48 relative">
        {gem.images?.[0] ? (
          <img src={gem.images[0]} alt={gem.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">
            <MapPin className="w-8 h-8" />
          </div>
        )}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-xs font-bold capitalize shadow-sm text-gray-800">
          {gem.category}
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">{gem.name}</h3>
        <p className="text-gray-500 text-sm flex items-center gap-1.5 mb-3">
          <MapPin className="w-3.5 h-3.5" /> {gem.nearest_city}
        </p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs font-medium text-gray-400">
            {gem.estimated_cost ? `${gem.estimated_cost}` : 'Cost varies'}
          </span>
          <span className="text-blue-600 text-sm font-bold hover:underline">
            View Details
          </span>
        </div>
      </div>
    </div>
  )
}
