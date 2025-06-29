'use client';
import { useState, useRef, useEffect } from "react";
import { IoSearch, IoLocationOutline, IoCalendarOutline, IoPeopleOutline, IoChevronDown, IoAdd, IoRemove } from "react-icons/io5";

// Mock destinations for autocomplete
const mockDestinations = [
  { id: 1, name: "Barcelona", description: "Spain", type: "city" },
  { id: 2, name: "Paris", description: "France", type: "city" },
  { id: 3, name: "Istanbul", description: "Turkey", type: "city" },
  { id: 4, name: "Madrid", description: "Spain", type: "city" },
  { id: 5, name: "Rome", description: "Italy", type: "city" },
  { id: 6, name: "Alicante", description: "Spain", type: "city" },
  { id: 7, name: "Nearby", description: "Find what's around you", type: "nearby" }
];

export default function SmartSearch() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredDestinations, setFilteredDestinations] = useState(mockDestinations);
  const [selectedDestination, setSelectedDestination] = useState<string>("");
  const [checkInDate, setCheckInDate] = useState<string>("");
  const [checkOutDate, setCheckOutDate] = useState<string>("");
  const [guests, setGuests] = useState({
    adults: 0,
    children: 0,
    infants: 0,
    pets: 0
  });
  
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setActiveSection(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter destinations based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = mockDestinations.filter(dest =>
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDestinations(filtered);
    } else {
      setFilteredDestinations(mockDestinations);
    }
  }, [searchQuery]);

  const handleDestinationSelect = (destination: any) => {
    setSelectedDestination(destination.name);
    setSearchQuery(destination.name);
    setActiveSection(null);
  };

  const handleGuestChange = (type: keyof typeof guests, increment: boolean) => {
    setGuests(prev => ({
      ...prev,
      [type]: increment ? prev[type] + 1 : Math.max(0, prev[type] - 1)
    }));
  };

  const getTotalGuests = () => {
    return guests.adults + guests.children + guests.infants;
  };

  const getGuestsText = () => {
    const total = getTotalGuests();
    if (total === 0) return "Add guests";
    
    let text = "";
    if (guests.adults > 0) text += `${guests.adults} adult${guests.adults > 1 ? 's' : ''}`;
    if (guests.children > 0) text += `${text ? ', ' : ''}${guests.children} child${guests.children > 1 ? 'ren' : ''}`;
    if (guests.infants > 0) text += `${text ? ', ' : ''}${guests.infants} infant${guests.infants > 1 ? 's' : ''}`;
    if (guests.pets > 0) text += `${text ? ', ' : ''}${guests.pets} pet${guests.pets > 1 ? 's' : ''}`;
    
    return text;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handleSearch = () => {
    console.log({
      destination: selectedDestination,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: guests
    });
    // Handle search logic here
  };

  return (
    <div ref={searchRef} className="relative max-w-4xl mx-auto">
      {/* Main Search Bar */}
      <div className="bg-white rounded-full shadow-lg border border-gray-200 p-2 flex items-center">
        
        {/* Where Section */}
        <div 
          className={`flex-1 relative ${activeSection === 'where' ? 'bg-white shadow-lg rounded-full' : ''}`}
          onClick={() => setActiveSection('where')}
        >
          <div className="px-6 py-3 cursor-pointer hover:bg-gray-50 rounded-full transition-colors">
            <div className="text-xs font-semibold text-gray-900 mb-1">Where</div>
            <div className="text-sm text-gray-500">
              {selectedDestination || "Search destinations"}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-300"></div>

        {/* Check In Section */}
        <div 
          className={`flex-1 relative ${activeSection === 'checkin' ? 'bg-white shadow-lg rounded-full' : ''}`}
          onClick={() => setActiveSection('checkin')}
        >
          <div className="px-6 py-3 cursor-pointer hover:bg-gray-50 rounded-full transition-colors">
            <div className="text-xs font-semibold text-gray-900 mb-1">Check in</div>
            <div className="text-sm text-gray-500">
              {checkInDate ? formatDate(checkInDate) : "Add dates"}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-300"></div>

        {/* Check Out Section */}
        <div 
          className={`flex-1 relative ${activeSection === 'checkout' ? 'bg-white shadow-lg rounded-full' : ''}`}
          onClick={() => setActiveSection('checkout')}
        >
          <div className="px-6 py-3 cursor-pointer hover:bg-gray-50 rounded-full transition-colors">
            <div className="text-xs font-semibold text-gray-900 mb-1">Check out</div>
            <div className="text-sm text-gray-500">
              {checkOutDate ? formatDate(checkOutDate) : "Add dates"}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-300"></div>

        {/* Who Section */}
        <div 
          className={`flex-1 relative ${activeSection === 'who' ? 'bg-white shadow-lg rounded-full' : ''}`}
          onClick={() => setActiveSection('who')}
        >
          <div className="px-6 py-3 cursor-pointer hover:bg-gray-50 rounded-full transition-colors">
            <div className="text-xs font-semibold text-gray-900 mb-1">Who</div>
            <div className="text-sm text-gray-500">
              {getGuestsText()}
            </div>
          </div>
        </div>

        {/* Search Button */}
        <button 
          onClick={handleSearch}
          className="bg-rose-500 hover:bg-rose-600 text-white p-4 rounded-full ml-2 transition-colors"
        >
          <IoSearch size={20} />
        </button>
      </div>

      {/* Dropdown Panels */}
      {activeSection && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl shadow-xl border border-gray-200 z-50">
          
          {/* Where Dropdown */}
          {activeSection === 'where' && (
            <div className="p-6">
              <div className="relative mb-4">
                <IoSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search destinations"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  autoFocus
                />
              </div>
              
              <div className="space-y-2">
                {filteredDestinations.map((destination) => (
                  <div
                    key={destination.id}
                    onClick={() => handleDestinationSelect(destination)}
                    className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                  >
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mr-4">
                      {destination.type === 'nearby' ? 
                        <IoLocationOutline size={24} className="text-gray-600" /> :
                        <div className="text-sm font-semibold text-gray-600">
                          {destination.name.substring(0, 2).toUpperCase()}
                        </div>
                      }
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{destination.name}</div>
                      <div className="text-sm text-gray-500">{destination.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Check In/Out Dropdown */}
          {(activeSection === 'checkin' || activeSection === 'checkout') && (
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Check in</label>
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    min={getCurrentDate()}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Check out</label>
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    min={checkInDate || getCurrentDate()}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="mt-4 flex gap-2">
                <button className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                  Exact dates
                </button>
                <button className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                  ± 1 day
                </button>
                <button className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                  ± 2 days
                </button>
                <button className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                  ± 3 days
                </button>
              </div>
            </div>
          )}

          {/* Who Dropdown */}
          {activeSection === 'who' && (
            <div className="p-6">
              <div className="space-y-6">
                
                {/* Adults */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Adults</div>
                    <div className="text-sm text-gray-500">Ages 13 or above</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleGuestChange('adults', false)}
                      disabled={guests.adults === 0}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:border-gray-400 transition-colors"
                    >
                      <IoRemove size={16} />
                    </button>
                    <span className="w-8 text-center font-medium">{guests.adults}</span>
                    <button
                      onClick={() => handleGuestChange('adults', true)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
                    >
                      <IoAdd size={16} />
                    </button>
                  </div>
                </div>

                {/* Children */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Children</div>
                    <div className="text-sm text-gray-500">Ages 2–12</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleGuestChange('children', false)}
                      disabled={guests.children === 0}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:border-gray-400 transition-colors"
                    >
                      <IoRemove size={16} />
                    </button>
                    <span className="w-8 text-center font-medium">{guests.children}</span>
                    <button
                      onClick={() => handleGuestChange('children', true)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
                    >
                      <IoAdd size={16} />
                    </button>
                  </div>
                </div>

                {/* Infants */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Infants</div>
                    <div className="text-sm text-gray-500">Under 2</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleGuestChange('infants', false)}
                      disabled={guests.infants === 0}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:border-gray-400 transition-colors"
                    >
                      <IoRemove size={16} />
                    </button>
                    <span className="w-8 text-center font-medium">{guests.infants}</span>
                    <button
                      onClick={() => handleGuestChange('infants', true)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
                    >
                      <IoAdd size={16} />
                    </button>
                  </div>
                </div>

                {/* Pets */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Pets</div>
                    <div className="text-sm text-rose-500 underline cursor-pointer">Bringing a service animal?</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleGuestChange('pets', false)}
                      disabled={guests.pets === 0}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:border-gray-400 transition-colors"
                    >
                      <IoRemove size={16} />
                    </button>
                    <span className="w-8 text-center font-medium">{guests.pets}</span>
                    <button
                      onClick={() => handleGuestChange('pets', true)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
                    >
                      <IoAdd size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}