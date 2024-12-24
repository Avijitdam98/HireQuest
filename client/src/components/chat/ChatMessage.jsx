import React from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '../../lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';

const ChatMessage = ({ message, isOwnMessage }) => {
  const { content, created_at, sender } = message;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex gap-3 max-w-[80%]',
        isOwnMessage ? 'ml-auto flex-row-reverse' : ''
      )}
    >
      <Avatar className="h-8 w-8 flex-shrink-0">
        {sender?.avatar_url ? (
          <AvatarImage src={sender.avatar_url} alt={sender.full_name} />
        ) : (
          <AvatarFallback>
            {sender?.full_name?.charAt(0) || '?'}
          </AvatarFallback>
        )}
      </Avatar>

      <div
        className={cn(
          'flex flex-col gap-1',
          isOwnMessage ? 'items-end' : 'items-start'
        )}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {sender?.full_name || 'Unknown User'}
          </span>
          <span className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(created_at), { addSuffix: true })}
          </span>
        </div>

        <div
          className={cn(
            'rounded-lg px-4 py-2',
            isOwnMessage
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary'
          )}
        >
          <p className="text-sm whitespace-pre-wrap break-words">{content}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
