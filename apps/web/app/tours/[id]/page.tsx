'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '../../../lib/supabase'
import { MapPin, Clock, Star, Check, X, ChevronDown, ChevronUp, Share2, Heart, MessageCircle } from 'lucide-react'
import CustomTourModal from '../../../components/tours/CustomTourModal'
import TourCard from '../../../components/tours/TourCard'

export default function TourDetailPage() {
  const params = useParams()
  const idOrSlug = params.id as string
  const [tour, setTour] = useState<any>(null)
  const [relatedTours, setRelatedTours] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  const [activeTab, setActiveTab] = useState('Overview')
  const [mainImage, setMainImage] = useState<string | null>(null)
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({ 0: true })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function loadData() {
      if (!idOrSlug) return

      const { data, error } = await supabase
        .from('tours')
        .select('*')
        .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
        .maybeSingle()
        
      if (error || !data) {
        setLoading(false)
        return
      }
      
      setTour(data)
      if (data.images && data.images.length > 0) {
        setMainImage(data.images[0])
      }
      
      // Fetch related
      if (data.category) {
        const { data: related } = await supabase
          .from('tours')
          .select('*')
          .eq('category', data.category)
          .neq('id', data.id)
          .limit(3)
        if (related) setRelatedTours(related)
      }
      
      setLoading(false)
    }
    loadData()
  }, [idOrSlug])

  const toggleDay = (idx: number) => {
    setExpandedDays(prev => ({ ...prev, [idx]: !prev[idx] }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-12 px-4 flex justify-center mt-20 animate-pulse">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-[500px] bg-gray-200 rounded-3xl w-full"></div>
            <div className="h-20 bg-gray-200 rounded-xl w-full"></div>
            <div className="h-64 bg-gray-200 rounded-xl w-full mt-10"></div>
          </div>
          <div className="lg:col-span-1">
            <div className="h-96 bg-gray-200 rounded-3xl w-full sticky top-24"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!tour) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <MapPin className="w-16 h-16 text-gray-300 mb-4" />
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Tour Not Found</h1>
        <p className="text-gray-500 mb-8">The trip you are looking for might have been removed or doesn't exist.</p>
        <Link href="/tours" className="bg-blue-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-700 transition">
          Browse all tours
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* 1. Header & Gallery Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          
          <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <span className="uppercase tracking-wider font-bold text-xs bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full">
                  {tour.category || 'General'}
                </span>
                <span className="text-sm font-medium text-gray-500 flex items-center">
                  <MapPin className="w-4 h-4 mr-1 text-gray-400" /> {tour.destination}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                {tour.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 mt-5 text-sm md:text-base">
                <div className="flex items-center text-gray-700 font-medium">
                  <Clock className="w-5 h-5 mr-2 text-blue-500" />
                  {tour.duration_days} Days
                </div>
                <div className="flex items-center text-gray-700 font-medium">
                  <Star className="w-5 h-5 mr-1 text-yellow-400 fill-current" />
                  <span className="font-bold text-gray-900 mr-1.5">4.8</span>
                  <span className="text-gray-500 underline decoration-dotted cursor-pointer hover:text-blue-600">(124 reviews)</span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button className="p-3.5 bg-gray-100 rounded-full hover:bg-gray-200 transition text-gray-700 shadow-sm" title="Share this tour">
                <Share2 className="w-5 h-5" />
              </button>
              <button 
                className="p-3.5 bg-gray-100 rounded-full hover:bg-red-50 hover:text-red-600 transition shadow-sm" 
                onClick={() => setIsSaved(!isSaved)}
                title={isSaved ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'text-red-500 fill-current scale-110 shadow-sm' : 'text-gray-700'} transition-all`} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-3 h-80 md:h-[500px] bg-gray-200 rounded-3xl overflow-hidden relative shadow-sm">
              {mainImage ? (
                <img src={mainImage} className="w-full h-full object-cover" alt={tour.title} />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                  <MapPin className="w-12 h-12 mb-2 opacity-30" />
                  <span>No Image Available</span>
                </div>
              )}
            </div>
            <div className="hidden lg:flex flex-col gap-4">
              {tour.images?.slice(1, 4).map((img: string, i: number) => (
                <button key={i} onClick={() => setMainImage(img)} className="h-[calc(33.33%-10px)] w-full bg-gray-200 rounded-2xl overflow-hidden border-2 border-transparent hover:border-blue-500 focus:outline-none transition shadow-sm">
                  <img src={img} className="w-full h-full object-cover" alt={`Thumbnail ${i}`} />
                </button>
              ))}
              {(!tour.images || tour.images.length <= 1) && (
                <div className="h-full w-full bg-gray-50 rounded-2xl flex items-center justify-center text-sm font-medium text-gray-400 italic text-center p-4 border border-dashed border-gray-200">
                  Additional images not available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 xl:gap-16">
          
          {/* Main Content (Left) */}
          <div className="lg:col-span-2">
            
            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-10 overflow-x-auto no-scrollbar">
              {['Overview', 'Itinerary', 'Inclusions', 'Gallery'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-4 font-bold text-lg whitespace-nowrap border-b-4 transition-all ${activeTab === tab ? 'border-blue-600 text-blue-700 bg-blue-50/50 rounded-t-lg' : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="min-h-[400px]">
              {/* Overview Tab */}
              {activeTab === 'Overview' && (
                <div className="animate-in fade-in space-y-8">
                  <h2 className="text-3xl font-extrabold text-gray-900">About this journey</h2>
                  <div className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                    {tour.description || "Detailed description is not available right now. Please check back later or contact us for more information."}
                  </div>
                </div>
              )}

              {/* Itinerary Tab */}
              {activeTab === 'Itinerary' && (
                <div className="animate-in fade-in space-y-8 relative">
                  <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Detailed Itinerary</h2>
                  {tour.itinerary && Array.isArray(tour.itinerary) && tour.itinerary.length > 0 ? (
                    <div className="border-l-2 border-dashed border-gray-300 ml-5 space-y-10">
                      {tour.itinerary.map((day: any, idx: number) => (
                        <div key={idx} className="relative pl-10">
                          <div className="absolute -left-[21px] top-1 w-10 h-10 rounded-full bg-blue-100 border-4 border-gray-50 flex items-center justify-center text-blue-700 font-bold text-base shadow-sm">
                            {day.day || idx + 1}
                          </div>
                          <div className={`bg-white border rounded-2xl overflow-hidden transition-all ${expandedDays[idx] ? 'shadow-md border-blue-100' : 'hover:shadow-md'}`}>
                            <button
                              onClick={() => toggleDay(idx)}
                              className="w-full text-left px-8 py-6 flex justify-between items-center focus:outline-none"
                            >
                              <h3 className="font-bold text-xl text-gray-900 pr-4">Day {day.day || idx + 1}: {day.title}</h3>
                              <div className={`p-2 rounded-full transition-colors ${expandedDays[idx] ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100'}`}>
                                {expandedDays[idx] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                              </div>
                            </button>
                            {expandedDays[idx] && (
                              <div className="px-8 pb-8 pt-2 border-t border-gray-100 text-gray-700 text-lg">
                                <p className="mb-6 leading-relaxed text-gray-600">{day.description}</p>
                                {day.activities && day.activities.length > 0 && (
                                  <div>
                                    <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">Key Activities</h4>
                                    <ul className="space-y-3">
                                      {day.activities.map((act: string, aIdx: number) => (
                                        <li key={aIdx} className="flex items-start">
                                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-2.5 mr-4 flex-shrink-0"></div>
                                          <span className="text-gray-700">{act}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white border border-dashed border-gray-300 p-8 text-center rounded-2xl text-gray-600 text-lg">
                      Itinerary details are not fully finalized yet. Please contact us or download the brochure for complete day-wise information.
                    </div>
                  )}
                </div>
              )}

              {/* Inclusions Tab */}
              {activeTab === 'Inclusions' && (
                <div className="animate-in fade-in grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="bg-green-50/50 p-8 rounded-3xl border border-green-100">
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-8 flex items-center">
                      <span className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4 shadow-sm border border-green-200">
                        <Check className="w-6 h-6 text-green-600" />
                      </span>
                      What's Included
                    </h2>
                    <ul className="space-y-5">
                      {tour.inclusions?.length > 0 ? tour.inclusions.map((inc: string, i: number) => (
                        <li key={i} className="flex items-start text-gray-800 text-lg">
                          <Check className="w-6 h-6 text-green-500 mr-4 mt-0.5 flex-shrink-0" />
                          <span>{inc}</span>
                        </li>
                      )) : (
                        <li className="text-gray-500 italic">No specific inclusions defined.</li>
                      )}
                    </ul>
                  </div>
                  <div className="bg-red-50/50 p-8 rounded-3xl border border-red-100">
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-8 flex items-center">
                      <span className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-4 shadow-sm border border-red-200">
                        <X className="w-6 h-6 text-red-600" />
                      </span>
                      What's Excluded
                    </h2>
                    <ul className="space-y-5">
                      {tour.exclusions?.length > 0 ? tour.exclusions.map((exc: string, i: number) => (
                        <li key={i} className="flex items-start text-gray-800 text-lg">
                          <X className="w-6 h-6 text-red-400 mr-4 mt-0.5 flex-shrink-0" />
                          <span>{exc}</span>
                        </li>
                      )) : (
                        <li className="text-gray-500 italic">No specific exclusions defined.</li>
                      )}
                    </ul>
                  </div>
                </div>
              )}

              {/* Gallery Tab */}
              {activeTab === 'Gallery' && (
                <div className="animate-in fade-in">
                  <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Photo Gallery</h2>
                  {tour.images?.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      {tour.images.map((img: string, i: number) => (
                        <div key={i} className="h-56 bg-gray-200 rounded-3xl overflow-hidden cursor-pointer hover:opacity-80 transition shadow-sm hover:shadow-md" onClick={() => setMainImage(img)}>
                          <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white border border-dashed border-gray-300 p-8 text-center rounded-2xl text-gray-500 italic text-lg">
                      No gallery images available right now.
                    </div>
                  )}
                </div>
              )}
            </div>
            
          </div>

          {/* Sidebar / Pricing (Right) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 p-8 sticky top-24">
              <div className="flex items-end mb-6">
                <span className="text-5xl font-extrabold text-gray-900 tracking-tight">₹{tour.price_per_person?.toLocaleString('en-IN') || 'TBD'}</span>
                <span className="text-gray-500 font-medium mb-1.5 ml-2">/ person</span>
              </div>
              
              <div className="bg-blue-50 border border-blue-100 text-blue-800 rounded-2xl p-5 text-sm font-medium mb-8">
                <div className="flex items-center mb-3">
                  <Check className="w-5 h-5 mr-3 text-blue-500" /> Best price guaranteed
                </div>
                <div className="flex items-center mb-3">
                  <Check className="w-5 h-5 mr-3 text-blue-500" /> Instant confirmation
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 mr-3 text-blue-500" /> Free cancellation up to 48h
                </div>
              </div>

              <div className="space-y-4">
                <Link href={`/booking/${tour.id}`} className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-center text-lg py-5 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
                  Book Now
                </Link>
                
                <button onClick={() => setIsModalOpen(true)} className="w-full bg-white border-2 border-gray-200 text-gray-800 font-bold text-lg py-5 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition">
                  Request Custom Tour
                </button>
                
                <a href={`https://wa.me/919876543210?text=I'm%20interested%20in%20the%20${tour.title}%20tour!`} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center bg-green-50 border border-green-100 text-green-700 hover:bg-green-100 hover:border-green-200 font-bold text-lg py-5 rounded-2xl transition">
                  <MessageCircle className="w-6 h-6 mr-2" />
                  Book via WhatsApp
                </a>
              </div>
              
              <div className="mt-8 pt-8 border-t border-gray-100 text-center text-sm text-gray-500">
                Prices include all applicable taxes and fees.
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Related Tours */}
      {relatedTours.length > 0 && (
        <div className="bg-white py-20 border-t border-gray-200 mt-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center md:text-left">You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedTours.map(t => (
                <TourCard key={t.id} tour={t} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Custom Tour Modal */}
      <CustomTourModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        tourDestination={tour.destination}
      />
    </div>
  )
}
