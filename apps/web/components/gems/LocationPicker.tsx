'use client'

import { useState, useRef, useCallback } from 'react'
import Map, { Marker, NavigationControl } from 'react-map-gl/mapbox'
import type { MapRef, ViewState } from 'react-map-gl/mapbox'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import { MapPin } from 'lucide-react'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number, placeName?: string) => void
  initialLat?: number
  initialLng?: number
}

export default function LocationPicker({ onLocationSelect, initialLat, initialLng }: LocationPickerProps) {
  const mapRef = useRef<MapRef>(null)
  
  const [viewState, setViewState] = useState<ViewState>({
    longitude: initialLng || 78.9629,
    latitude: initialLat || 20.5937,
    zoom: initialLat ? 12 : 4,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 }
  })

  const [markerPos, setMarkerPos] = useState<{lat: number, lng: number} | null>(
    initialLat && initialLng ? { lat: initialLat, lng: initialLng } : null
  )

  // Attach geocoder once map loads
  const mapLoaded = useCallback((e: any) => {
    if (!mapRef.current || !MAPBOX_TOKEN) return
    const map = mapRef.current.getMap()
    
    // Check if geocoder is already added to avoid duplicates on re-renders
    if (document.querySelector('.mapboxgl-ctrl-geocoder')) return

    const geocoder = new MapboxGeocoder({
      accessToken: MAPBOX_TOKEN,
      mapboxgl: map as any,
      marker: false, // We'll handle our own marker
      placeholder: 'Search for a city or place...',
      countries: 'in', // Limit to India for TripMeet
    })

    geocoder.on('result', (ev) => {
      const [lng, lat] = ev.result.center
      const placeName = ev.result.text
      setMarkerPos({ lat, lng })
      onLocationSelect(lat, lng, placeName)
    })

    // Mount geocoder control to map
    map.addControl(geocoder, 'top-left')
  }, [onLocationSelect])

  const handleMapClick = (e: any) => {
    const { lat, lng } = e.lngLat
    setMarkerPos({ lat, lng })
    onLocationSelect(lat, lng)
  }

  // Handle manual marker drag
  const handleMarkerDragEnd = (e: any) => {
    const { lat, lng } = e.lngLat
    setMarkerPos({ lat, lng })
    onLocationSelect(lat, lng)
  }

  if (!MAPBOX_TOKEN) {
    return <div className="w-full h-80 bg-gray-100 flex items-center justify-center rounded-xl border border-gray-200">Mapbox Token Missing</div>
  }

  return (
    <div className="space-y-3">
      <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-sm border border-gray-200 relative">
        <Map
          {...viewState}
          ref={mapRef}
          onMove={evt => setViewState(evt.viewState)}
          mapStyle="mapbox://styles/mapbox/outdoors-v12"
          mapboxAccessToken={MAPBOX_TOKEN}
          onClick={handleMapClick}
          onLoad={mapLoaded}
          style={{ width: '100%', height: '100%' }}
        >
          <NavigationControl position="bottom-right" />

          {markerPos && (
            <Marker 
              longitude={markerPos.lng} 
              latitude={markerPos.lat} 
              anchor="bottom"
              draggable
              onDragEnd={handleMarkerDragEnd}
            >
              <div className="cursor-move -bottom-2 relative">
                <MapPin className="w-10 h-10 text-red-500 fill-white drop-shadow-md" />
              </div>
            </Marker>
          )}

          {!markerPos && (
             <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white font-bold px-4 py-2 rounded-full shadow-lg pointer-events-none z-10 text-sm">
             Search above or click map to drop a pin
           </div>
          )}
        </Map>
      </div>

      {markerPos && (
        <div className="flex gap-4 text-xs font-mono text-gray-500 bg-gray-50 p-3 rounded-lg border">
          <div><span className="font-semibold text-gray-700">Lat:</span> {markerPos.lat.toFixed(6)}</div>
          <div><span className="font-semibold text-gray-700">Lng:</span> {markerPos.lng.toFixed(6)}</div>
        </div>
      )}
    </div>
  )
}
