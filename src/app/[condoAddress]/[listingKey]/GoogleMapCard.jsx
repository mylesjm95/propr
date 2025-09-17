'use client';

import { useEffect, useRef, useState } from 'react';

export default function GoogleMapCard({ address, lat, lng }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [mapError, setMapError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load the Google Maps script
    const loadGoogleMapsScript = () => {
      // Use a hardcoded API key for now - you should replace this with your own API key
      // and store it properly in environment variables
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE';
      
      const googleMapsScript = document.createElement('script');
      googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      googleMapsScript.async = true;
      googleMapsScript.defer = true;
      
      googleMapsScript.onload = initializeMap;
      googleMapsScript.onerror = () => {
        console.error('Failed to load Google Maps script');
        setMapError('Failed to load Google Maps');
        setIsLoading(false);
      };
      
      document.head.appendChild(googleMapsScript);
    };

    // Initialize the map
    const initializeMap = () => {
      if (!window.google || !mapRef.current) {
        setMapError('Google Maps failed to initialize');
        setIsLoading(false);
        return;
      }
      
      try {
        // Default coordinates if lat/lng not provided
        const defaultLat = 43.653225;
        const defaultLng = -79.383186;
        
        // Parse lat and lng as numbers if they're strings
        let parsedLat = parseFloat(lat);
        let parsedLng = parseFloat(lng);
        
        const position = {
          lat: isNaN(parsedLat) ? defaultLat : parsedLat,
          lng: isNaN(parsedLng) ? defaultLng : parsedLng
        };
        
        console.log('Map position:', position);
        
        const mapOptions = {
          center: position,
          zoom: 15,
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        };
        
        // Create the map
        mapInstanceRef.current = new window.google.maps.Map(mapRef.current, mapOptions);
        
        // Add a marker
        new window.google.maps.Marker({
          position,
          map: mapInstanceRef.current,
          title: address || 'Property Location'
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError('Failed to initialize map');
        setIsLoading(false);
      }
    };

    // Try to initialize the map if Google Maps is already loaded
    if (window.google && window.google.maps) {
      initializeMap();
      setIsLoading(false);
    } else {
      try {
        loadGoogleMapsScript();
      } catch (error) {
        console.error('Error loading Google Maps:', error);
        setMapError('Failed to initialize map');
        setIsLoading(false);
      }
    }

    // Cleanup function
    return () => {
      const script = document.querySelector('script[src*="maps.googleapis.com/maps/api"]');
      if (script) {
        script.remove();
      }
    };
  }, [address, lat, lng]);

  return (
    <div className="rounded-lg overflow-hidden h-full min-h-[300px] bg-gray-100 relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500"></div>
        </div>
      )}
      
      {mapError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 p-4">
          <p className="text-red-500 font-medium">{mapError}</p>
          <p className="text-gray-600 text-center mt-2">
            Unable to load the map. Please ensure you have a Google Maps API key configured.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Address: {address || 'No address provided'}
          </p>
        </div>
      )}
      
      <div ref={mapRef} className="w-full h-full"></div>
    </div>
  );
}
