import React from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import useAuthStore from '@/store/useAuthStore';

const ChatMessage = ({ message, isBot }) => {
  const { user } = useAuthStore();
  const isOwnMessage = message.sender_id === user?.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-[70%] ${
          isOwnMessage
            ? 'bg-primary text-primary-foreground'
            : isBot
            ? 'bg-secondary'
            : 'bg-muted'
        } rounded-lg p-3`}
      >
        {!isOwnMessage && !isBot && (
          <div className="text-xs text-muted-foreground mb-1">
            {message.sender?.full_name}
          </div>
        )}
        <p className="text-sm">{message.content}</p>
        <div className="text-xs mt-1 text-right opacity-70">
          {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
