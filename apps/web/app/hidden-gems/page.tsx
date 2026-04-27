'use client'

import { useState, useEffect } from 'react'
import { createClient } from '../../lib/supabase'
import Link from 'next/link'
import { Plus, List, Map as MapIcon } from 'lucide-react'
import GemMap from '../../components/gems/GemMap'
import GemCard from '../../components/gems/GemCard'

type ViewMode = 'map' | 'list'
const FILTERS = ['All', 'Adventure', 'Peaceful', 'Budget', 'Couple-friendly']

export default function HiddenGemsPage() {
  const [gems, setGems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [viewMode, setViewMode] = useState<ViewMode>('map')
  const [selectedGemId, setSelectedGemId] = useState<string | null>(null)
  
  const supabase = createClient()

  useEffect(() => {
    async function loadGems() {
      setLoading(true)
      let query = supabase.from('hidden_gems').select('*').eq('status', 'approved')
      if (filter !== 'All') {
        const categoryMap: any = {
          'Adventure': 'adventure',
          'Peaceful': 'peaceful',
          'Budget': 'budget',
          'Couple-friendly': 'couple'
        }
        query = query.eq('category', categoryMap[filter])
      }
      
      const { data } = await query
      setGems(data || [])
      setLoading(false)
    }
    loadGems()
  }, [filter])

  const handleCardClick = (id: string) => {
    setSelectedGemId(id)
    setViewMode('map')
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] md:h-[calc(100vh-73px)]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 flex-shrink-0 px-4 py-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">Khazana Map</h1>
            <p className="text-sm text-gray-500">Discover & share India's hidden gems</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition ${filter === f ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="bg-gray-100 p-1 rounded-xl flex">
              <button 
                onClick={() => setViewMode('map')} 
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold transition ${viewMode === 'map' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
              >
                <MapIcon className="w-4 h-4" /> Map
              </button>
              <button 
                onClick={() => setViewMode('list')} 
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold transition ${viewMode === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
              >
                <List className="w-4 h-4" /> Cards
              </button>
            </div>
            
            <Link 
              href="/hidden-gems/submit" 
              className="bg-green-600 hover:bg-green-700 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-sm transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Submit
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-hidden bg-gray-50">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 z-10 backdrop-blur-sm">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : null}

        {viewMode === 'map' ? (
          <div className="w-full h-full">
            <GemMap gems={gems} selectedGemId={selectedGemId} />
          </div>
        ) : (
          <div className="w-full h-full overflow-y-auto p-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-7xl mx-auto">
              {gems.length === 0 && !loading ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                  <MapIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No hidden gems found for this filter.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {gems.map(g => (
                    <GemCard 
                      key={g.id} 
                      gem={g} 
                      onClick={() => handleCardClick(g.id)} 
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}
