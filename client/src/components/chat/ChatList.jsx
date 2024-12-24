import React from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import useAuthStore from '@/store/useAuthStore';

const ChatList = ({ chats, currentChat, onSelectChat }) => {
  const { user } = useAuthStore();

  const getChatName = (chat) => {
    if (chat.type === 'direct') {
      const otherParticipant = chat.participants.find(p => p.id !== user?.id);
      return otherParticipant?.full_name || 'Unknown User';
    }
    return chat.name;
  };

  const getLastMessage = (chat) => {
    if (!chat.last_message?.[0]) return 'No messages yet';
    return chat.last_message[0].content;
  };

  return (
    <div className="border-r h-full overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Messages</h2>
        <div className="space-y-2">
          {chats.map((chat) => (
            <motion.div
              key={chat.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => onSelectChat(chat)}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                currentChat?.id === chat.id
                  ? 'bg-primary/10'
                  : 'hover:bg-secondary'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {getChatName(chat).charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-medium truncate">
                      {getChatName(chat)}
                    </h3>
                    {chat.last_message?.[0] && (
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(
                          new Date(chat.last_message[0].created_at),
                          { addSuffix: true }
                        )}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {getLastMessage(chat)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatList;
