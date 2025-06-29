'use client';

import React, { useState, useRef, useEffect } from 'react';
import { DateRangePicker } from 'react-date-range';
import { Search, MapPin, Calendar, Users, Plus, Minus, X } from 'lucide-react';
import { format } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { useRouter } from 'next/navigation';


interface DateRange {
  startDate: Date;
  endDate: Date;
  key: string;
}

interface SearchFormProps {
  onSearch?: (params: {
    location: string;
    dateRange: DateRange;
    guests: { adults: number; children: number };
  }) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const [location, setLocation] = useState('');
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGuestPicker, setShowGuestPicker] = useState(false);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [dateRange, setDateRange] = useState<DateRange[]>([
    {
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      key: 'selection'
    }
  ]);

  const locationRef = useRef<HTMLDivElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const guestPickerRef = useRef<HTMLDivElement>(null);

  const locationSuggestions = [
    { id: 1, name: 'Paris, France', type: 'City' },
    { id: 2, name: 'Tokyo, Japan', type: 'City' },
    { id: 3, name: 'New York, United States', type: 'City' },
    { id: 4, name: 'London, United Kingdom', type: 'City' },
    { id: 5, name: 'Barcelona, Spain', type: 'City' },
    { id: 6, name: 'Dubai, UAE', type: 'City' },
  ].filter(suggestion =>
    suggestion.name.toLowerCase().includes(location.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        locationRef.current &&
        !locationRef.current.contains(event.target as Node)
      ) {
        setShowLocationSuggestions(false);
      }
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setShowDatePicker(false);
      }
      if (
        guestPickerRef.current &&
        !guestPickerRef.current.contains(event.target as Node)
      ) {
        setShowGuestPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocationSelect = (suggestion: { name: string }) => {
    setLocation(suggestion.name);
    setShowLocationSuggestions(false);
  };
  const router = useRouter();
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  
    const query = new URLSearchParams({
      location,
      start: dateRange[0].startDate.toISOString(),
      end: dateRange[0].endDate.toISOString(),
      adults: adults.toString(),
      children: children.toString(),
    }).toString();
  
    router.push(`/search?${query}`);
  };
  

  const formatDateRange = () => {
    const start = dateRange[0].startDate;
    const end = dateRange[0].endDate;
    return `${format(start, 'MMM d')} - ${format(end, 'MMM d')}`;
  };

  const formatGuests = () => {
    const total = adults + children;
    return total === 0 ? 'Add guests' : `${total} guest${total !== 1 ? 's' : ''}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto relative z-50">
      <form
        onSubmit={handleSearch}
        className="relative bg-white rounded-xl shadow-lg border border-gray-200 overflow-visible hover:shadow-md transition-all duration-300"
      >
        <div className="flex items-center divide-x divide-gray-200">

          {/* Location */}
          <div ref={locationRef} className="relative flex-1 min-w-0 px-6 py-4">
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Where</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search destinations"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setShowLocationSuggestions(true);
                }}
                onFocus={() => setShowLocationSuggestions(true)}
                className="w-full pl-6 border-none text-sm font-medium focus:ring-0 focus:outline-none bg-transparent placeholder:text-gray-400 pr-6"
              />
              {location && (
                <button
                  type="button"
                  onClick={() => {
                    setLocation('');
                    setShowLocationSuggestions(false);
                  }}
                  className="absolute right-0 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {showLocationSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                {locationSuggestions.length > 0 ? (
                  locationSuggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      type="button"
                      onClick={() => handleLocationSelect(suggestion)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg flex items-center space-x-3"
                    >
                      <MapPin size={16} className="text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{suggestion.name}</div>
                        <div className="text-xs text-gray-500">{suggestion.type}</div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">No destinations found</div>
                )}
              </div>
            )}
          </div>

          {/* Date */}
          <div ref={datePickerRef} className="relative flex-1 min-w-0 px-6 py-4">
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Dates</label>
            <button
              type="button"
              onClick={() => {
                setShowDatePicker(!showDatePicker);
                setShowGuestPicker(false);
              }}
              className="w-full flex items-center gap-2 text-left text-sm font-medium text-gray-700"
            >
              <Calendar size={16} className="text-gray-400" />
              {formatDateRange()}
            </button>

            {showDatePicker && (
              <div className="absolute top-full mt-2 left-0 z-50 bg-white rounded-lg shadow-xl border border-gray-200">
                <DateRangePicker
                  ranges={dateRange}
                  onChange={(ranges: any) => setDateRange([ranges.selection])}
                  moveRangeOnFirstSelection={false}
                  months={2}
                  direction="horizontal"
                  //showDateDisplay={false}
                />
              </div>
            )}
          </div>

          {/* Guests */}
          <div ref={guestPickerRef} className="relative flex-1 min-w-0 px-6 py-4">
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Guests</label>
            <button
              type="button"
              onClick={() => {
                setShowGuestPicker(!showGuestPicker);
                setShowDatePicker(false);
              }}
              className="w-full flex items-center gap-2 text-left text-sm font-medium"
            >
              <Users size={16} className="text-gray-400" />
              <span className={adults + children === 0 ? 'text-gray-400' : 'text-gray-700'}>
                {formatGuests()}
              </span>
            </button>

            {showGuestPicker && (
              <div className="absolute top-full mt-2 right-0 w-80 z-50 bg-white rounded-lg shadow-xl border border-gray-200">
                <div className="p-4 space-y-6">
                  {[
                    { label: 'Adults', desc: 'Ages 13+', value: adults, setValue: setAdults, min: 1 },
                    { label: 'Children', desc: 'Ages 0–12', value: children, setValue: setChildren, min: 0 }
                  ].map(({ label, desc, value, setValue, min }) => (
                    <div key={label} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{label}</div>
                        <div className="text-sm text-gray-500">{desc}</div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={() => setValue(Math.max(min, value - 1))}
                          disabled={value <= min}
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${value <= min ? 'border-gray-200 text-gray-400' : 'border-gray-300 text-gray-700 hover:border-gray-400'}`}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center font-semibold text-gray-900">{value}</span>
                        <button
                          type="button"
                          onClick={() => setValue(value + 1)}
                          className="w-8 h-8 rounded-full border-2 border-gray-300 text-gray-700 hover:border-gray-400 flex items-center justify-center"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Search */}
          <div className="px-4 py-2">
            <button
              type="submit"
              className="bg-bl hover:bg-primary text-white rounded-xl h-12 w-12 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
