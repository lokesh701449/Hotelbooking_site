import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Hotel, LogOut, User, Menu, X, History, Tag, LayoutDashboard, Home } from 'lucide-react';

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass sticky top-0 z-50 px-6 py-4 shadow-md bg-white">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-2 text-2xl font-extrabold tracking-wider bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent hover:opacity-90 transition-all">
          <Hotel className="w-8 h-8 text-orange-500 stroke-[2.5]" />
          <span>AURASTAY</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className={`flex items-center space-x-1.5 font-medium transition-all ${isActive('/') ? 'text-orange-600' : 'text-slate-600 hover:text-orange-600'}`}>
            <Home className="w-4.5 h-4.5" />
            <span>Home</span>
          </Link>
          <Link to="/hotels" className={`flex items-center space-x-1.5 font-medium transition-all ${isActive('/hotels') ? 'text-orange-600' : 'text-slate-600 hover:text-orange-600'}`}>
            <Hotel className="w-4.5 h-4.5" />
            <span>Hotels</span>
          </Link>
          <Link to="/promotions" className={`flex items-center space-x-1.5 font-medium transition-all ${isActive('/promotions') ? 'text-orange-600' : 'text-slate-600 hover:text-orange-600'}`}>
            <Tag className="w-4.5 h-4.5" />
            <span>Offers</span>
          </Link>
        </div>

        {/* Desktop Profile / CTA */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200">
                <User className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-semibold text-slate-700">{user.name}</span>
              </div>
              
              <Link to="/bookings-history" className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive('/bookings-history') ? 'bg-orange-100 text-orange-600 border border-orange-200' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                <History className="w-4 h-4" />
                <span>My Bookings</span>
              </Link>

              {user.role === 'ROLE_ADMIN' && (
                <Link to="/admin" className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive('/admin') ? 'bg-orange-100 text-orange-600 border border-orange-200' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
              )}

              <button onClick={handleLogout} className="flex items-center space-x-1.5 px-4 py-2 border border-rose-200 hover:border-rose-300 text-rose-600 hover:bg-rose-50 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/login" className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-orange-600 transition-all">
                Sign In
              </Link>
              <Link to="/register" className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-lg text-sm font-bold shadow-md hover:-translate-y-0.5 transition-all duration-200">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 hover:text-orange-600 focus:outline-none cursor-pointer">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-slate-200 space-y-3">
          <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-orange-600">
            Home
          </Link>
          <Link to="/hotels" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-orange-600">
            Hotels
          </Link>
          <Link to="/promotions" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-orange-600">
            Offers
          </Link>
          
          {user ? (
            <div className="pt-2 border-t border-slate-200 space-y-2">
              <div className="px-3 py-1 text-sm font-semibold text-orange-600">
                Logged in as: {user.name}
              </div>
              <Link to="/bookings-history" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-950">
                My Bookings
              </Link>
              {user.role === 'ROLE_ADMIN' && (
                <Link to="/admin" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-950">
                  Admin Dashboard
                </Link>
              )}
              <button onClick={() => { setIsOpen(false); handleLogout(); }} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-rose-600 hover:bg-rose-50 cursor-pointer">
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-200 flex flex-col space-y-2">
              <Link to="/login" onClick={() => setIsOpen(false)} className="block text-center px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-orange-600">
                Sign In
              </Link>
              <Link to="/register" onClick={() => setIsOpen(false)} className="block text-center px-3 py-2.5 bg-orange-500 text-white rounded-md text-base font-medium hover:bg-orange-600">
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
