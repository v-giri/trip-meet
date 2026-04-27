'use client'

import { useState, useEffect } from 'react'
import { createClient } from '../../lib/supabase'
import TourCard from '../../components/tours/TourCard'
import { Search, SlidersHorizontal, MapPin } from 'lucide-react'

export default function ToursPage() {
  const [tours, setTours] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [sortOption, setSortOption] = useState('price-low') // price-low, price-high, duration
  const [isDomestic, setIsDomestic] = useState<boolean | null>(null) // null = all, true = domestic, false = intl

  const supabase = createClient()

  useEffect(() => {
    async function fetchTours() {
      setLoading(true)
      const { data, error } = await supabase
        .from('tours')
        .select('*')
        .eq('is_active', true)
        
      if (!error && data) {
        setTours(data)
      }
      setLoading(false)
    }
    fetchTours()
  }, [])

  // Derived state for filtering
  let filteredTours = tours.filter(tour => {
    // Search match
    const searchMatch = (tour.title?.toLowerCase().includes(searchQuery.toLowerCase())) || 
                        (tour.destination?.toLowerCase().includes(searchQuery.toLowerCase()))
    
    // Category match
    const categoryMatch = category === 'All' || tour.category === category.toLowerCase()
    
    // Domestic match
    const domesticMatch = isDomestic === null || tour.is_domestic === isDomestic

    return searchMatch && categoryMatch && domesticMatch
  })

  // Sorting
  filteredTours = filteredTours.sort((a, b) => {
    if (sortOption === 'price-low') return (a.price_per_person || 0) - (b.price_per_person || 0)
    if (sortOption === 'price-high') return (b.price_per_person || 0) - (a.price_per_person || 0)
    if (sortOption === 'duration') return (a.duration_days || 0) - (b.duration_days || 0)
    return 0
  })

  // Skeletons
  const TourCardSkeleton = () => (
    <div className="border border-gray-100 shadow-sm rounded-2xl bg-white overflow-hidden animate-pulse">
      <div className="h-56 bg-gray-200"></div>
      <div className="p-5 space-y-4">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
        <div className="h-12 bg-gray-200 rounded-xl mt-4"></div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="mb-10 text-center md:text-left md:flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Explore Tours</h1>
            <p className="text-lg text-gray-600">Find your next perfect getaway from our curated collections.</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-10 flex flex-col lg:flex-row gap-4 items-center justify-between">
          
          {/* Search */}
          <div className="relative w-full lg:w-1/3">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search destinations, titles..." 
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
            {['All', 'Family', 'Honeymoon', 'Group', 'Student'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition whitespace-nowrap ${category === cat ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort & Toggles */}
          <div className="flex gap-4 w-full lg:w-auto items-center">
            <select 
              className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-auto bg-white"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="duration">Duration: Shortest</option>
            </select>
            
            <div className="flex bg-gray-100 rounded-xl p-1 border">
              <button 
                onClick={() => setIsDomestic(isDomestic === true ? null : true)}
                className={`px-4 py-1.5 text-sm font-bold rounded-lg transition ${isDomestic === true ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Domestic
              </button>
              <button 
                onClick={() => setIsDomestic(isDomestic === false ? null : false)}
                className={`px-4 py-1.5 text-sm font-bold rounded-lg transition ${isDomestic === false ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Global
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <TourCardSkeleton />
            <TourCardSkeleton />
            <TourCardSkeleton />
            <TourCardSkeleton />
            <TourCardSkeleton />
            <TourCardSkeleton />
          </div>
        ) : filteredTours.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTours.map(tour => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-300 shadow-sm">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No tours found</h3>
            <p className="text-gray-500 text-lg">We couldn't find any active tours matching your exact filters.</p>
            <button onClick={() => { setSearchQuery(''); setCategory('All'); setIsDomestic(null); }} className="mt-8 text-white bg-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition">
              Clear all filters
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
