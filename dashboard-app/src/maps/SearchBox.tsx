import React, { useState } from 'react';
interface SearchBoxProps {
  onLocationSelect: (lat: number, lon: number) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onLocationSelect }) => {
  const [lat, setLat] = useState<string>(''); // Latitude input
  const [lon, setLon] = useState<string>(''); // Longitude input

  const handleSearch = () => {
    const latValue = parseFloat(lat);
    const lonValue = parseFloat(lon);

    if (isNaN(latValue) || isNaN(lonValue)) {
      alert('Please enter valid numbers for latitude and longitude.');
      return;
    }

    // Call the parent callback with the lat and lon values
    onLocationSelect(latValue, lonValue);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: '10px' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '5px' }}>
        Latitude:
        </label>
        <input
        type="text"
        value={lat}
        onChange={(e) => setLat(e.target.value)}
        placeholder="Enter latitude"
        style={{ padding: '8px', width: '150px' }}
        />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '5px' }}>
        Longitude:
        </label>
        <input
        type="text"
        value={lon}
        onChange={(e) => setLon(e.target.value)}
        placeholder="Enter longitude"
        style={{ padding: '8px', width: '150px' }}
        />
      </div>
      </div>
      <button onClick={handleSearch} style={{ padding: '8px', marginTop: '10px', backgroundColor: 'white', color: 'gray' }}>
      Go to Location
      </button>
    </div>
  );
};

export default SearchBox;