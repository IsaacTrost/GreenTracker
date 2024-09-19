import React, { useState } from 'react';
import SearchBox from './SearchBox';
import MapComponent from './map';
import { LatLng } from 'leaflet';
import { LatLngExpression } from 'leaflet';
import { isRectangleWithinLimit } from './checkData';

const MAX_SIZE_SQ_MILE = 3;

const MainComponent: React.FC = () => {
  const [coords, setCoords] = useState<LatLng>([40.7128, -74.0060]);

  const handleLocationSelect = (lat: number, lon: number) => {
    setCoords(new LatLng(lat, lon));
    console.log(`Selected location: (${lat}, ${lon})`);
  };
  const processRectangle = (bounds: LatLngExpression[][]) => {
    if (!isRectangleWithinLimit(bounds, MAX_SIZE_SQ_MILE)) {
      alert(`Rectangle is not within the size limit\n(${MAX_SIZE_SQ_MILE} square miles).`);
    }
  };

  return (
    <div>
      <SearchBox onLocationSelect={handleLocationSelect} />
      <MapComponent coords={coords} processRectangle={processRectangle} />
    </div>
  );
};

export default MainComponent;