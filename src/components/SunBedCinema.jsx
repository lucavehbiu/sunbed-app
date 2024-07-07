import React, { useState } from 'react';
import { Umbrella, Waves } from 'lucide-react';

const BeachSunbedBookingSystem = () => {
  const [selectedSunbeds, setSelectedSunbeds] = useState([]);
  const [hoveredSunbed, setHoveredSunbed] = useState(null);

  // Mock data for beach layout
  const rows = ['A', 'B', 'C', 'D', 'E'];
  const sunbedsPerRow = 8;

  // Mock data for occupied sunbeds
  const occupiedSunbeds = ['A3', 'B5', 'B6', 'C4', 'E2', 'E3'];

  const handleSunbedClick = (sunbedId) => {
    if (occupiedSunbeds.includes(sunbedId)) return;

    setSelectedSunbeds(prev => 
      prev.includes(sunbedId) 
        ? prev.filter(id => id !== sunbedId)
        : [...prev, sunbedId]
    );
  };

  const getSunbedColor = (sunbedId) => {
    if (occupiedSunbeds.includes(sunbedId)) return 'bg-red-500';
    if (selectedSunbeds.includes(sunbedId)) return 'bg-green-500';
    return 'bg-yellow-300';
  };

  const renderSunbeds = () => {
    return rows.map(row => (
      <div key={row} className="flex justify-center mb-4">
        <div className="w-6 text-center">{row}</div>
        {[...Array(sunbedsPerRow)].map((_, index) => {
          const sunbedId = `${row}${index + 1}`;
          return (
            <button
              key={sunbedId}
              className={`w-12 h-12 mx-1 rounded-full ${getSunbedColor(sunbedId)} hover:opacity-80 transition-opacity flex items-center justify-center`}
              onClick={() => handleSunbedClick(sunbedId)}
              onMouseEnter={() => setHoveredSunbed(sunbedId)}
              onMouseLeave={() => setHoveredSunbed(null)}
              disabled={occupiedSunbeds.includes(sunbedId)}
            >
              <Umbrella size={20} className="text-white" />
            </button>
          );
        })}
      </div>
    ));
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-blue-100 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Beach Sunbed Booking</h1>
      
      <div className="mb-8 bg-blue-200 p-6 rounded-lg shadow relative overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-8 flex items-center justify-center">
          <Waves size={120} className="text-blue-500" />
        </div>
        {renderSunbeds()}
      </div>

      <div className="flex justify-center space-x-4 mb-6">
        <div className="flex items-center">
          <div className="w-6 h-6 bg-yellow-300 rounded-full mr-2"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-6 h-6 bg-green-500 rounded-full mr-2"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center">
          <div className="w-6 h-6 bg-red-500 rounded-full mr-2"></div>
          <span>Occupied</span>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">Selected Sunbeds:</h2>
        {selectedSunbeds.length > 0 ? (
          <p>{selectedSunbeds.join(', ')}</p>
        ) : (
          <p>No sunbeds selected</p>
        )}
        <button 
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          disabled={selectedSunbeds.length === 0}
        >
          Book Sunbeds
        </button>
      </div>

      {hoveredSunbed && !occupiedSunbeds.includes(hoveredSunbed) && (
        <div className="fixed bottom-4 right-4 bg-black text-white p-2 rounded">
          Sunbed {hoveredSunbed}
        </div>
      )}
    </div>
  );
};

export default BeachSunbedBookingSystem;
