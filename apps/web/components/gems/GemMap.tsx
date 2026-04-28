'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Map, { Marker, Popup, NavigationControl, FullscreenControl, ViewState } from 'react-map-gl/mapbox'
import type { MapRef } from 'react-map-gl/mapbox'
import Supercluster from 'supercluster'
import { MapPin } from 'lucide-react'
import Link from 'next/link'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

const CATEGORY_COLORS: Record<string, string> = {
  adventure: 'text-orange-500',
  peaceful: 'text-green-500',
  budget: 'text-blue-500',
  couple: 'text-pink-500',
}

interface GemMapProps {
  gems: any[]
  selectedGemId?: string | null
  onGemClick?: (gem: any) => void
}

export default function GemMap({ gems, selectedGemId, onGemClick }: GemMapProps) {
  const mapRef = useRef<MapRef>(null)
  
  // State for map viewport
  const [viewState, setViewState] = useState<ViewState>({
    longitude: 78.9629,
    latitude: 20.5937,
    zoom: 4,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 }
  })

  const [clusters, setClusters] = useState<any[]>([])
  const [supercluster] = useState(() => new Supercluster({ radius: 75, maxZoom: 14 }))
  const [popupInfo, setPopupInfo] = useState<any | null>(null)

  // Update clusters when viewport or data changes
  const updateClusters = useCallback(() => {
    if (!mapRef.current) return
    const bounds = mapRef.current.getMap().getBounds().toArray().flat() as [number, number, number, number]
    const zoom = Math.floor(viewState.zoom)
    
    // Format gems as GeoJSON for supercluster
    const points = gems
      .filter(g => g.lat && g.lng)
      .map(g => ({
        type: 'Feature',
        properties: { cluster: false, gemId: g.id, ...g },
        geometry: { type: 'Point', coordinates: [g.lng, g.lat] }
      }))
    
    supercluster.load(points as any)
    setClusters(supercluster.getClusters(bounds, zoom))
  }, [gems, viewState.zoom, supercluster])

  useEffect(() => {
    updateClusters()
  }, [updateClusters])

  // Fly to selected gem
  useEffect(() => {
    if (selectedGemId && mapRef.current) {
      const gem = gems.find(g => g.id === selectedGemId)
      if (gem && gem.lat && gem.lng) {
        mapRef.current.flyTo({ center: [gem.lng, gem.lat], zoom: 12, duration: 1500 })
        setPopupInfo(gem)
      }
    }
  }, [selectedGemId, gems])

  const handleClusterClick = (clusterId: number, longitude: number, latitude: number) => {
    const expansionZoom = Math.min(supercluster.getClusterExpansionZoom(clusterId), 14)
    mapRef.current?.flyTo({ center: [longitude, latitude], zoom: expansionZoom, duration: 800 })
  }

  const handleMarkerClick = (e: React.MouseEvent, gem: any) => {
    e.stopPropagation()
    setPopupInfo(gem)
    if (onGemClick) onGemClick(gem)
    mapRef.current?.flyTo({ center: [gem.lng, gem.lat], zoom: 10, duration: 800 })
  }

  if (!MAPBOX_TOKEN) {
    return <div className="w-full h-full bg-gray-100 flex items-center justify-center p-6 text-center text-gray-500 border border-gray-200 rounded-2xl">
      Mapbox token missing. Please add NEXT_PUBLIC_MAPBOX_TOKEN.
    </div>
  }

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-sm border border-gray-200">
      <Map
        {...viewState}
        ref={mapRef}
        onMove={evt => {
          setViewState(evt.viewState)
          updateClusters()
        }}
        mapStyle="mapbox://styles/mapbox/outdoors-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
      >
        <FullscreenControl position="top-right" />
        <NavigationControl position="top-right" />

        {clusters.map((cluster) => {
          const [longitude, latitude] = cluster.geometry.coordinates
          const { cluster: isCluster, point_count: pointCount, gemId } = cluster.properties

          if (isCluster) {
            // Render Cluster
            return (
              <Marker key={`cluster-${cluster.id}`} longitude={longitude} latitude={latitude}>
                <div
                  className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg border-2 border-white cursor-pointer hover:bg-blue-700 transition transform hover:scale-110"
                  onClick={(e) => { e.stopPropagation(); handleClusterClick(cluster.id, longitude, latitude) }}
                >
                  {pointCount}
                </div>
              </Marker>
            )
          }

          // Render Individual Gem Marker
          const gem = cluster.properties
          const colorClass = CATEGORY_COLORS[gem.category || 'adventure'] || 'text-gray-500'

          return (
            <Marker key={`gem-${gemId}`} longitude={longitude} latitude={latitude} anchor="bottom">
              <div 
                className="cursor-pointer hover:scale-125 transition-transform duration-200 group relative -bottom-2"
                onClick={(e) => handleMarkerClick(e, gem)}
              >
                <MapPin className={`w-10 h-10 ${colorClass} drop-shadow-md fill-white`} />
                <div className="absolute -top-1 right-0 w-3 h-3 bg-white rounded-full animate-ping opacity-75" />
              </div>
            </Marker>
          )
        })}

        {/* Popup */}
        {popupInfo && (
          <Popup
            anchor="bottom"
            longitude={popupInfo.lng}
            latitude={popupInfo.lat}
            onClose={() => setPopupInfo(null)}
            closeButton={true}
            closeOnClick={false}
            offset={40} // Offsets popup so it doesn't cover the marker
            maxWidth="300px"
            className="z-50"
          >
            <div className="p-1 -m-1">
              {popupInfo.images?.[0] ? (
                <img src={popupInfo.images[0]} className="w-full h-32 object-cover rounded-xl mb-3" alt={popupInfo.name} />
              ) : (
                <div className="w-full h-24 bg-gray-100 rounded-xl mb-3 flex items-center justify-center"><MapPin className="w-6 h-6 text-gray-300" /></div>
              )}
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-extrabold text-gray-900 text-base leading-tight pr-4">{popupInfo.name}</h3>
              </div>
              <span className="inline-block bg-gray-100 px-2 py-0.5 rounded text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-2">
                {popupInfo.category}
              </span>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">{popupInfo.description}</p>
              
              <Link href={`/hidden-gems/${popupInfo.id}`} className="block w-full text-center bg-blue-600 text-white font-bold py-2 rounded-lg text-sm hover:bg-blue-700 transition">
                View Details
              </Link>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  )
}
