import React, { useState } from 'react';
import { MapContainer, TileLayer, useMapEvents, Rectangle } from 'react-leaflet';
import { LatLngExpression, LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent2: React.FC = () => {
  const [rectangleBounds, setRectangleBounds] = useState<LatLngExpression[][] | null>(null);
  const [startPoint, setStartPoint] = useState<LatLng | null>(null); // First click point
  const [currentMousePoint, setCurrentMousePoint] = useState<LatLng | null>(null); // Mouse move point
  const [location, setLocation] = useState<string>(""); // For the textbox input
  const [coords, setCoords] = useState<LatLng | null>(null); // Coordinates to center map on
  const [suggestions, setSuggestions] = useState<any[]>([]); // Address suggestions

  // Function to handle user input for geocoding (replace with a real geocoding API)
  const geocodeLocation = async (location: string) => {
    // You'd use a real geocoding service here; for example, fetch results from OpenStreetMap Nominatim
    // This is a simple placeholder example with fixed coords
    if (location.toLowerCase() === "new york") {
      return new LatLng(40.7128, -74.006); // Example coordinates for New York
    }
    return null; // In case the location is not found
  };

  const fetchNominatimData = async (query: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data from Nominatim", error);
      return [];
    }
  };

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setLocation(inputValue);

    if (inputValue.length > 2) {
      const results = await fetchNominatimData(inputValue);
      setSuggestions(results);
    } else {
      setSuggestions([]); // Clear suggestions when input is short
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    const lat = suggestion.lat;
    const lon = suggestion.lon;
    setCoords(new LatLng(lat, lon)); // Update the map view to the selected coordinates
    setSuggestions([]); // Clear suggestions
    setLocation(suggestion.display_name); // Set the input to the selected suggestion
  };

  // Custom hook to handle map events
  const MapEvents = () => {
    useMapEvents({
      click(e) {
        if (!startPoint) {
          // On first click, set the start point
          setStartPoint(e.latlng);
        } else {
          // On second click, finalize the rectangle and reset
          setRectangleBounds([
            [startPoint.lat, startPoint.lng],
            [e.latlng.lat, e.latlng.lng]
          ]);
          setStartPoint(null); // Reset start point
          setCurrentMousePoint(null); // Reset mouse tracking
        }
      },
      mousemove(e) {
        if (startPoint) {
          // Update the rectangle bounds dynamically as the mouse moves
          setCurrentMousePoint(e.latlng);
        }
      }
    });
    return null;
  };

  // Dynamically generate the rectangle bounds while dragging
  const dynamicBounds = startPoint && currentMousePoint ? [
    [startPoint.lat, startPoint.lng],
    [currentMousePoint.lat, currentMousePoint.lng]
  ] : null;

  return (
    <div>
      {/* Input and Search Suggestions */}
      <input
        type="text"
        value={location}
        onChange={handleSearch}
        placeholder="Enter location"
        style={{ width: "300px", padding: "8px", marginBottom: "10px" }}
      />
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {suggestions.map((suggestion) => (
          <li
            key={suggestion.place_id}
            onClick={() => handleSuggestionClick(suggestion)}
            style={{ cursor: "pointer", padding: "5px", borderBottom: "1px solid #ccc" }}
          >
            {suggestion.display_name}
          </li>
        ))}
      </ul>
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        style={{ height: '500px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapEvents />
        
        {/* Render rectangle during dynamic dragging */}
        {dynamicBounds && (
          <Rectangle bounds={dynamicBounds} color="blue" />
        )}

        {/* Render final rectangle after second click */}
        {rectangleBounds && (
          <Rectangle bounds={rectangleBounds} color="green" />
        )}
      </MapContainer>

      <div>
        {rectangleBounds && (
          <button onClick={() => console.log(rectangleBounds)}>
            Process Selected Rectangle
          </button>
        )}
      </div>
    </div>
  );
};

export default MapComponent2;
