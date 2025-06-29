// components/Map.tsx
'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import react-leaflet components
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

interface MapProps {
  center?: [number, number];
  zoom?: number;
  height?: string;
  markers?: Array<{
    position: [number, number];
    popup?: string;
  }>;
}

const Map: React.FC<MapProps> = ({
  center = [51.505, -0.09],
  zoom = 13,
  height = '400px',
  markers = []
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div 
        style={{ height }}
        className="bg-gray-200 rounded-lg flex items-center justify-center"
      >
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height, width: '100%' }}
      className="rounded-lg"
    >
      <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
      />
      {markers.map((marker, index) => (
        <Marker key={index} position={marker.position}>
          {marker.popup && <Popup>{marker.popup}</Popup>}
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;