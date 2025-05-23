import React, { useEffect, useRef, useState } from 'react';
import { useChatStore } from '../store/useChatStore.js';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './sekelotons/MessageSkeleton.jsx';
import { useAuthStore } from '../store/useAuthStore.js';
import { ArrowDown } from 'lucide-react';

const ChatContainer = () => {
  const {
    getMessage,
    messages,
    isMessageLoading,
    selectedUser,
    SubscribeToMessage,
    unSubscribeFromMessage,
  } = useChatStore();
  const { authUser } = useAuthStore();

  const messageContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // 🧠 Subscribe to socket when component mounts
  useEffect(() => {
    SubscribeToMessage();
    return () => {
      unSubscribeFromMessage();
    };
  }, []);

  // 🧠 Load messages on user selection
  useEffect(() => {
    if (selectedUser?._id) {
      getMessage(selectedUser._id);
    }
  }, [selectedUser?._id]);

  // 📦 Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 🧠 Show/hide scroll button
  const handleScroll = () => {
    const container = messageContainerRef.current;
    if (!container) return;

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 100;

    setShowScrollButton(!isNearBottom);
  };

  // 🧠 Attach scroll listener
  useEffect(() => {
    const container = messageContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col h-full max-h-screen relative">
      {/* Header */}
      <div className="flex-none">
        <ChatHeader />
      </div>

      {/* Messages Area */}
      <div
        ref={messageContainerRef}
        className="flex-1 overflow-y-auto px-2 sm:px-4 py-2 space-y-4 scrollbar-thin 
                 scrollbar-thumb-blue-500 scrollbar-track-transparent scroll-smooth"
      >
        {isMessageLoading ? (
          <MessageSkeleton />
        ) : messages.length > 0 ? (
          <div className="flex flex-col space-y-4">
            {messages.map((msg) => {
              const isFromSelf = msg.senderId === authUser._id;
              const userAvatar = isFromSelf
                ? authUser?.profilePic || './avatar.png'
                : selectedUser?.profilePic || './avatar.png';

              return (
                <div
                  key={msg._id}
                  className={`chat ${isFromSelf ? 'chat-end' : 'chat-start'}`}
                >
                  <div className="chat-image avatar">
                    <div className="w-8 sm:w-10 rounded-full">
                      <img src={userAvatar} alt="User avatar" />
                    </div>
                  </div>
                  <div className="chat-bubble break-words max-w-[85%] sm:max-w-[70%] space-y-2 text-sm sm:text-base">
                    {Array.isArray(msg.image) &&
                      msg.image.map((imgUrl, index) => (
                        <img
                          key={index}
                          src={imgUrl}
                          alt={`Sent image ${index + 1}`}
                          className="rounded-lg w-auto h-auto max-w-[150px] sm:max-w-xs"
                        />
                      ))}
                    {msg.message && <p>{msg.message}</p>}
                  </div>
                </div>
              );
            })}
            {/* 👇 Scroll target */}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-center text-gray-500">No messages yet</p>
          </div>
        )}
      </div>

      {/* Scroll To Bottom Button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-24 right-4 z-50 p-3 rounded-full 
                   bg-blue-600 text-white shadow-lg hover:bg-blue-700 
                   transition-all duration-300 animate-bounce"
          aria-label="Scroll to latest messages"
        >
          <ArrowDown size={20} />
        </button>
      )}

      {/* Message Input */}
      <div className="flex-none border-t">
        <MessageInput />
      </div>
    </div>
  );
};

export default ChatContainer;
