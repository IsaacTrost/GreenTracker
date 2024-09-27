import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMapEvents, Rectangle } from 'react-leaflet';
import { LatLng, LatLngExpression } from 'leaflet';
// import SetViewOnLocation from './setView';
import 'leaflet/dist/leaflet.css';
import RecenterMap from './recenter'; // Import the new RecenterMap component

interface MapComponentProps {
  coords: LatLng;
  processRectangle: (bounds: LatLngExpression[][]) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ coords, processRectangle}) => {
  const [rectangleBounds, setRectangleBounds] = useState<LatLngExpression[][] | null>(null);
  const [startPoint, setStartPoint] = useState<LatLng | null>(null);
  const [currentMousePoint, setCurrentMousePoint] = useState<LatLng | null>(null);
  
  // useeffect to update the rendering of the map when coords change
  useEffect(() => {
    console.log('coords updated');
  }, [coords]);
  // Custom hook to handle map events (rectangle drawing)
  const MapEvents = () => {
    useMapEvents({
      click(e) {
        if (!startPoint) {
          setStartPoint(e.latlng); // Set the start point
        } else {
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
          setCurrentMousePoint(e.latlng); // Update the rectangle dynamically
        }
      }
    });
    return null;
  };
  const dynamicBounds = startPoint && currentMousePoint ? [
    [startPoint.lat, startPoint.lng],
    [currentMousePoint.lat, currentMousePoint.lng]
  ] : null;

  return (
    <div>
      <MapContainer center={coords} zoom={13} style={{ height: '500px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Render rectangle during dynamic dragging */}
        {dynamicBounds && (
          <Rectangle bounds={dynamicBounds} color="blue" />
        )}

        {/* Render final rectangle after second click */}
        {rectangleBounds && (
          <Rectangle bounds={rectangleBounds} color="green" />
        )}
        {<RecenterMap coords={coords} />}
        <MapEvents />
      </MapContainer>

      <div>
        {rectangleBounds && (
          <button onClick={() => processRectangle(rectangleBounds)}>
            Process Selected Rectangle
          </button>
        )}
      </div>
      
      
    </div>
  );
};

export default MapComponent;