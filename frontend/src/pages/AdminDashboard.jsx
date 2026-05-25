import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getAllBookings } from '../services/bookingService';
import { getHotels, createHotel, deleteHotel } from '../services/hotelService';
import { getAllRooms, createRoom, deleteRoom } from '../services/roomService';
import { getPromotions, createPromotion } from '../services/promotionService';
import { formatPrice } from '../utils/priceFormatter';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  BedDouble, 
  CalendarCheck, 
  Percent, 
  Plus, 
  Trash2, 
  ShieldAlert, 
  Loader, 
  ListOrdered,
  FileSpreadsheet
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('bookings');
  const [loading, setLoading] = useState(true);

  // Lists
  const [bookings, setBookings] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [promotions, setPromotions] = useState([]);

  // Forms
  const [hotelForm, setHotelForm] = useState({ hotelName: '', location: '', description: '' });
  const [roomForm, setRoomForm] = useState({ hotelId: '', roomNumber: '', categoryId: '1', price: '', availabilityStatus: true });
  const [promoForm, setPromoForm] = useState({ promoCode: '', discountPercentage: '', startDate: '', endDate: '' });

  // Errors / Success States
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'bookings') {
        const data = await getAllBookings();
        setBookings(data);
      } else if (activeTab === 'hotels') {
        const data = await getHotels();
        setHotels(data);
      } else if (activeTab === 'rooms') {
        const rData = await getAllRooms();
        const hData = await getHotels();
        setRooms(rData);
        setHotels(hData);
        if (hData.length > 0 && !roomForm.hotelId) {
          setRoomForm(prev => ({ ...prev, hotelId: hData[0].hotelId }));
        }
      } else if (activeTab === 'promotions') {
        const data = await getPromotions();
        setPromotions(data);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'ROLE_ADMIN') {
      navigate('/');
      return;
    }
    loadData();
  }, [user, activeTab]);

  const handleAddHotel = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    try {
      await createHotel(hotelForm);
      setFormSuccess('Hotel created successfully!');
      setHotelForm({ hotelName: '', location: '', description: '' });
      loadData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create hotel.');
    }
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    try {
      const roomPayload = {
        hotelId: parseInt(roomForm.hotelId),
        roomNumber: roomForm.roomNumber,
        categoryId: parseInt(roomForm.categoryId),
        price: parseFloat(roomForm.price),
        availabilityStatus: roomForm.availabilityStatus
      };
      await createRoom(roomPayload);
      setFormSuccess('Room added successfully!');
      setRoomForm(prev => ({ ...prev, roomNumber: '', price: '' }));
      loadData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to add room.');
    }
  };

  const handleAddPromotion = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    try {
      const promoPayload = {
        promoCode: promoForm.promoCode.toUpperCase().trim(),
        discountPercentage: parseFloat(promoForm.discountPercentage),
        startDate: promoForm.startDate,
        endDate: promoForm.endDate
      };
      await createPromotion(promoPayload);
      setFormSuccess('Promotion created successfully!');
      setPromoForm({ promoCode: '', discountPercentage: '', startDate: '', endDate: '' });
      loadData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create promotion.');
    }
  };

  const handleDeleteHotel = async (id) => {
    if (!window.confirm('Are you sure you want to delete this hotel?')) return;
    try {
      await deleteHotel(id);
      loadData();
    } catch (err) {
      alert('Cannot delete hotel. It might have linked rooms or active bookings.');
    }
  };

  const handleDeleteRoom = async (id) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;
    try {
      await deleteRoom(id);
      loadData();
    } catch (err) {
      alert('Cannot delete room. It might have active booking reservations.');
    }
  };

  const getCategoryName = (catId) => {
    const names = {
      1: 'Standard Room',
      2: 'Deluxe Room',
      3: 'Executive Suite',
      4: 'Presidential Penthouse'
    };
    return names[catId] || 'Room';
  };

  return (
    <div className="min-height-screen bg-slate-50 py-12 px-6 text-slate-805">
      <div className="max-w-7xl mx-auto">
        
        {/* Dashboard Title */}
        <div className="text-left mb-10 border-b border-slate-200 pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Admin Operations</h1>
            <p className="text-slate-550 mt-1">Manage listings, rooms, discounts, and monitor global reservations.</p>
          </div>
          <span className="bg-orange-500 text-white font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center space-x-1">
            <span>Admin Mode</span>
          </span>
        </div>

        {/* Form status banners */}
        {formSuccess && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl text-sm font-semibold text-left">
            {formSuccess}
          </div>
        )}
        {formError && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-sm font-semibold text-left">
            {formError}
          </div>
        )}

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 mb-8 overflow-x-auto space-x-1">
          <button 
            onClick={() => { setActiveTab('bookings'); setFormSuccess(''); setFormError(''); }}
            className={`px-6 py-3.5 font-bold text-sm flex items-center space-x-2 transition-all cursor-pointer shrink-0 border-b-2 ${
              activeTab === 'bookings' 
                ? 'border-orange-500 text-orange-600 bg-orange-50/50' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Manage Bookings</span>
          </button>
          
          <button 
            onClick={() => { setActiveTab('hotels'); setFormSuccess(''); setFormError(''); }}
            className={`px-6 py-3.5 font-bold text-sm flex items-center space-x-2 transition-all cursor-pointer shrink-0 border-b-2 ${
              activeTab === 'hotels' 
                ? 'border-orange-500 text-orange-600 bg-orange-50/50' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Manage Hotels</span>
          </button>

          <button 
            onClick={() => { setActiveTab('rooms'); setFormSuccess(''); setFormError(''); }}
            className={`px-6 py-3.5 font-bold text-sm flex items-center space-x-2 transition-all cursor-pointer shrink-0 border-b-2 ${
              activeTab === 'rooms' 
                ? 'border-orange-500 text-orange-600 bg-orange-50/50' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BedDouble className="w-4 h-4" />
            <span>Manage Rooms</span>
          </button>

          <button 
            onClick={() => { setActiveTab('promotions'); setFormSuccess(''); setFormError(''); }}
            className={`px-6 py-3.5 font-bold text-sm flex items-center space-x-2 transition-all cursor-pointer shrink-0 border-b-2 ${
              activeTab === 'promotions' 
                ? 'border-orange-500 text-orange-600 bg-orange-50/50' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Percent className="w-4 h-4" />
            <span>Manage Promotions</span>
          </button>
        </div>

        {/* Tab Contents */}
        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader className="w-8 h-8 text-orange-500 animate-spin" />
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* 1. Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="glass-card rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-md">
                <div className="p-6 border-b border-slate-100 text-left flex items-center space-x-2">
                  <ListOrdered className="w-5 h-5 text-orange-500" />
                  <h3 className="text-lg font-bold text-slate-900">Total System Bookings</h3>
                </div>

                {bookings.length === 0 ? (
                  <div className="p-12 text-center text-slate-500">
                    No reservations have been placed yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-xs font-bold">
                          <th className="px-6 py-4">Reservation Code</th>
                          <th className="px-6 py-4">Guest Name</th>
                          <th className="px-6 py-4">Hotel / Location</th>
                          <th className="px-6 py-4">Room No.</th>
                          <th className="px-6 py-4">Dates</th>
                          <th className="px-6 py-4">Amount Paid</th>
                          <th className="px-6 py-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {bookings.map((booking) => (
                          <tr key={booking.bookingId} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 text-orange-600 font-extrabold">{booking.reservationNumber}</td>
                            <td className="px-6 py-4 text-slate-800 font-bold">{booking.userName || 'Customer'}</td>
                            <td className="px-6 py-4 text-slate-600">{booking.hotelName}</td>
                            <td className="px-6 py-4 text-slate-500">{booking.roomNumber}</td>
                            <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{booking.checkInDate} to {booking.checkOutDate}</td>
                            <td className="px-6 py-4 font-bold text-slate-900">{formatPrice(booking.finalAmount)}</td>
                            <td className="px-6 py-4">
                              <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                booking.status === 'BOOKED' 
                                  ? 'bg-emerald-100 text-emerald-600 border border-emerald-200' 
                                  : 'bg-rose-100 text-rose-600 border border-rose-200'
                              }`}>
                                {booking.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* 2. Hotels Tab */}
            {activeTab === 'hotels' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Form to Add Hotel */}
                <div className="lg:col-span-1">
                  <div className="glass-card p-6 rounded-2xl border border-slate-200 bg-white shadow-md text-left sticky top-24">
                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center space-x-2 border-b border-slate-100 pb-3">
                      <Plus className="w-5 h-5 text-orange-500" />
                      <span>Create Hotel</span>
                    </h3>

                    <form onSubmit={handleAddHotel} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Hotel Name</label>
                        <input
                          type="text"
                          value={hotelForm.hotelName}
                          onChange={(e) => setHotelForm({ ...hotelForm, hotelName: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-orange-500"
                          placeholder="Imperial Vista Resort"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Location</label>
                        <input
                          type="text"
                          value={hotelForm.location}
                          onChange={(e) => setHotelForm({ ...hotelForm, location: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-orange-500"
                          placeholder="Malibu, CA"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Description</label>
                        <textarea
                          value={hotelForm.description}
                          onChange={(e) => setHotelForm({ ...hotelForm, description: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-orange-500 h-28"
                          placeholder="A premium seaside sanctuary featuring heated thermal spas, organic local dining..."
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer"
                      >
                        Publish Hotel
                      </button>
                    </form>
                  </div>
                </div>

                {/* List Hotels */}
                <div className="lg:col-span-2">
                  <div className="glass-card rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-md">
                    <div className="p-6 border-b border-slate-100 text-left">
                      <h3 className="text-lg font-bold text-slate-900">Hotel Properties</h3>
                    </div>

                    {hotels.length === 0 ? (
                      <div className="p-12 text-center text-slate-500">
                        No hotels available in database.
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {hotels.map((hotel) => (
                          <div key={hotel.hotelId} className="p-6 text-left flex justify-between items-start hover:bg-slate-50/50 transition-all">
                            <div className="space-y-1 max-w-xl">
                              <h4 className="font-bold text-slate-900 text-base">{hotel.hotelName}</h4>
                              <p className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded w-max">{hotel.location}</p>
                              <p className="text-sm text-slate-550 pt-2">{hotel.description}</p>
                            </div>
                            <button
                              onClick={() => handleDeleteHotel(hotel.hotelId)}
                              className="p-2 border border-slate-200 hover:border-rose-500 hover:text-rose-600 rounded-lg text-slate-400 transition-all cursor-pointer shrink-0 ml-4"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* 3. Rooms Tab */}
            {activeTab === 'rooms' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Form to Add Room */}
                <div className="lg:col-span-1">
                  <div className="glass-card p-6 rounded-2xl border border-slate-200 bg-white shadow-md text-left sticky top-24">
                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center space-x-2 border-b border-slate-100 pb-3">
                      <Plus className="w-5 h-5 text-orange-500" />
                      <span>Add Hotel Room</span>
                    </h3>

                    {hotels.length === 0 ? (
                      <p className="text-xs text-rose-500">Please seed or create a hotel first before adding rooms.</p>
                    ) : (
                      <form onSubmit={handleAddRoom} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Select Hotel</label>
                          <select
                            value={roomForm.hotelId}
                            onChange={(e) => setRoomForm({ ...roomForm, hotelId: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-805 focus:outline-none focus:border-orange-500 transition-all cursor-pointer"
                          >
                            {hotels.map((h) => (
                              <option key={h.hotelId} value={h.hotelId}>{h.hotelName}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Room Number</label>
                          <input
                            type="text"
                            value={roomForm.roomNumber}
                            onChange={(e) => setRoomForm({ ...roomForm, roomNumber: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-orange-500"
                            placeholder="M-305"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Room Category</label>
                          <select
                            value={roomForm.categoryId}
                            onChange={(e) => setRoomForm({ ...roomForm, categoryId: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-805 focus:outline-none focus:border-orange-500 transition-all cursor-pointer"
                          >
                            <option value="1">Standard Room</option>
                            <option value="2">Deluxe Room</option>
                            <option value="3">Executive Suite</option>
                            <option value="4">Presidential Penthouse</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Price per Night ($ Value)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={roomForm.price}
                            onChange={(e) => setRoomForm({ ...roomForm, price: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-orange-500"
                            placeholder="149.99"
                            required
                          />
                          <p className="text-[10px] text-slate-400 mt-1">Note: Enter base price. Frontend will auto-convert to Rupees (e.g. 100 becomes ₹5,000).</p>
                        </div>
                        <button
                          type="submit"
                          className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer"
                        >
                          Save Room
                        </button>
                      </form>
                    )}
                  </div>
                </div>

                {/* List Rooms */}
                <div className="lg:col-span-2">
                  <div className="glass-card rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-md">
                    <div className="p-6 border-b border-slate-100 text-left">
                      <h3 className="text-lg font-bold text-slate-900">Total System Rooms</h3>
                    </div>

                    {rooms.length === 0 ? (
                      <div className="p-12 text-center text-slate-500">
                        No rooms configured in database.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-xs font-bold">
                              <th className="px-6 py-4">Hotel Name</th>
                              <th className="px-6 py-4">Room No.</th>
                              <th className="px-6 py-4">Category</th>
                              <th className="px-6 py-4">Price</th>
                              <th className="px-6 py-4">Availability</th>
                              <th className="px-6 py-4">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-medium">
                            {rooms.map((room) => (
                              <tr key={room.roomId} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 text-slate-800 font-bold">{room.hotelName}</td>
                                <td className="px-6 py-4 text-slate-500 font-mono">{room.roomNumber}</td>
                                <td className="px-6 py-4 text-slate-600">{room.categoryName || getCategoryName(room.categoryId)}</td>
                                <td className="px-6 py-4 font-bold text-slate-900">{formatPrice(room.price)}</td>
                                <td className="px-6 py-4">
                                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                    room.availabilityStatus 
                                      ? 'bg-emerald-100 text-emerald-600 border border-emerald-200' 
                                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                                  }`}>
                                    {room.availabilityStatus ? 'Available' : 'Booked'}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <button
                                    onClick={() => handleDeleteRoom(room.roomId)}
                                    className="p-1.5 border border-slate-200 hover:border-rose-500 hover:text-rose-600 rounded text-slate-400 transition-all cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* 4. Promotions Tab */}
            {activeTab === 'promotions' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Form to Add Promotion */}
                <div className="lg:col-span-1">
                  <div className="glass-card p-6 rounded-2xl border border-slate-200 bg-white shadow-md text-left sticky top-24">
                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center space-x-2 border-b border-slate-100 pb-3">
                      <Plus className="w-5 h-5 text-orange-500" />
                      <span>Create Promotion</span>
                    </h3>

                    <form onSubmit={handleAddPromotion} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Coupon Code</label>
                        <input
                          type="text"
                          value={promoForm.promoCode}
                          onChange={(e) => setPromoForm({ ...promoForm, promoCode: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 uppercase focus:outline-none focus:border-orange-500"
                          placeholder="AUTUMN25"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Discount Percentage</label>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={promoForm.discountPercentage}
                          onChange={(e) => setPromoForm({ ...promoForm, discountPercentage: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-orange-500"
                          placeholder="25"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Start Date</label>
                        <input
                          type="date"
                          value={promoForm.startDate}
                          onChange={(e) => setPromoForm({ ...promoForm, startDate: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-orange-500 cursor-pointer"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">End Date</label>
                        <input
                          type="date"
                          value={promoForm.endDate}
                          onChange={(e) => setPromoForm({ ...promoForm, endDate: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-orange-500 cursor-pointer"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer"
                      >
                        Create Promotion
                      </button>
                    </form>
                  </div>
                </div>

                {/* List Promotions */}
                <div className="lg:col-span-2">
                  <div className="glass-card rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-md">
                    <div className="p-6 border-b border-slate-100 text-left">
                      <h3 className="text-lg font-bold text-slate-900">Active Coupons</h3>
                    </div>

                    {promotions.length === 0 ? (
                      <div className="p-12 text-center text-slate-500">
                        No active promotional campaigns.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-xs font-bold">
                              <th className="px-6 py-4">Promo Code</th>
                              <th className="px-6 py-4">Discount</th>
                              <th className="px-6 py-4">Start Date</th>
                              <th className="px-6 py-4">End Date</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-medium">
                            {promotions.map((promo) => (
                              <tr key={promo.promotionId} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 text-slate-900 font-extrabold tracking-widest">{promo.promoCode}</td>
                                <td className="px-6 py-4 text-orange-600 font-extrabold">{promo.discountPercentage}% OFF</td>
                                <td className="px-6 py-4 text-slate-550">{promo.startDate}</td>
                                <td className="px-6 py-4 text-slate-550">{promo.endDate}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
