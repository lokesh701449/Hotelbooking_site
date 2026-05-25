import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getHotels, getLocations } from '../services/hotelService';
import { MapPin, Filter } from 'lucide-react';

const Hotels = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState(searchParams.get('location') || '');
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '');
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '');

  useEffect(() => {
    const loadHotels = async () => {
      setLoading(true);
      try {
        const data = await getHotels(searchQuery);
        setHotels(data);
        const locs = await getLocations();
        setLocations(locs);
      } catch (err) {
        console.error('Error fetching hotels:', err);
      } finally {
        setLoading(false);
      }
    };
    loadHotels();
  }, [searchQuery]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
  };

  const handleViewRooms = (hotelId) => {
    const params = new URLSearchParams();
    if (checkIn) params.append('checkIn', checkIn);
    if (checkOut) params.append('checkOut', checkOut);
    navigate(`/hotels/${hotelId}?${params.toString()}`);
  };

  return (
    <div className="min-height-screen bg-slate-50 py-12 px-6 text-slate-800">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-left mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900">Explore Premier Hotels</h1>
          <p className="text-slate-500 mt-2">Filter and browse through handpicked locations with top-tier amenities.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 rounded-2xl border border-slate-205 bg-white sticky top-24 shadow-md">
              <div className="flex items-center space-x-2 pb-4 mb-6 border-b border-slate-100">
                <Filter className="w-5 h-5 text-orange-500" />
                <h3 className="text-lg font-bold text-slate-905">Filter Search</h3>
              </div>

              <form onSubmit={handleFilterSubmit} className="space-y-6">
                {/* Location Select */}
                <div className="text-left">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-550 mb-2">
                    Location / City
                  </label>
                  <select
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-orange-500 transition-all cursor-pointer"
                  >
                    <option value="">All Locations</option>
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                {/* Dates */}
                <div className="text-left">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-550 mb-2">
                    Check-In
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-orange-500 transition-all cursor-pointer"
                  />
                </div>

                <div className="text-left">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-550 mb-2">
                    Check-Out
                  </label>
                  <input
                    type="date"
                    min={checkIn || new Date().toISOString().split('T')[0]}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-orange-500 transition-all cursor-pointer"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Apply Filters
                </button>
              </form>
            </div>
          </div>

          {/* Hotels Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="glass-card h-96 rounded-2xl overflow-hidden shimmer border border-slate-200 bg-white"></div>
                ))}
              </div>
            ) : hotels.length === 0 ? (
              <div className="glass-card p-12 rounded-2xl text-center border border-slate-200 bg-white">
                <p className="text-slate-500 text-lg">No hotels found in the selected location.</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 px-6 py-2.5 bg-slate-50 hover:bg-orange-500/10 border border-slate-200 hover:border-orange-500 text-orange-600 rounded-xl text-sm font-bold transition-all cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {hotels.map((hotel) => (
                  <div key={hotel.hotelId} className="glass-card rounded-2xl overflow-hidden border border-slate-100 shadow-md flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 group bg-white">
                    <div>
                      {/* Image Mock */}
                      <div className="relative h-48 bg-slate-100 flex items-center justify-center">
                        <div className="text-5xl group-hover:scale-110 transition-transform duration-300">🏨</div>
                        <span className="absolute bottom-4 left-4 bg-orange-600 text-white text-xs font-bold uppercase px-3 py-1 rounded-full flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{hotel.location}</span>
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-6 text-left">
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors leading-tight mb-3">
                          {hotel.hotelName}
                        </h3>
                        <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                          {hotel.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 pt-0">
                      <button
                        onClick={() => handleViewRooms(hotel.hotelId)}
                        className="w-full text-center py-3 bg-slate-50 hover:bg-orange-500 hover:text-white border border-slate-200 hover:border-orange-500 text-orange-600 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer"
                      >
                        View Available Rooms &rarr;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default Hotels;
