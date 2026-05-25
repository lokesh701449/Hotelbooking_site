import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Hotels from './pages/Hotels';
import HotelDetails from './pages/HotelDetails';
import Checkout from './pages/Checkout';
import BookingsHistory from './pages/BookingsHistory';
import Promotions from './pages/Promotions';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-slate-50">
          <Navbar />
          
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/hotels" element={<Hotels />} />
              <Route path="/hotels/:id" element={<HotelDetails />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/bookings-history" element={<BookingsHistory />} />
              <Route path="/promotions" element={<Promotions />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="bg-white border-t border-slate-200 py-8 px-6 text-center text-sm text-slate-500">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p>&copy; {new Date().getFullYear()} AuraStay Resorts Ltd. All rights reserved.</p>
              <div className="flex space-x-6">
                <a href="#" className="hover:text-orange-600 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-orange-650 transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-orange-600 transition-colors">Contact Support</a>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
