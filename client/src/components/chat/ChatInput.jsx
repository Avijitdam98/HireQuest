import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Send, Paperclip } from 'lucide-react';

const ChatInput = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t p-4 bg-background">
      <div className="flex items-center space-x-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="flex-shrink-0"
          disabled={disabled}
        >
          <Paperclip className="h-5 w-5" />
        </Button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={disabled}
        />
        <Button
          type="submit"
          variant="primary"
          size="icon"
          className="flex-shrink-0"
          disabled={disabled || !message.trim()}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
};

export default ChatInput;
