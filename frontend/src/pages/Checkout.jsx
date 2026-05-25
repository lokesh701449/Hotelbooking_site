import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getRoomById } from '../services/roomService';
import { getPromotionByCode } from '../services/promotionService';
import { createBooking } from '../services/bookingService';
import { formatPrice } from '../utils/priceFormatter';
import { Calendar, Tag, ShieldCheck, CreditCard, Lock, ArrowLeft, Loader, CheckCircle } from 'lucide-react';

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const roomId = searchParams.get('roomId');
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');

  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const [bookingSuccess, setBookingSuccess] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate(`/login?redirect=/checkout?roomId=${roomId}&checkIn=${checkIn}&checkOut=${checkOut}`);
      return;
    }

    const loadCheckoutRoom = async () => {
      setLoading(true);
      try {
        const data = await getRoomById(roomId);
        setRoom(data);
      } catch (err) {
        console.error('Error fetching room details:', err);
      } finally {
        setLoading(false);
      }
    };
    loadCheckoutRoom();
  }, [roomId, user]);

  const getNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = end - start;
    return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
  };

  const getOriginalTotal = () => {
    if (!room) return 0;
    return room.price * getNights();
  };

  const getDiscountAmount = () => {
    if (!appliedPromo) return 0;
    return (getOriginalTotal() * appliedPromo.discountPercentage) / 100;
  };

  const getFinalTotal = () => {
    return getOriginalTotal() - getDiscountAmount();
  };

  const handleApplyPromo = async () => {
    setPromoError('');
    setAppliedPromo(null);
    if (!promoCode.trim()) return;

    try {
      const promo = await getPromotionByCode(promoCode.toUpperCase().trim());
      const today = new Date();
      const start = new Date(promo.startDate);
      const end = new Date(promo.endDate);
      
      if (today < start || today > end) {
        setPromoError('This promotion coupon has expired.');
        return;
      }
      setAppliedPromo(promo);
    } catch (err) {
      setPromoError('Invalid promotion code.');
    }
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      const bookingRequest = {
        userId: user.id,
        roomId: room.roomId,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        promoCode: appliedPromo ? appliedPromo.promoCode : null,
        paymentMethod
      };

      const bookingResponse = await createBooking(bookingRequest);
      setBookingSuccess(bookingResponse);
    } catch (err) {
      alert(err.response?.data?.message || 'Checkout failed. Room might already be booked.');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-height-screen bg-slate-50 flex items-center justify-center">
        <Loader className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (bookingSuccess) {
    return (
      <div className="min-height-screen bg-slate-50 py-20 px-6 flex items-center justify-center text-slate-800">
        <div className="max-w-xl w-full glass-card p-8 md:p-12 rounded-3xl border border-slate-200 text-center relative overflow-hidden bg-white shadow-xl">
          <div className="mx-auto w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-8 h-8" />
          </div>

          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Stay Confirmed!</h2>
          <p className="text-slate-500 text-sm mb-6 font-medium">Your room is booked. A confirmation email has been dispatched to: <strong className="text-slate-800">{user.email}</strong></p>

          {/* Booking Summary Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left mb-8 space-y-3.5">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Reservation Code</span>
              <span className="text-sm font-extrabold text-orange-600">{bookingSuccess.reservationNumber}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Hotel Name</span>
              <span className="font-semibold text-slate-800">{bookingSuccess.hotelName}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Room Number</span>
              <span className="font-semibold text-slate-800">{bookingSuccess.roomNumber}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Dates</span>
              <span className="font-semibold text-slate-800">{bookingSuccess.checkInDate} to {bookingSuccess.checkOutDate}</span>
            </div>
            <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-200 font-bold text-slate-800">
              <span>Total Paid</span>
              <span className="text-orange-600 font-extrabold text-lg">{formatPrice(bookingSuccess.finalAmount)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/bookings-history')}
            className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl shadow-lg transition-all cursor-pointer"
          >
            Go to Booking History
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-height-screen bg-slate-50 py-12 px-6 text-slate-850">
      <div className="max-w-6xl mx-auto">
        
        {/* Back Link */}
        <button onClick={() => navigate(-1)} className="flex items-center space-x-1.5 text-slate-500 hover:text-orange-600 font-bold mb-8 transition-all cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <h1 className="text-3xl font-extrabold text-slate-900 text-left mb-10">Complete Your Reservation</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Checkout Form */}
          <form onSubmit={handleCheckoutSubmit} className="lg:col-span-2 space-y-8">
            
            {/* Step 1: Booking Dates & Details */}
            <div className="glass-card p-6 md:p-8 rounded-2xl border border-slate-200 text-left bg-white shadow-md">
              <h3 className="text-lg font-bold text-slate-905 mb-6 flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-orange-500" />
                <span>1. Booking Summary</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <p className="text-slate-500">Hotel</p>
                  <p className="font-semibold text-slate-800 mt-1">{room.hotelName}</p>
                </div>
                <div>
                  <p className="text-slate-500">Room Number & Category</p>
                  <p className="font-semibold text-slate-800 mt-1">{room.roomNumber} ({room.categoryName})</p>
                </div>
                <div>
                  <p className="text-slate-500">Check-In Date</p>
                  <p className="font-semibold text-slate-800 mt-1">{checkIn}</p>
                </div>
                <div>
                  <p className="text-slate-500">Check-Out Date</p>
                  <p className="font-semibold text-slate-800 mt-1">{checkOut}</p>
                </div>
              </div>
            </div>

            {/* Step 2: Payment Details */}
            <div className="glass-card p-6 md:p-8 rounded-2xl border border-slate-200 text-left space-y-6 bg-white shadow-md">
              <h3 className="text-lg font-bold text-slate-905 flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-orange-500" />
                <span>2. Payment Details</span>
              </h3>

              {/* Payment Methods */}
              <div className="grid grid-cols-3 gap-4">
                {['CREDIT_CARD', 'PAYPAL', 'CASH'].map((method) => (
                  <label
                    key={method}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === method ? 'bg-orange-50 border-orange-500 text-orange-600' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={() => setPaymentMethod(method)}
                      className="sr-only"
                    />
                    <span className="text-xs font-bold uppercase tracking-wider">{method.replace('_', ' ')}</span>
                  </label>
                ))}
              </div>

              {/* Card Form Simulation */}
              {paymentMethod === 'CREDIT_CARD' && (
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-550 mb-2">Cardholder Name</label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-orange-500"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-550 mb-2">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        maxLength="16"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-orange-500"
                        placeholder="4111 2222 3333 4444"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-550 mb-2">Expiration Date</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        maxLength="5"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-orange-500"
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-550 mb-2">CVV Security Code</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        maxLength="3"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-orange-500"
                        placeholder="•••"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'PAYPAL' && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500">
                  Transaction will be processed securely via PayPal. You will sign in with your PayPal credentials.
                </div>
              )}

              {paymentMethod === 'CASH' && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500">
                  Payment is handled at the resort desk during check-in.
                </div>
              )}
            </div>

            {/* Checkout CTA */}
            <button
              type="submit"
              disabled={submitLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {submitLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  <span>Confirm and Pay {formatPrice(getFinalTotal())}</span>
                </>
              )}
            </button>

          </form>

          {/* Pricing Breakdown Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Promo code card */}
            <div className="glass-card p-6 rounded-2xl border border-slate-200 text-left bg-white shadow-md">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center space-x-2">
                <Tag className="w-4.5 h-4.5 text-orange-500" />
                <span>Apply Promotion</span>
              </h3>

              <div className="flex space-x-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="WELCOME10"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-orange-500 uppercase"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Apply
                </button>
              </div>

              {promoError && <p className="text-xs text-rose-600 mt-2 font-medium">{promoError}</p>}
              {appliedPromo && (
                <p className="text-xs text-emerald-600 mt-2 font-medium">
                  Coupon Applied: Save {appliedPromo.discountPercentage}%!
                </p>
              )}
            </div>

            {/* Pricing details */}
            <div className="glass-card p-6 rounded-2xl border border-slate-200 text-left space-y-4 bg-white shadow-md">
              <h3 className="text-base font-bold text-slate-905 pb-3 border-b border-slate-105">Pricing Summary</h3>

              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Rate ({formatPrice(room.price)} &times; {getNights()} Nights)</span>
                <span className="font-semibold text-slate-800">{formatPrice(getOriginalTotal())}</span>
              </div>

              {appliedPromo && (
                <div className="flex justify-between items-center text-sm text-emerald-600">
                  <span>Promo Discount ({appliedPromo.discountPercentage}%)</span>
                  <span>-{formatPrice(getDiscountAmount())}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Local Taxes / Resort Fees</span>
                <span className="font-semibold text-slate-800">Included</span>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-100 font-bold text-slate-800">
                <span className="text-base">Total Cost</span>
                <span className="text-orange-600 text-xl font-extrabold">{formatPrice(getFinalTotal())}</span>
              </div>

              <div className="flex items-center space-x-2 text-xs text-slate-400 pt-2">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>SSL Encrypted Transaction Security</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Checkout;
