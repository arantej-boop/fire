'use client'

import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { FireData } from '@/hooks/useFireData'

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/marker-icon-2x.png',
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
})

interface FireMapProps {
  fires: FireData[]
  center?: [number, number]
  zoom?: number
}

// Custom fire marker icons
const getFireIcon = (confidence: 'low' | 'nominal' | 'high', brightness: number) => {
  const size = confidence === 'high' ? 20 : confidence === 'nominal' ? 15 : 10
  const color = confidence === 'high' ? '#dc2626' : confidence === 'nominal' ? '#f97316' : '#eab308'
  
  return L.divIcon({
    className: 'fire-marker',
    html: `<div style="
      width: ${size * 2}px;
      height: ${size * 2}px;
      background: radial-gradient(circle, ${color} 0%, ${color}88 50%, transparent 70%);
      border-radius: 50%;
      border: 2px solid ${color};
      box-shadow: 0 0 ${size}px ${color}66;
      animation: pulse 2s infinite;
    "></div>`,
    iconSize: [size * 2, size * 2],
    iconAnchor: [size, size]
  })
}

// Component to fit map to fire bounds
function MapBounds({ fires }: { fires: FireData[] }) {
  const map = useMap()
  
  useEffect(() => {
    if (fires.length > 0) {
      const bounds = L.latLngBounds(
        fires.map(fire => [fire.latitude, fire.longitude])
      )
      map.fitBounds(bounds, { padding: [20, 20] })
    }
  }, [fires, map])
  
  return null
}

export default function FireMap({ fires, center = [40.0, -3.0], zoom = 6 }: FireMapProps) {
  const mapRef = useRef<L.Map>(null)

  return (
    <div className="relative w-full h-full min-h-[500px] rounded-lg overflow-hidden border border-border">
      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full"
        ref={mapRef}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
          opacity={0.3}
        />
        
        <MapBounds fires={fires} />
        
        {fires.map((fire, index) => (
          <Marker
            key={index}
            position={[fire.latitude, fire.longitude]}
            icon={getFireIcon(fire.confidence, fire.brightness)}
          >
            <Popup className="fire-popup">
              <div className="p-2 min-w-[200px]">
                <h3 className="font-semibold text-sm mb-2">Fire Detection</h3>
                <div className="space-y-1 text-xs">
                  <div><strong>Date:</strong> {fire.acq_date}</div>
                  <div><strong>Time:</strong> {fire.acq_time.toString().padStart(4, '0').slice(0, 2)}:{fire.acq_time.toString().padStart(4, '0').slice(2)}</div>
                  <div><strong>Confidence:</strong> 
                    <span className={`ml-1 px-1 rounded text-xs ${
                      fire.confidence === 'high' ? 'bg-red-100 text-red-800' :
                      fire.confidence === 'nominal' ? 'bg-orange-100 text-orange-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {fire.confidence}
                    </span>
                  </div>
                  <div><strong>Brightness:</strong> {fire.brightness.toFixed(1)}K</div>
                  <div><strong>FRP:</strong> {fire.frp.toFixed(1)} MW</div>
                  <div><strong>Satellite:</strong> {fire.satellite}</div>
                  <div><strong>Day/Night:</strong> {fire.daynight === 'D' ? 'Day' : 'Night'}</div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {fires.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="text-center">
            <div className="text-4xl mb-2">🔥</div>
            <p className="text-sm text-muted-foreground">No fire detections found</p>
          </div>
        </div>
      )}
    </div>
  )
}