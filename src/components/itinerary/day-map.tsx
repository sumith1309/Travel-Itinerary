'use client';

import { useEffect, useRef, useState } from 'react';
import { Map as MapIcon, AlertCircle } from 'lucide-react';

interface MapItem {
  title: string;
  timeSlot: string;
  lat?: number;
  lng?: number;
}

interface DayMapProps {
  items: MapItem[];
  dayNumber: number;
  className?: string;
}

const SLOT_COLORS: Record<string, string> = {
  morning: '#f59e0b',
  afternoon: '#3b82f6',
  evening: '#8b5cf6',
};

export function DayMap({ items, dayNumber, className = '' }: DayMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter items that have coordinates
  const geoItems = items.filter((item) => item.lat != null && item.lng != null);

  useEffect(() => {
    if (geoItems.length === 0) return;
    if (!mapContainerRef.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!token) {
      setError('Mapbox token not configured');
      return;
    }

    let map: mapboxgl.Map;

    async function initMap() {
      try {
        const mapboxgl = (await import('mapbox-gl')).default;
        // @ts-expect-error -- CSS import handled by bundler
        await import('mapbox-gl/dist/mapbox-gl.css');

        mapboxgl.accessToken = token!;

        map = new mapboxgl.Map({
          container: mapContainerRef.current!,
          style: 'mapbox://styles/mapbox/light-v11',
          center: [geoItems[0].lng!, geoItems[0].lat!],
          zoom: 12,
          attributionControl: false,
        });

        map.addControl(new mapboxgl.NavigationControl(), 'top-right');

        map.on('load', () => {
          setMapLoaded(true);

          // Add markers
          geoItems.forEach((item, i) => {
            const el = document.createElement('div');
            el.className = 'flex items-center justify-center';
            el.style.width = '28px';
            el.style.height = '28px';
            el.style.borderRadius = '50%';
            el.style.backgroundColor = SLOT_COLORS[item.timeSlot] ?? '#1B4D3E';
            el.style.color = 'white';
            el.style.fontSize = '12px';
            el.style.fontWeight = 'bold';
            el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
            el.textContent = String(i + 1);

            const popup = new mapboxgl.Popup({ offset: 20, closeButton: false })
              .setHTML(`<div style="font-size:13px;font-weight:600;color:#1A1A2E">${item.title}</div>`);

            new mapboxgl.Marker({ element: el })
              .setLngLat([item.lng!, item.lat!])
              .setPopup(popup)
              .addTo(map);
          });

          // Fit bounds
          if (geoItems.length > 1) {
            const bounds = new mapboxgl.LngLatBounds();
            geoItems.forEach((item) => bounds.extend([item.lng!, item.lat!]));
            map.fitBounds(bounds, { padding: 60, maxZoom: 14 });
          }

          // Draw route line
          if (geoItems.length >= 2) {
            map.addSource('route', {
              type: 'geojson',
              data: {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'LineString',
                  coordinates: geoItems.map((item) => [item.lng!, item.lat!]),
                },
              },
            });

            map.addLayer({
              id: 'route-line',
              type: 'line',
              source: 'route',
              layout: { 'line-join': 'round', 'line-cap': 'round' },
              paint: {
                'line-color': '#1B4D3E',
                'line-width': 2,
                'line-dasharray': [3, 3],
                'line-opacity': 0.6,
              },
            });
          }
        });

        mapRef.current = map;
      } catch {
        setError('Failed to load map');
      }
    }

    initMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [geoItems.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // No geo items — show placeholder
  if (geoItems.length === 0) {
    return (
      <div className={`rounded-xl bg-sand-50 border border-sand-200 p-6 flex flex-col items-center justify-center text-center ${className}`}>
        <MapIcon className="h-8 w-8 text-stone/30 mb-2" />
        <p className="text-sm text-stone">Map available when location data is added</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`rounded-xl bg-red-50 border border-red-100 p-6 flex flex-col items-center justify-center text-center ${className}`}>
        <AlertCircle className="h-6 w-6 text-red-400 mb-2" />
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className={`relative rounded-xl overflow-hidden border border-sand-200 ${className}`}>
      <div ref={mapContainerRef} className="h-64 sm:h-80 w-full" />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-sand-50">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-forest border-t-transparent" />
        </div>
      )}
      {/* Legend */}
      <div className="absolute bottom-3 left-3 flex gap-2">
        {Object.entries(SLOT_COLORS).map(([slot, color]) => (
          <div key={slot} className="flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium shadow-sm">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="capitalize">{slot}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
