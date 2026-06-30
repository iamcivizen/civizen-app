import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { CATEGORIES } from '../data/categories.js';
import { useTranslation } from '../utils/translations.js';
import 'leaflet/dist/leaflet.css';

// Fix leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const PRIORITY_COLORS = {
  critical: '#dc2626',
  high: '#f97316',
  medium: '#fbbf24',
  low: '#3b82f6',
};

// Leaflet custom marker helper
function createLeafletColoredIcon(color, emoji) {
  return L.divIcon({
    html: `<div style="
      width: 38px; height: 38px;
      background: ${color};
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 3px solid white;
      box-shadow: 0 4px 14px rgba(0,0,0,0.4);
      display: flex; align-items: center; justify-content: center;
    "><span style="transform: rotate(45deg); font-size: 16px; display: block; text-align: center; line-height: 32px;">${emoji}</span></div>`,
    className: '',
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -40],
  });
}

// Google Maps script dynamic loader
let googleMapsPromise = null;
function loadGoogleMapsScript(apiKey) {
  if (window.google) return Promise.resolve(window.google);
  if (googleMapsPromise) return googleMapsPromise;

  googleMapsPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google);
    script.onerror = (err) => {
      googleMapsPromise = null;
      reject(err);
    };
    document.head.appendChild(script);
  });
  return googleMapsPromise;
}

export default function UniversalMap({
  center = [12.9716, 77.5946],
  zoom = 12,
  issues = [],
  onMarkerClick,
  mapStyle = 'dark',
  showHeatmap = false,
}) {
  const t = useTranslation();
  const googleMapRef = useRef(null);
  const [useGoogleInstance, setUseGoogleInstance] = useState(false);
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [gMap, setGMap] = useState(null);
  const markersRef = useRef([]);
  const circlesRef = useRef([]);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const isKeyConfigured = apiKey && apiKey !== 'YOUR_GOOGLE_MAPS_API_KEY' && apiKey !== '';

  useEffect(() => {
    if (isKeyConfigured) {
      loadGoogleMapsScript(apiKey)
        .then(() => {
          setGoogleLoaded(true);
          setUseGoogleInstance(true);
        })
        .catch(err => {
          console.warn("Failed to load Google Maps SDK, falling back to Leaflet:", err);
          setUseGoogleInstance(false);
        });
    } else {
      setUseGoogleInstance(false);
    }
  }, [isKeyConfigured, apiKey]);

  // Handle Google Map Instantiation and Updates
  useEffect(() => {
    if (!useGoogleInstance || !googleLoaded || !googleMapRef.current) return;

    // Dark Map Styles for Google Maps
    const darkStyles = [
      { elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#1e293b' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
      { featureType: 'administrative', elementType: 'labels.text.fill', stylers: [{ color: '#cbd5e1' }] },
      { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#cbd5e1' }] },
      { featureType: 'poi.park', stylers: [{ color: '#0f172a' }] },
      { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#0f172a' }] },
      { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#1e293b' }] },
      { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#64748b' }] },
      { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#020617' }] },
    ];

    const mapOptions = {
      center: { lat: center[0], lng: center[1] },
      zoom: zoom,
      styles: mapStyle === 'dark' ? darkStyles : undefined,
      mapTypeId: mapStyle === 'satellite' ? 'satellite' : 'roadmap',
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
    };

    const map = new window.google.maps.Map(googleMapRef.current, mapOptions);
    setGMap(map);

    return () => {
      setGMap(null);
    };
  }, [useGoogleInstance, googleLoaded, mapStyle]);

  // Update Google Maps Markers and Circles
  useEffect(() => {
    if (!gMap || !window.google) return;

    // Clear old markers
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    // Clear old circles (heat zones)
    circlesRef.current.forEach(c => c.setMap(null));
    circlesRef.current = [];

    const bounds = new window.google.maps.LatLngBounds();

    issues.forEach(issue => {
      const color = PRIORITY_COLORS[issue.priority] || '#8b5cf6';
      const cat = CATEGORIES.find(c => c.id === issue.category);
      const emoji = cat?.icon || '📍';
      const position = { lat: issue.coordinates[0], lng: issue.coordinates[1] };

      bounds.extend(position);

      // Create Custom SVG Map Pin
      const svgPin = `data:image/svg+xml;utf-8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 48" width="38" height="48">
          <path d="M19 0C8.5 0 0 8.5 0 19c0 10.5 8 18.5 19 29 11-10.5 19-18.5 19-19C38 8.5 29.5 0 19 0z" fill="${color}" stroke="#ffffff" stroke-width="3"/>
          <circle cx="19" cy="19" r="10" fill="#ffffff"/>
          <text x="19" y="24" font-size="14" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
        </svg>
      `)}`;

      // Create Google Marker
      const marker = new window.google.maps.Marker({
        position,
        map: gMap,
        title: issue.title,
        icon: {
          url: svgPin,
          scaledSize: new window.google.maps.Size(38, 48),
          anchor: new window.google.maps.Point(19, 48),
        },
      });

      if (onMarkerClick) {
        marker.addListener('click', () => onMarkerClick(issue));
      }

      markersRef.current.push(marker);

      // Render heat zones
      if (showHeatmap) {
        const circle = new window.google.maps.Circle({
          strokeColor: color,
          strokeOpacity: 0.2,
          strokeWeight: 1,
          fillColor: color,
          fillOpacity: 0.1,
          map: gMap,
          center: position,
          radius: 600, // in meters
        });
        circlesRef.current.push(circle);
      }
    });

    // Auto-fit bounds if we have multiple issues
    if (issues.length > 0) {
      gMap.fitBounds(bounds);
      // Prevent over-zooming on single markers
      if (issues.length === 1) {
        const listener = window.google.maps.event.addListenerOnce(gMap, 'bounds_changed', () => {
          gMap.setZoom(15);
        });
      }
    }
  }, [gMap, issues, showHeatmap, onMarkerClick]);

  // Tile layers for Leaflet
  const tileLayers = {
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    light: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  };

  if (useGoogleInstance) {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <div ref={googleMapRef} style={{ width: '100%', height: '100%', borderRadius: 'inherit' }} />
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%', borderRadius: 'inherit' }}
        zoomControl={true}
      >
        <TileLayer
          url={tileLayers[mapStyle]}
          attribution='&copy; OpenStreetMap'
        />

        {/* Heat zones */}
        {showHeatmap && issues.map(issue => (
          <Circle
            key={`heat-${issue.id}`}
            center={issue.coordinates}
            radius={600}
            pathOptions={{
              fillColor: PRIORITY_COLORS[issue.priority],
              fillOpacity: 0.1,
              color: PRIORITY_COLORS[issue.priority],
              weight: 1,
              opacity: 0.2
            }}
          />
        ))}

        {/* Markers */}
        {issues.map(issue => {
          const cat = CATEGORIES.find(c => c.id === issue.category);
          const color = PRIORITY_COLORS[issue.priority];
          const icon = createLeafletColoredIcon(color, cat?.icon || '📍');

          return (
            <Marker
              key={issue.id}
              position={issue.coordinates}
              icon={icon}
              eventHandlers={{
                click: () => onMarkerClick && onMarkerClick(issue)
              }}
            />
          );
        })}
      </MapContainer>
    </div>
  );
}
