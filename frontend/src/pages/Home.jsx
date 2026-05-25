import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLocations, getHotels } from '../services/hotelService';
import { getPromotions } from '../services/promotionService';
import { Search, Calendar, MapPin, Sparkles, Shield, Award, Tag } from 'lucide-react';

const Home = () => {
  const [locations, setLocations] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [promos, setPromos] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const locs = await getLocations();
        setLocations(locs);
        
        const hList = await getHotels();
        setHotels(hList.slice(0, 3)); // Show top 3 featured hotels

        const pList = await getPromotions();
        setPromos(pList.slice(0, 2)); // Show top 2 active promos
      } catch (err) {
        console.error('Error loading home data:', err);
      }
    };
    loadHomeData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!checkIn || !checkOut) {
      alert('Please select both Check-In and Check-Out dates.');
      return;
    }
    const params = new URLSearchParams({
      location: selectedLocation,
      checkIn,
      checkOut
    });
    navigate(`/hotels?${params.toString()}`);
  };

  return (
    <div className="min-height-screen bg-slate-50 pb-16 text-slate-800">
      {/* Hero Section */}
      <div className="relative h-[600px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50/30 to-slate-50 border-b border-slate-100">
        {/* Decorative Glow */}
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-orange-400/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-amber-400/10 rounded-full blur-[100px] animate-pulse"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span>Discover Luxury Accommodations</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
            Crafting Unforgettable <br/>
            <span className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
              Luxury Escapes
            </span>
          </h1>

          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Find and book premium stays, explore local attractions, and unlock seasonal discounts with AuraStay. Safe and simple reservations.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="glass p-5 rounded-2xl shadow-xl max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-white border border-slate-200">
            {/* Location Select */}
            <div className="text-left">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-orange-500" />
                <span>Destination</span>
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-orange-500 transition-all cursor-pointer"
              >
                <option value="">Any Location</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Check In Date */}
            <div className="text-left">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-orange-500" />
                <span>Check-In</span>
              </label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-orange-500 transition-all cursor-pointer"
                required
              />
            </div>

            {/* Check Out Date */}
            <div className="text-left">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-orange-500" />
                <span>Check-Out</span>
              </label>
              <input
                type="date"
                min={checkIn || new Date().toISOString().split('T')[0]}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-orange-500 transition-all cursor-pointer"
                required
              />
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all duration-200 cursor-pointer"
            >
              <Search className="w-5 h-5" />
              <span>Search Rooms</span>
            </button>
          </form>
        </div>
      </div>

      {/* Trust & Features Banner */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 -mt-8 relative z-20">
        <div className="glass p-6 rounded-xl flex items-center space-x-4 bg-white shadow-lg border border-slate-100">
          <div className="p-3 bg-orange-500/10 border border-orange-500/20 text-orange-600 rounded-lg">
            <Shield className="w-6 h-6" />
          </div>
          <div className="text-left">
            <h4 className="font-bold text-slate-850 text-base">Secure Checkout</h4>
            <p className="text-sm text-slate-500">100% encryption on all financial records and user logins.</p>
          </div>
        </div>
        <div className="glass p-6 rounded-xl flex items-center space-x-4 bg-white shadow-lg border border-slate-100">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-lg">
            <Award className="w-6 h-6" />
          </div>
          <div className="text-left">
            <h4 className="font-bold text-slate-850 text-base">Best Rates Guaranteed</h4>
            <p className="text-sm text-slate-500">Apply promotions and promo codes for seasonal savings.</p>
          </div>
        </div>
        <div className="glass p-6 rounded-xl flex items-center space-x-4 bg-white shadow-lg border border-slate-100">
          <div className="p-3 bg-orange-500/10 border border-orange-500/20 text-orange-600 rounded-lg">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="text-left">
            <h4 className="font-bold text-slate-850 text-base">Instantly Booked</h4>
            <p className="text-sm text-slate-500">Automatic real-time availability check and email confirmation.</p>
          </div>
        </div>
      </div>

      {/* Featured Hotels */}
      <div className="max-w-7xl mx-auto px-6 mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div className="text-left">
            <h2 className="text-3xl font-extrabold text-slate-900">Featured Destinations</h2>
            <p className="text-slate-500 mt-2">Explore some of our highly rated premier luxury hotels.</p>
          </div>
          <button onClick={() => navigate('/hotels')} className="text-orange-600 hover:text-orange-700 font-bold flex items-center space-x-1 mt-4 md:mt-0 transition-all cursor-pointer">
            <span>Browse All Hotels</span>
            <span>&rarr;</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {hotels.map((hotel) => (
            <div key={hotel.hotelId} className="glass-card rounded-2xl overflow-hidden shadow-md group hover:-translate-y-1 transition-all duration-300 bg-white">
              <div className="relative h-56 bg-slate-200 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent z-10"></div>
                <div className="text-4xl text-orange-500 group-hover:scale-110 transition-transform duration-300">🏨</div>
                <span className="absolute bottom-4 left-4 z-20 bg-orange-600 text-white text-xs font-bold uppercase px-3 py-1 rounded-full flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>{hotel.location}</span>
                </span>
              </div>
              <div className="p-6 text-left">
                <h3 className="text-xl font-bold text-slate-900 mb-2 leading-snug group-hover:text-orange-600 transition-colors">{hotel.hotelName}</h3>
                <p className="text-slate-500 text-sm line-clamp-3 mb-6 leading-relaxed">{hotel.description}</p>
                <button
                  onClick={() => navigate(`/hotels/${hotel.hotelId}`)}
                  className="w-full text-center py-2.5 px-4 bg-slate-50 hover:bg-orange-600/10 border border-slate-200 hover:border-orange-500/30 text-orange-600 hover:text-orange-700 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer"
                >
                  View Details & Rooms
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Special Offers / Promotions */}
      <div className="max-w-7xl mx-auto px-6 mt-24">
        <div className="glass p-8 md:p-12 rounded-3xl relative overflow-hidden bg-gradient-to-r from-orange-50 via-amber-50/20 to-orange-50 border border-orange-100 shadow-md">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-left">
              <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 text-xs font-bold mb-4">
                <Tag className="w-3.5 h-3.5" />
                <span>Active Promotion Offers</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Exclusive Seasonal Savings</h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                Copy and apply our discount coupon codes during booking checkout to enjoy premium services at slashed pricing!
              </p>
              <button onClick={() => navigate('/promotions')} className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg transition-all cursor-pointer">
                View All Promotions
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {promos.map((promo) => (
                <div key={promo.promotionId} className="glass-card p-6 rounded-2xl flex justify-between items-center border border-slate-200 bg-white">
                  <div className="text-left">
                    <h4 className="text-lg font-bold text-slate-900 mb-1">{promo.promoCode}</h4>
                    <p className="text-sm text-slate-500">Save {promo.discountPercentage}% on your total reservation amount.</p>
                    <p className="text-xs text-orange-600 mt-2 font-medium">Valid until: {promo.endDate}</p>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(promo.promoCode);
                      alert(`Promo code "${promo.promoCode}" copied to clipboard!`);
                    }}
                    className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-orange-600 border border-slate-200 text-sm font-bold rounded-lg transition-all cursor-pointer"
                  >
                    Copy
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
