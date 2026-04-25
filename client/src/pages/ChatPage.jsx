import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axiosInstance';
import ChatWindow from '../components/Chat/ChatWindow';
import ChatInput from '../components/Chat/ChatInput';
import { ArrowLeft } from 'lucide-react';

const getRoomId = (id1, id2) => [id1, id2].sort().join('_');

const ChatPage = () => {
  const { receiverId } = useParams();
  const { user } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();

  const [messages, setMessages]                 = useState([]);
  const [receiver, setReceiver]                 = useState(null);
  const [loading, setLoading]                   = useState(true);
  const [isReceiverOnline, setIsReceiverOnline] = useState(false);
  const bottomRef = useRef(null);
  const roomId = user ? getRoomId(user._id, receiverId) : null;

  useEffect(() => {
    if (!socket || !user || !roomId) return;

    // ✅ Attach online_users_list BEFORE emitting join_room
    // So when server sends the list after join, we are already listening
    const handleOnlineList = (onlineList) => {
      const isOnline = onlineList.some(
        id => id.toString() === receiverId.toString()
      );
      setIsReceiverOnline(isOnline);
      console.log('📋 Online list:', onlineList, '| Receiver online:', isOnline);
    };

    const handleUserOnline = (onlineUserId) => {
      if (onlineUserId.toString() === receiverId.toString()) {
        setIsReceiverOnline(true);
        console.log('🟢 Receiver came online');
      }
    };

    const handleUserOffline = (offlineUserId) => {
      if (offlineUserId.toString() === receiverId.toString()) {
        setIsReceiverOnline(false);
        console.log('⚫ Receiver went offline');
      }
    };

    const handleMessage = (newMsg) => {
      setMessages(prev => {
        const exists = prev.find(m => m._id === newMsg._id);
        if (exists) return prev;
        return [...prev, newMsg];
      });
      socket.emit('mark_seen', { roomId, readerId: user._id });
    };

    const handleSeen = ({ readerId }) => {
      if (readerId === user._id?.toString()) return;
      setMessages(prev =>
        prev.map(msg => {
          const msgSenderId = msg.senderId?._id?.toString() ?? msg.senderId?.toString();
          return msgSenderId === user._id?.toString()
            ? { ...msg, seen: true }
            : msg;
        })
      );
    };

    const handleDeleted = ({ messageId }) => {
      setMessages(prev => prev.filter(m => m._id !== messageId));
    };

    // ✅ Attach ALL listeners FIRST before emitting anything
    socket.on('online_users_list', handleOnlineList);
    socket.on('user_online',       handleUserOnline);
    socket.on('user_offline',      handleUserOffline);
    socket.on('receive_message',   handleMessage);
    socket.on('messages_seen',     handleSeen);
    socket.on('message_deleted',   handleDeleted);

    // ✅ NOW emit join_room — server will send online_users_list to room
    // and we are already listening so we catch it immediately
    socket.emit('join_room', roomId);
    socket.emit('mark_seen', { roomId, readerId: user._id });

    // Fetch chat history
    api.get(`/messages/${roomId}`)
      .then(res => setMessages(res.data))
      .catch(err => console.error('Messages fetch failed:', err))
      .finally(() => setLoading(false));

    // Fetch receiver profile
    api.get(`/users/${receiverId}`)
      .then(res => setReceiver(res.data))
      .catch(err => console.error('Receiver fetch failed:', err));

    return () => {
      socket.off('online_users_list', handleOnlineList);
      socket.off('user_online',       handleUserOnline);
      socket.off('user_offline',      handleUserOffline);
      socket.off('receive_message',   handleMessage);
      socket.off('messages_seen',     handleSeen);
      socket.off('message_deleted',   handleDeleted);
    };
  }, [socket, user, roomId, receiverId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (text) => {
    if (!text.trim() || !socket || !user) return;
    socket.emit('send_message', {
      roomId,
      senderId:   user._id,
      receiverId,
      text:       text.trim(),
    });
  };

  const deleteMessage = (messageId) => {
    socket.emit('delete_message', { roomId, messageId });
    setMessages(prev => prev.filter(m => m._id !== messageId));
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950">
        <p className="text-gray-500 animate-pulse">Loading...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Connecting to chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-950">

      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-900 border-b border-gray-800 shadow-md">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-800 transition text-gray-400 hover:text-white"
        >
          <ArrowLeft size={18} />
        </button>

        {receiver?.photoUrl ? (
          <img src={receiver.photoUrl} alt={receiver.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500/30" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-emerald-900 flex items-center justify-center text-emerald-300 font-bold text-sm">
            {receiver?.name?.[0]?.toUpperCase() || '?'}
          </div>
        )}

        <div>
          <p className="text-white font-semibold text-sm">
            {receiver?.name || 'Loading...'}
          </p>
          <p className={`text-xs ${isReceiverOnline ? 'text-emerald-400' : 'text-gray-500'}`}>
            {isReceiverOnline ? '🟢 Online' : '⚫ Offline'}
          </p>
        </div>
      </div>

      <ChatWindow
        messages={messages}
        currentUserId={user._id}
        onDelete={deleteMessage}
      />
      <div ref={bottomRef} />
      <ChatInput onSend={sendMessage} />
    </div>
  );
};

export default ChatPage;