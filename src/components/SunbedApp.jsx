import React, { useState, useEffect } from 'react';
import { Umbrella, Clock, Phone, User, Calendar, Filter, SortAsc, SortDesc } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const SunbedApp = () => {
  const [sunbeds, setSunbeds] = useState([]);
  const [numSunbeds, setNumSunbeds] = useState('');
  const [selectedSunbed, setSelectedSunbed] = useState(null);
  const [reservation, setReservation] = useState({
    name: '',
    phone: '',
    arrivalTime: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const storedSunbeds = localStorage.getItem('sunbeds');
    if (storedSunbeds) {
      setSunbeds(JSON.parse(storedSunbeds));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sunbeds', JSON.stringify(sunbeds));
  }, [sunbeds]);

  const handleCreateSunbeds = () => {
    const count = parseInt(numSunbeds);
    if (isNaN(count) || count <= 0) return;
    
    const newSunbeds = Array.from({ length: count }, (_, index) => ({
      id: index + 1,
      reserved: false,
      name: '',
      phone: '',
      arrivalTime: '',
      date: ''
    }));
    setSunbeds(newSunbeds);
  };

  const handleSunbedClick = (sunbed) => {
    setSelectedSunbed(sunbed);
    if (sunbed.reserved) {
      setReservation({
        name: sunbed.name,
        phone: sunbed.phone,
        arrivalTime: sunbed.arrivalTime,
        date: sunbed.date
      });
    } else {
      setReservation({ name: '', phone: '', arrivalTime: '', date: new Date().toISOString().split('T')[0] });
    }
    setIsDialogOpen(true);
  };

  const handleReservation = () => {
    if (!selectedSunbed) return;
    
    setSunbeds(sunbeds.map(sunbed => 
      sunbed.id === selectedSunbed.id 
        ? { ...sunbed, reserved: true, ...reservation } 
        : sunbed
    ));
    setSelectedSunbed(null);
    setReservation({ name: '', phone: '', arrivalTime: '', date: new Date().toISOString().split('T')[0] });
    setIsDialogOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReservation(prev => ({ ...prev, [name]: value }));
  };

  const filteredSunbeds = sunbeds.filter(sunbed => {
    if (filterStatus === 'all') return true;
    return filterStatus === 'reserved' ? sunbed.reserved : !sunbed.reserved;
  });

  const sortedSunbeds = [...filteredSunbeds].sort((a, b) => {
    if (a[sortBy] < b[sortBy]) return sortOrder === 'asc' ? -1 : 1;
    if (a[sortBy] > b[sortBy]) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(sortedSunbeds);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSunbeds(items);
  };

  const getSunbedColor = (sunbed) => {
    if (!sunbed.reserved) return 'bg-green-400';
    const now = new Date();
    const arrival = new Date(`${sunbed.date}T${sunbed.arrivalTime}`);
    const diffHours = (arrival - now) / (1000 * 60 * 60);
    if (diffHours < 1) return 'bg-red-600';
    if (diffHours < 3) return 'bg-orange-400';
    return 'bg-yellow-400';
  };

  return (
    <div className="p-8 bg-gradient-to-r from-blue-400 to-cyan-300 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Luxury Beach Sunbed Manager</h1>
        <div className="mb-6 flex items-center justify-center space-x-2 flex-wrap">
          <input 
            type="number" 
            value={numSunbeds} 
            onChange={(e) => setNumSunbeds(e.target.value)}
            placeholder="Enter number of sunbeds"
            className="border rounded px-2 py-1 w-48"
          />
          <button onClick={handleCreateSunbeds} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            Create Sunbeds
          </button>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="all">All Sunbeds</option>
            <option value="reserved">Reserved</option>
            <option value="available">Available</option>
          </select>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="id">Sunbed Number</option>
            <option value="name">Guest Name</option>
            <option value="arrivalTime">Arrival Time</option>
          </select>
          <button onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')} className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded">
            {sortOrder === 'asc' ? <SortAsc /> : <SortDesc />}
          </button>
        </div>
        
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="sunbeds">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {sortedSunbeds.map((sunbed, index) => (
                  <Draggable key={sunbed.id} draggableId={sunbed.id.toString()} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="relative cursor-pointer transition-transform transform hover:scale-105"
                        onClick={() => handleSunbedClick(sunbed)}
                      >
                        <div className={`w-full aspect-square rounded-full flex flex-col items-center justify-center ${getSunbedColor(sunbed)} shadow-lg`}>
                          <Umbrella size={24} className="text-white mb-1" />
                          <span className="text-white text-xl font-bold">
                            {sunbed.id}
                          </span>
                          {sunbed.reserved && (
                            <span className="text-white text-xs mt-1 max-w-full px-2 truncate">
                              {sunbed.name}
                            </span>
                          )}
                        </div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded opacity-0 transition-opacity duration-200 hover:opacity-100 mt-2">
                          {sunbed.reserved ? (
                            <>
                              <p><User size={14} className="inline mr-1" />{sunbed.name}</p>
                              <p><Phone size={14} className="inline mr-1" />{sunbed.phone}</p>
                              <p><Calendar size={14} className="inline mr-1" />{sunbed.date}</p>
                              <p><Clock size={14} className="inline mr-1" />{sunbed.arrivalTime}</p>
                            </>
                          ) : (
                            <p>Available</p>
                          )}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {selectedSunbed?.reserved ? 'Update Reservation' : 'Reserve Sunbed'} {selectedSunbed?.id}
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  id="name"
                  name="name"
                  value={reservation.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  id="phone"
                  name="phone"
                  value={reservation.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
                />
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  value={reservation.date}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
                />
              </div>
              <div>
                <label htmlFor="arrivalTime" className="block text-sm font-medium text-gray-700">Arrival Time</label>
                <input
                  id="arrivalTime"
                  name="arrivalTime"
                  type="time"
                  value={reservation.arrivalTime}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button onClick={() => setIsDialogOpen(false)} className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded">
                Cancel
              </button>
              <button onClick={handleReservation} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                {selectedSunbed?.reserved ? 'Update' : 'Reserve'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SunbedApp;
