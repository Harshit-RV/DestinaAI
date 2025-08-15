import React, { useEffect, useRef } from 'react';
import { DayPlan } from '@/contexts/TripPlannerContext';

interface TripMapSimpleProps {
  dayPlans: DayPlan[];
  className?: string;
  height?: string;
}

// Simplified version without iframe to test if that's causing issues
const TripMapSimple: React.FC<TripMapSimpleProps> = ({ 
  dayPlans, 
  className = "", 
  height = "500px" 
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Flatten all activities from all days with their day index
  const allActivities = dayPlans.flatMap((dayPlan, dayIndex) =>
    dayPlan.activities
      .filter(activity => activity.location?.lat && activity.location?.long)
      .map(activity => ({ activity, dayIndex }))
  );

  useEffect(() => {
    console.log('TripMapSimple - dayPlans:', dayPlans);
    console.log('TripMapSimple - allActivities:', allActivities);

    if (!mapContainerRef.current || allActivities.length === 0) {
      console.log('TripMapSimple - No activities or container');
      return;
    }

    // Create script elements and load Leaflet
    const leafletCSS = document.createElement('link');
    leafletCSS.rel = 'stylesheet';
    leafletCSS.href = 'https://unpkg.com/leaflet/dist/leaflet.css';
    document.head.appendChild(leafletCSS);

    const leafletJS = document.createElement('script');
    leafletJS.src = 'https://unpkg.com/leaflet/dist/leaflet.js';
    leafletJS.onload = () => {
      // @ts-ignore - Leaflet will be available globally
      if (typeof L !== 'undefined') {
        initMap();
      }
    };
    document.head.appendChild(leafletJS);

    const initMap = () => {
      const container = mapContainerRef.current;
      if (!container) return;

      // Clear container
      container.innerHTML = '<div id="simple-map" style="height: 100%; width: 100%;"></div>';
      
      // @ts-ignore
      const map = L.map('simple-map').setView([allActivities[0].activity.location!.lat, allActivities[0].activity.location!.long], 13);

      // @ts-ignore
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Add markers
      allActivities.forEach(({ activity, dayIndex }) => {
        // @ts-ignore
        L.marker([activity.location!.lat, activity.location!.long])
          .addTo(map)
          .bindPopup(`
            <strong>${activity.title}</strong><br>
            Day ${dayIndex + 1} • ${activity.type}<br>
            ${activity.start_time} - ${activity.end_time}<br>
            Cost: ${activity.estimated_cost}<br>
            ${activity.description}
          `);
      });
    };

    return () => {
      // Cleanup
      const cssLink = document.querySelector('link[href="https://unpkg.com/leaflet/dist/leaflet.css"]');
      const jsScript = document.querySelector('script[src="https://unpkg.com/leaflet/dist/leaflet.js"]');
      if (cssLink) cssLink.remove();
      if (jsScript) jsScript.remove();
    };
  }, [dayPlans, allActivities]);

  if (allActivities.length === 0) {
    return (
      <div 
        className={`bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center ${className}`} 
        style={{ height }}
      >
        <div className="text-center text-gray-500">
          <div className="text-2xl mb-2">🗺️</div>
          <p className="text-lg font-medium">No locations to display</p>
          <p className="text-sm">Activities with location data will appear here</p>
          <div className="mt-4 text-xs bg-yellow-100 p-2 rounded">
            <p>Debug info:</p>
            <p>Total day plans: {dayPlans.length}</p>
            <p>Total activities: {dayPlans.reduce((acc, day) => acc + day.activities.length, 0)}</p>
            <p>Activities with location: {allActivities.length}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`rounded-lg overflow-hidden shadow-lg border border-gray-200 ${className}`} 
      style={{ height }}
    >
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default TripMapSimple;
