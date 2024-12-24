import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import useAuthStore from '../../store/useAuthStore';
import useChatStore from '../../store/useChatStore';
import ChatList from '../../components/chat/ChatList';
import ChatMessage from '../../components/chat/ChatMessage';
import ChatInput from '../../components/chat/ChatInput';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { MessageSquarePlus } from 'lucide-react';

const Chat = () => {
  const { user } = useAuthStore();
  const {
    chats,
    currentChat,
    messages,
    loading,
    fetchChats,
    setCurrentChat,
    fetchMessages,
    sendMessage,
    clearChat
  } = useChatStore();

  const messagesEndRef = useRef(null);
  const isEmployer = user?.user_metadata?.role === 'employer';

  useEffect(() => {
    if (user?.id) {
      fetchChats(user.id);
    }
    return () => clearChat();
  }, [user]);

  useEffect(() => {
    if (currentChat?.id) {
      fetchMessages(currentChat.id);
    }
  }, [currentChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (content) => {
    if (currentChat?.id && user?.id) {
      await sendMessage(currentChat.id, user.id, content);
    }
  };

  const getChatPartner = () => {
    if (!currentChat) return null;
    return isEmployer ? currentChat.jobseeker : currentChat.employer;
  };

  const getJobDetails = () => {
    if (!currentChat?.application?.job) return null;
    return currentChat.application.job;
  };

  if (loading && !chats.length) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Chat List */}
      <div className="w-80 flex-shrink-0 bg-background border-r">
        <ChatList
          chats={chats}
          currentChat={currentChat}
          onSelectChat={setCurrentChat}
        />
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-background">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold">
                    {getChatPartner()?.full_name}
                  </h2>
                  {getJobDetails() && (
                    <p className="text-sm text-gray-600">
                      {getJobDetails().title} • {getJobDetails().company}
                    </p>
                  )}
                </div>
                <Badge variant={currentChat.application?.status || 'pending'}>
                  {currentChat.application?.status || 'Pending'}
                </Badge>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isOwnMessage={message.sender_id === user.id}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-background">
              <ChatInput onSendMessage={handleSendMessage} />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquarePlus className="h-12 w-12 text-gray-400 mx-auto" />
              <h3 className="mt-2 text-lg font-medium">No chat selected</h3>
              <p className="text-sm text-gray-500">
                Select a chat from the sidebar to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
