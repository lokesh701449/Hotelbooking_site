import React, { useState, useEffect } from 'react';
import { getPromotions } from '../services/promotionService';
import { Tag, Calendar, Sparkles, Copy, CheckCircle2, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Promotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPromotions = async () => {
      setLoading(true);
      try {
        const data = await getPromotions();
        setPromotions(data);
      } catch (err) {
        console.error('Error fetching promotions:', err);
      } finally {
        setLoading(false);
      }
    };
    loadPromotions();
  }, []);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
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
        <div className="text-left mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span>Seasonal Travel Discounts</span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-905">Active Promotions & Offers</h1>
          <p className="text-slate-500 mt-2">Apply these promotional coupon codes at booking checkout to enjoy premium resort savings.</p>
        </div>

        {promotions.length === 0 ? (
          <div className="glass-card p-12 rounded-3xl text-center border border-slate-200 bg-white shadow-md">
            <Tag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">No active promotions available at the moment. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {promotions.map((promo) => (
              <div 
                key={promo.promotionId} 
                className="glass-card bg-white border border-orange-100 hover:border-orange-200 shadow-md rounded-2xl overflow-hidden flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 group text-left relative"
              >
                {/* Coupon Accent Bar */}
                <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-500 w-full"></div>
                
                <div className="p-6 md:p-8 space-y-6">
                  {/* Discount percentage badge */}
                  <div className="flex justify-between items-start">
                    <span className="text-4xl font-black text-orange-600 tracking-tight">
                      {promo.discountPercentage}% <span className="text-lg font-bold text-slate-500 uppercase tracking-normal">OFF</span>
                    </span>
                    <span className="text-xs bg-orange-50 text-orange-600 border border-orange-200 font-bold px-3 py-1 rounded-full">
                      Resort Deal
                    </span>
                  </div>

                  {/* Promo Code Box */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Coupon Code</p>
                      <p className="text-xl font-extrabold text-slate-900 tracking-widest mt-0.5">{promo.promoCode}</p>
                    </div>
                    
                    <button
                      onClick={() => handleCopyCode(promo.promoCode)}
                      className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                        copiedCode === promo.promoCode
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-600'
                          : 'bg-white border-slate-200 hover:border-orange-500 hover:text-orange-600 text-slate-500'
                      }`}
                    >
                      {copiedCode === promo.promoCode ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Validity Info */}
                  <div className="space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
                    <div className="flex items-center space-x-1.5">
                      <Calendar className="w-4 h-4 text-orange-500" />
                      <span>Starts: <strong>{promo.startDate}</strong></span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Calendar className="w-4 h-4 text-orange-500" />
                      <span>Expires: <strong>{promo.endDate}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button 
                    onClick={() => navigate('/hotels')}
                    className="w-full text-center py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-bold shadow-md transition-all duration-200 cursor-pointer"
                  >
                    Use Code Now
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

export default Promotions;
