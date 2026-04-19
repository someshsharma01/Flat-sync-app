import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { Bell, LogOut, Home, PlusCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../utils/axiosInstance';
import toast from 'react-hot-toast';

const Navbar = ({ onLoginClick, onRegisterClick }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { notifications, setNotifications } = useSocket();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (isAuthenticated && showDropdown) {
      api.get('/requests/incoming').then((res) => {
        setRequests(res.data.filter(r => r.status === 'pending'));
      }).catch(console.error);
    }
  }, [showDropdown, isAuthenticated]);

  const handleAccept = async (id) => {
    try {
      await api.put(`/requests/${id}/accept`);
      toast.success('Request accepted');
      setRequests(requests.filter(r => r._id !== id));
      setNotifications(prev => Math.max(0, prev - 1));
    } catch {
      toast.error('Failed to accept');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/requests/${id}/reject`);
      toast.success('Request rejected');
      setRequests(requests.filter(r => r._id !== id));
      setNotifications(prev => Math.max(0, prev - 1));
    } catch {
      toast.error('Failed to reject');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50 px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Home className="w-6 h-6 text-primary-600" />
        <Link to="/" className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">FlatSync</Link>
      </div>

      <div className="flex items-center gap-6">
        <Link to="/" className="text-gray-600 hover:text-gray-900 transition font-medium">Home</Link>
        <a href="#about" className="text-gray-600 hover:text-gray-900 transition font-medium">About</a>
        <a href="#contact" className="text-gray-600 hover:text-gray-900 transition font-medium">Contact</a>
        {isAuthenticated && user?.onboardingComplete && (
          <>
            <Link to="/find-flat" className="text-gray-600 hover:text-gray-900 transition font-medium">Find Flat</Link>
            <Link to="/list-flat" className="text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1"><PlusCircle className="w-4 h-4"/> List a Flat Vacancy</Link>
          </>
        )}
      </div>

      <div className="flex items-center gap-4 relative">
        {isAuthenticated ? (
          <>
            <div className="relative cursor-pointer" onClick={() => setShowDropdown(!showDropdown)}>
              <Bell className="w-6 h-6 text-gray-600 hover:text-primary-600 transition" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {notifications}
                </span>
              )}
            </div>
            
            {showDropdown && (
              <div className="absolute top-10 right-10 w-80 bg-white border border-gray-100 shadow-xl rounded-xl p-4 flex flex-col gap-3">
                <h4 className="font-semibold text-gray-800">Incoming Requests</h4>
                {requests.length === 0 ? <p className="text-sm text-gray-500">No new requests</p> : 
                  requests.map(req => (
                    <div key={req._id} className="flex gap-3 items-center p-2 bg-gray-50 rounded-lg">
                       <img src={req.fromUser.photoUrl || 'https://via.placeholder.com/40'} className="w-10 h-10 rounded-full object-cover" />
                       <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">{req.fromUser.name}</p>
                          <p className="text-xs text-gray-500 truncate">{req.listingId.fullName}'s listing</p>
                       </div>
                       <div className="flex flex-col gap-1">
                          <button onClick={() => handleAccept(req._id)} className="bg-primary-500 hover:bg-primary-600 text-white text-xs px-2 py-1 rounded transition">Accept</button>
                          <button onClick={() => handleReject(req._id)} className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs px-2 py-1 rounded transition">Reject</button>
                       </div>
                    </div>
                  ))
                }
              </div>
            )}

            <Link to="/profile" className="flex items-center gap-2 hover:bg-gray-50 py-1 px-2 rounded-lg transition">
              {user.photoUrl ? (
                <img src={user.photoUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover shadow-sm bg-gray-100" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
              )}
              <span className="font-medium text-sm text-gray-700 hidden sm:block">{user.name}</span>
            </Link>
            <button onClick={() => { logout(); navigate('/'); }} className="p-2 text-gray-500 hover:bg-rose-50 hover:text-rose-600 rounded-full transition">
              <LogOut className="w-5 h-5" />
            </button>
          </>
        ) : (
          <>
            <button onClick={onLoginClick} className="text-gray-700 hover:text-gray-900 font-medium px-4 py-2">Login</button>
            <button onClick={onRegisterClick} className="bg-primary-500 hover:bg-primary-600 text-white px-5 py-2 rounded-full font-medium transition shadow-md shadow-primary-500/20">Sign Up</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
