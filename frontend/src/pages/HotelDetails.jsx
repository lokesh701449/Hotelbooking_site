import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { getHotelById } from '../services/hotelService';
import { getAvailableRooms } from '../services/roomService';
import { formatPrice } from '../utils/priceFormatter';
import { MapPin, Calendar, Bed, Wifi, Tv, Coffee, ShieldCheck, Loader, Filter, AlertCircle } from 'lucide-react';

const HotelDetails = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roomsLoading, setRoomsLoading] = useState(false);

  // Amenity filters state
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  // Initialize dates from search query params or tomorrow/day-after-tomorrow defaults
  const getTomorrow = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const getDayAfterTomorrow = () => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  };

  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || getTomorrow());
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || getDayAfterTomorrow());

  useEffect(() => {
    const loadHotelDetails = async () => {
      setLoading(true);
      try {
        const hData = await getHotelById(id);
        setHotel(hData);
      } catch (err) {
        console.error('Error fetching hotel details:', err);
      } finally {
        setLoading(false);
      }
    };
    loadHotelDetails();
  }, [id]);

  // Load rooms reactively based on dates
  useEffect(() => {
    const loadRooms = async () => {
      if (!checkIn || !checkOut) return;
      setRoomsLoading(true);
      try {
        const rData = await getAvailableRooms(checkIn, checkOut, id);
        setRooms(rData);
        setSelectedAmenities([]);
      } catch (err) {
        console.error('Error fetching available rooms:', err);
      } finally {
        setRoomsLoading(false);
      }
    };
    loadRooms();
  }, [id, checkIn, checkOut]);

  const handleBookRoom = (roomId) => {
    const params = new URLSearchParams({
      roomId,
      checkIn,
      checkOut
    });
    navigate(`/checkout?${params.toString()}`);
  };

  // Helper for matching amenity icons for styling visual cues
  const getAmenityIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes('wifi')) return <Wifi className="w-3.5 h-3.5" />;
    if (n.includes('tv')) return <Tv className="w-3.5 h-3.5" />;
    if (n.includes('breakfast')) return <Coffee className="w-3.5 h-3.5" />;
    return <ShieldCheck className="w-3.5 h-3.5" />;
  };

  // Collect all unique amenities dynamically from rooms list
  const getUniqueAmenities = () => {
    const unique = [];
    rooms.forEach((room) => {
      if (room.amenities) {
        room.amenities.forEach((amenity) => {
          if (!unique.some((a) => a.amenityId === amenity.amenityId)) {
            unique.push(amenity);
          }
        });
      }
    });
    return unique;
  };

  const handleToggleAmenity = (amenityId) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenityId)
        ? prev.filter((id) => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  // Filter rooms based on selected amenities
  const getFilteredRooms = () => {
    if (selectedAmenities.length === 0) {
      return { filtered: rooms, showingAlternatives: false };
    }

    const filtered = rooms.filter((room) => {
      const roomAmenityIds = room.amenities ? room.amenities.map((a) => a.amenityId) : [];
      return selectedAmenities.every((id) => roomAmenityIds.includes(id));
    });

    if (filtered.length === 0) {
      return { filtered: rooms, showingAlternatives: true };
    }

    return { filtered, showingAlternatives: false };
  };

  const allAvailableAmenities = getUniqueAmenities();
  const { filtered: filteredRooms, showingAlternatives } = getFilteredRooms();

  if (loading) {
    return (
      <div className="min-height-screen bg-slate-50 flex items-center justify-center">
        <Loader className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-height-screen bg-slate-50 py-20 px-6">
        <div className="max-w-md mx-auto glass-card p-8 rounded-2xl text-center border border-slate-200 bg-white">
          <p className="text-slate-500">Hotel not found or error loading hotel details.</p>
          <button onClick={() => navigate('/hotels')} className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-xl text-sm font-bold">
            Back to Hotels
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-height-screen bg-slate-50 py-12 px-6 text-slate-800">
      <div className="max-w-7xl mx-auto">
        
        {/* Hotel Details Banner */}
        <div className="glass-card p-8 md:p-12 rounded-3xl border border-slate-200 mb-12 relative overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50/20 to-slate-50 text-left">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-400/5 rounded-full blur-[80px]"></div>
          
          <div className="flex items-center space-x-2 text-orange-600 font-bold uppercase tracking-wider text-sm mb-4">
            <MapPin className="w-4 h-4" />
            <span>{hotel.location}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
            {hotel.hotelName}
          </h1>

          <p className="text-slate-650 text-base md:text-lg leading-relaxed max-w-4xl">
            {hotel.description}
          </p>
        </div>

        {/* Date Filter Card */}
        <div className="glass-card p-6 rounded-2xl border border-slate-200 mb-12 bg-white shadow-md">
          <h3 className="text-lg font-bold text-slate-900 text-left mb-4 flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-orange-500" />
            <span>Adjust Booking Dates to Check Availability</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-left">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Check-In Date</label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-orange-500 transition-all cursor-pointer"
              />
            </div>
            <div className="text-left">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Check-Out Date</label>
              <input
                type="date"
                min={checkIn || new Date().toISOString().split('T')[0]}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-orange-500 transition-all cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Select Amenities Panel */}
        {allAvailableAmenities.length > 0 && (
          <div className="glass-card p-6 rounded-2xl border border-slate-200 mb-12 text-left bg-white shadow-md">
            <h3 className="text-lg font-bold text-slate-905 mb-4 flex items-center space-x-2">
              <Filter className="w-5 h-5 text-orange-500" />
              <span>Select Amenities to Filter Rooms</span>
            </h3>
            <div className="flex flex-wrap gap-3">
              {allAvailableAmenities.map((amenity) => {
                const isChecked = selectedAmenities.includes(amenity.amenityId);
                return (
                  <button
                    key={amenity.amenityId}
                    onClick={() => handleToggleAmenity(amenity.amenityId)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border flex items-center space-x-2 transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-orange-100 border-orange-500 text-orange-600 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-350 hover:text-slate-800'
                    }`}
                  >
                    {getAmenityIcon(amenity.amenityName)}
                    <span>{amenity.amenityName}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Alternative Rooms Alert Banner */}
        {showingAlternatives && (
          <div className="mb-8 p-4 bg-amber-50 border border-amber-100 text-amber-700 rounded-xl flex items-start space-x-2 text-sm text-left">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>No rooms match all selected amenities. Showing all available rooms as alternatives.</span>
          </div>
        )}

        {/* Rooms Listing */}
        <h2 className="text-2xl font-extrabold text-slate-900 text-left mb-6">Available Rooms</h2>

        {roomsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2].map((n) => (
              <div key={n} className="glass-card h-80 rounded-2xl overflow-hidden shimmer border border-slate-200 bg-white"></div>
            ))}
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="glass-card p-12 rounded-2xl border border-slate-200 text-center bg-white shadow-md">
            <p className="text-slate-500">No rooms are available for the selected dates. Please try adjusting your check-in or check-out options.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRooms.map((room) => (
              <div key={room.roomId} className="glass-card rounded-2xl border border-slate-100 overflow-hidden flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 group bg-white shadow-md">
                <div className="p-6 text-left">
                  {/* Category Header */}
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-orange-100 text-orange-600 border border-orange-200">
                      {room.categoryName}
                    </span>
                    <span className="text-sm font-semibold text-slate-400">Room: {room.roomNumber}</span>
                  </div>

                  {/* Bed Icon */}
                  <div className="flex items-center space-x-2 text-slate-800 font-bold text-xl mb-4">
                    <Bed className="w-5 h-5 text-orange-500" />
                    <span>Double Bed Premier</span>
                  </div>

                  {/* Price */}
                  <div className="mb-6 flex items-baseline space-x-1">
                    <span className="text-3xl font-extrabold text-slate-900">{formatPrice(room.price)}</span>
                    <span className="text-xs text-slate-500 uppercase tracking-wide">/ night</span>
                  </div>

                  {/* Amenities */}
                  <div className="border-t border-slate-100 pt-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Amenities Included</h4>
                    <div className="flex flex-wrap gap-2">
                      {room.amenities.map((amenity) => (
                        <span key={amenity.amenityId} className="inline-flex items-center space-x-1 text-xs px-2.5 py-1 rounded bg-slate-50 text-slate-600 border border-slate-200">
                          {getAmenityIcon(amenity.amenityName)}
                          <span>{amenity.amenityName}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    onClick={() => handleBookRoom(room.roomId)}
                    className="w-full text-center py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-sm font-bold shadow-md transition-all duration-200 cursor-pointer"
                  >
                    Select & Book Room
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default HotelDetails;
