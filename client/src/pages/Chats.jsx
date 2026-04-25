import { useEffect, useState } from 'react';
import api from '../utils/axiosInstance';
import { useAuth } from '../context/AuthContext';

const Chats = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const { data } = await api.get('/requests/accepted');
        setChats(data);
      } catch (error) {
        console.error('Failed to load chats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, []);

  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Your Chats</h1>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : chats.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="text-5xl mb-4">💬</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">no chats right now</h3>
          <p className="text-gray-500 mb-6">Connect with flatmates to start chatting!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {chats.map((chat) => {
            const otherUser = chat.fromUser._id === user._id ? chat.toUser : chat.fromUser;
            return (
              <div key={chat._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
                <img src={otherUser.photoUrl || 'https://via.placeholder.com/60'} alt="avatar" className="w-14 h-14 rounded-full object-cover bg-gray-100" />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg">{otherUser.name}</h3>
                  <p className="text-sm text-gray-500">Regarding: {chat.listingId.fullName}'s listing</p>
                </div>
                <button className="bg-primary-50 text-primary-700 px-4 py-2 rounded-lg font-semibold hover:bg-primary-100 transition-colors">
                  Message
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Chats;
