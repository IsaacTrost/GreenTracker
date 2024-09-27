import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { LatLng } from 'leaflet';

interface RecenterMapProps {
  coords: LatLng;
}

const RecenterMap: React.FC<RecenterMapProps> = ({ coords }) => {
  const map = useMap(); // Get map instance

  useEffect(() => {
    if (coords) {
      map.setView(coords, map.getZoom()); // Recenter the map when coords change
    }
  }, [coords, map]);

  return null; // This component does not render anything visually
};

export default RecenterMap;