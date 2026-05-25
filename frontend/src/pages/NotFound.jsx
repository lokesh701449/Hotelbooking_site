import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-height-screen bg-slate-50 flex items-center justify-center py-20 px-6 text-slate-800">
      <div className="max-w-md w-full glass-card p-8 md:p-12 rounded-3xl border border-slate-200 text-center bg-white shadow-xl">
        <div className="mx-auto w-16 h-16 bg-orange-500/10 border border-orange-500/20 text-orange-600 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <h2 className="text-4xl font-black text-slate-900 mb-2">404</h2>
        <h3 className="text-xl font-bold text-slate-700 mb-4">Page Not Found</h3>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        <button
          onClick={() => navigate('/')}
          className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return Home</span>
        </button>
      </div>
    </div>
  );
};

export default NotFound;
