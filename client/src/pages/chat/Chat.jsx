import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import useAuthStore from '../../store/useAuthStore';
import useChatStore from '../../store/useChatStore';
import ChatList from '../../components/chat/ChatList';
import ChatMessage from '../../components/chat/ChatMessage';
import ChatInput from '../../components/chat/ChatInput';
import { Button } from '../../components/ui/button';
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
  } = useChatStore();

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user?.id) {
      fetchChats(user.id);
    }
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

  const handleNewChat = () => {
    // TODO: Implement new chat creation
    console.log('Create new chat');
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Chat List */}
      <div className="w-80 flex-shrink-0">
        <div className="h-full flex flex-col">
          <div className="p-4 border-b">
            <Button
              onClick={handleNewChat}
              className="w-full"
              variant="outline"
            >
              <MessageSquarePlus className="mr-2 h-4 w-4" />
              New Chat
            </Button>
          </div>
          <ChatList
            chats={chats}
            currentChat={currentChat}
            onSelectChat={setCurrentChat}
          />
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">
                {currentChat.type === 'direct'
                  ? currentChat.participants.find(p => p.id !== user?.id)?.full_name
                  : currentChat.name}
              </h2>
            </div>

            {/* Messages */}
            <motion.div
              className="flex-1 overflow-y-auto p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isBot={false}
                />
              ))}
              <div ref={messagesEndRef} />
            </motion.div>

            {/* Chat Input */}
            <ChatInput
              onSendMessage={handleSendMessage}
              disabled={loading}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a chat or start a new conversation
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
