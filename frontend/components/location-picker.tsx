"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, Search, X } from "lucide-react";

interface LocationPickerProps {
  onLocationSelect: (location: {
    address: string;
    city: string;
    lat: number;
    lng: number;
  }) => void;
  initialLocation?: {
    address?: string;
    city?: string;
    lat?: number;
    lng?: number;
  };
  className?: string;
}

export function LocationPicker({
  onLocationSelect,
  initialLocation,
  className = "",
}: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState(
    initialLocation?.address || ""
  );
  const [city, setCity] = useState(initialLocation?.city || "");
  const [showMap, setShowMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(
    initialLocation?.lat && initialLocation?.lng
      ? {
          lat: initialLocation.lat,
          lng: initialLocation.lng,
          address: initialLocation.address || "",
        }
      : null
  );
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  // Initialize map when component mounts or showMap changes
  useEffect(() => {
    if (showMap && mapRef.current && !mapInstanceRef.current) {
      // Use OpenStreetMap with Leaflet (no API key required)
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = () => {
        const L = (window as any).L;
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);

        // Initialize map centered on Indore (default) or selected location
        const center = selectedLocation
          ? [selectedLocation.lat, selectedLocation.lng]
          : [22.7196, 75.8577]; // Indore coordinates

        const map = L.map(mapRef.current!).setView(center, 13);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        mapInstanceRef.current = map;

        // Add marker if location is selected
        if (selectedLocation) {
          markerRef.current = L.marker([selectedLocation.lat, selectedLocation.lng])
            .addTo(map)
            .bindPopup(selectedLocation.address || "Selected Location");
        }

        // Handle map click to select location
        map.on("click", async (e: any) => {
          const { lat, lng } = e.latlng;

          // Reverse geocode to get address
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
            );
            const data = await response.json();
            const address = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            const cityName =
              data.address?.city ||
              data.address?.town ||
              data.address?.village ||
              data.address?.county ||
              "";

            const location = {
              lat,
              lng,
              address,
            };

            setSelectedLocation(location);
            setSearchQuery(address);
            setCity(cityName);

            // Update marker
            if (markerRef.current) {
              map.removeLayer(markerRef.current);
            }
            markerRef.current = L.marker([lat, lng])
              .addTo(map)
              .bindPopup(address);
          } catch (error) {
            console.error("Geocoding error:", error);
            const location = {
              lat,
              lng,
              address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
            };
            setSelectedLocation(location);
            setSearchQuery(location.address);
          }
        });
      };
      document.head.appendChild(script);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [showMap, selectedLocation]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=5&addressdetails=1`
      );
      const data = await response.json();

      if (data.length > 0) {
        const result = data[0];
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
        const address = result.display_name;
        const cityName =
          result.address?.city ||
          result.address?.town ||
          result.address?.village ||
          result.address?.county ||
          "";

        setSelectedLocation({ lat, lng, address });
        setCity(cityName);
        setShowMap(true);

        // Center map on selected location
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([lat, lng], 15);
          if (markerRef.current) {
            mapInstanceRef.current.removeLayer(markerRef.current);
          }
          markerRef.current = (window as any).L.marker([lat, lng])
            .addTo(mapInstanceRef.current)
            .bindPopup(address);
        }
      } else {
        alert("Location not found. Please try a different search term.");
      }
    } catch (error) {
      console.error("Search error:", error);
      alert("Error searching for location. Please try again.");
    }
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      onLocationSelect({
        address: searchQuery,
        city: city,
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
      });
      setShowMap(false);
    }
  };

  return (
    <div className={className}>
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zh-gray w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search for location or click on map"
            className="w-full pl-10 pr-4 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedLocation(null);
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zh-gray hover:text-zh-navy"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* City Input */}
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zh-gray w-5 h-5" />
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
            className="w-full pl-10 pr-4 py-2 border border-zh-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-zh-pink"
          />
        </div>

        {/* Map Toggle Button */}
        <button
          onClick={() => setShowMap(!showMap)}
          className="w-full px-4 py-2 bg-zh-blue text-white rounded-lg hover:bg-zh-blue/90 transition-colors flex items-center justify-center space-x-2"
        >
          <MapPin className="w-5 h-5" />
          <span>{showMap ? "Hide Map" : "Show Map to Select Location"}</span>
        </button>

        {/* Map Container */}
        {showMap && (
          <div className="space-y-3">
            <div
              ref={mapRef}
              className="w-full h-96 rounded-lg border border-zh-gray-light"
              style={{ zIndex: 1 }}
            />
            <div className="text-sm text-zh-gray-dark">
              <p>💡 Click on the map to select a location</p>
              {selectedLocation && (
                <p className="mt-1">
                  Selected: {selectedLocation.address.substring(0, 50)}
                  {selectedLocation.address.length > 50 ? "..." : ""}
                </p>
              )}
            </div>
            {selectedLocation && (
              <button
                onClick={handleConfirm}
                className="w-full px-4 py-2 bg-zh-pink text-zh-navy font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                Confirm Location
              </button>
            )}
          </div>
        )}

        {/* Selected Location Display */}
        {selectedLocation && !showMap && (
          <div className="p-3 bg-zh-soft rounded-lg border border-zh-gray-light">
            <div className="flex items-start space-x-2">
              <MapPin className="w-5 h-5 text-zh-pink mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-zh-navy">Selected Location</p>
                <p className="text-sm text-zh-gray-dark">{searchQuery}</p>
                {city && <p className="text-xs text-zh-gray mt-1">City: {city}</p>}
              </div>
              <button
                onClick={() => {
                  setSelectedLocation(null);
                  setSearchQuery("");
                  setCity("");
                }}
                className="text-zh-gray hover:text-zh-navy"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


