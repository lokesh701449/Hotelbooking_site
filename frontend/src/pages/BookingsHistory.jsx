import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getBookingsByUser, cancelBooking } from '../services/bookingService';
import { formatPrice } from '../utils/priceFormatter';
import { Calendar, MapPin, Hash, Trash2, ShieldAlert, Loader, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BookingsHistory = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchBookings = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getBookingsByUser(user.id);
      // Sort bookings: active/booked ones first, then by date descending
      const sorted = data.sort((a, b) => {
        if (a.status === 'BOOKED' && b.status !== 'BOOKED') return -1;
        if (a.status !== 'BOOKED' && b.status === 'BOOKED') return 1;
        return new Date(b.checkInDate) - new Date(a.checkInDate);
      });
      setBookings(sorted);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/bookings-history');
      return;
    }
    fetchBookings();
  }, [user]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this hotel reservation? This action cannot be undone.')) {
      return;
    }

    setCancellingId(bookingId);
    try {
      await cancelBooking(bookingId);
      alert('Your reservation has been cancelled successfully.');
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel the reservation. Please try again.');
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-height-screen bg-slate-50 flex items-center justify-center">
        <Loader className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-height-screen bg-slate-50 py-12 px-6 text-slate-800">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 text-left">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900">My Reservations</h1>
            <p className="text-slate-555 mt-2">View and manage your active and past hotel room bookings.</p>
          </div>
          <button 
            onClick={fetchBookings} 
            className="mt-4 md:mt-0 flex items-center space-x-1.5 px-4 py-2 border border-slate-200 hover:border-orange-500 hover:text-orange-600 rounded-xl text-sm font-semibold transition-all cursor-pointer bg-white"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh Bookings</span>
          </button>
        </div>

        {bookings.length === 0 ? (
          <div className="glass-card p-12 rounded-3xl text-center border border-slate-200 bg-white shadow-md">
            <ShieldAlert className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900">No Reservations Found</h3>
            <p className="text-slate-500 mt-2 max-w-sm mx-auto">You haven't scheduled any hotel bookings yet. Explore our premier hotels and book a luxury stay!</p>
            <button 
              onClick={() => navigate('/hotels')} 
              className="mt-6 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer"
            >
              Browse Hotels
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div 
                key={booking.bookingId} 
                className={`glass-card p-6 md:p-8 rounded-2xl border transition-all duration-200 bg-white shadow-md text-left flex flex-col justify-between ${
                  booking.status === 'CANCELLED' 
                    ? 'border-slate-200 opacity-75' 
                    : 'border-orange-100 hover:border-orange-200'
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
                  
                  {/* Reservation Main Info */}
                  <div className="lg:col-span-2 space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        booking.status === 'BOOKED' 
                          ? 'bg-emerald-100 text-emerald-600 border border-emerald-200' 
                          : 'bg-rose-100 text-rose-600 border border-rose-200'
                      }`}>
                        {booking.status}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold flex items-center space-x-1">
                        <Hash className="w-3 h-3" />
                        <span>Code: {booking.reservationNumber}</span>
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-909 hover:text-orange-600 transition-colors">
                      {booking.hotelName}
                    </h3>

                    <p className="text-sm text-slate-500 flex items-center space-x-1.5">
                      <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                      <span>Room {booking.roomNumber} &bull; {booking.location || 'Miami, FL'}</span>
                    </p>
                  </div>

                  {/* Booking Dates */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2 text-slate-600">
                      <Calendar className="w-4 h-4 text-orange-500 shrink-0" />
                      <div>
                        <p className="text-xs text-slate-400 font-bold uppercase">Check-In</p>
                        <p className="font-semibold text-slate-800">{booking.checkInDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-600">
                      <Calendar className="w-4 h-4 text-orange-500 shrink-0" />
                      <div>
                        <p className="text-xs text-slate-400 font-bold uppercase">Check-Out</p>
                        <p className="font-semibold text-slate-800">{booking.checkOutDate}</p>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Actions */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between lg:justify-center space-y-4 sm:space-y-0 lg:space-y-4 w-full">
                    <div className="text-left lg:text-right">
                      <p className="text-xs font-bold uppercase text-slate-400">Total Paid</p>
                      <p className="text-2xl font-extrabold text-orange-600">{formatPrice(booking.finalAmount)}</p>
                    </div>

                    {booking.status === 'BOOKED' && (
                      <button
                        onClick={() => handleCancelBooking(booking.bookingId)}
                        disabled={cancellingId === booking.bookingId}
                        className="flex items-center space-x-1.5 px-4 py-2 border border-rose-200 hover:border-rose-350 text-rose-600 hover:bg-rose-50 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50"
                      >
                        {cancellingId === booking.bookingId ? (
                          <div className="w-4 h-4 border-2 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                        <span>Cancel Booking</span>
                      </button>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsHistory;
