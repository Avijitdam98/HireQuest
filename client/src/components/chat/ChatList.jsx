import React from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import useAuthStore from '../../store/useAuthStore';
import { CircularProgress } from '@mui/material';
import { Badge } from '../ui/badge';

const ChatList = ({ chats = [], currentChat, onSelectChat }) => {
  const { user } = useAuthStore();
  const isEmployer = user?.user_metadata?.role === 'employer';

  const getChatName = (chat) => {
    if (isEmployer) {
      return chat.jobseeker?.full_name || 'Unknown Applicant';
    }
    return chat.employer?.full_name || 'Unknown Employer';
  };

  const getJobTitle = (chat) => {
    return chat.application?.job?.title || 'Unknown Job';
  };

  const getCompanyName = (chat) => {
    return chat.application?.job?.company || 'Unknown Company';
  };

  const getLastMessage = (chat) => {
    if (!chat.last_message?.[0]) return 'No messages yet';
    return chat.last_message[0].content;
  };

  const getApplicationStatus = (chat) => {
    return chat.application?.status || 'pending';
  };

  if (!chats) {
    return (
      <div className="border-r h-full flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="border-r h-full p-4">
        <h2 className="text-lg font-semibold mb-4">Messages</h2>
        <p className="text-gray-500 text-center">No chats yet</p>
      </div>
    );
  }

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
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {getChatName(chat).charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">
                        {getChatName(chat)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {getJobTitle(chat)} • {getCompanyName(chat)}
                      </p>
                    </div>
                    {chat.last_message?.[0] && (
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(chat.last_message[0].created_at), {
                          addSuffix: true,
                        })}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant={getApplicationStatus(chat)}>
                      {getApplicationStatus(chat)}
                    </Badge>
                    <p className="text-sm text-gray-500 truncate flex-1">
                      {getLastMessage(chat)}
                    </p>
                  </div>
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
