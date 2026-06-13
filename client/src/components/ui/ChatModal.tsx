import { useState, useEffect, useRef } from 'react';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { Modal } from './modal';
import { useAuth } from '../../context/AuthContext';

interface ChatMessage {
  id: number;
  userEmail: string;
  name: string;
  text: string;
  sentAtUtc: string;
  rentalId: number;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  rentalId: number;
  rentalTitle: string;
}

export default function ChatModal({ isOpen, onClose, rentalId, rentalTitle }: ChatModalProps) {
  const { email } = useAuth();
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && rentalId) {
      const newConnection = new HubConnectionBuilder()
        .withUrl('https://localhost:7250/chatHub')
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();

      setConnection(newConnection);
    }

    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, [isOpen, rentalId]);

  useEffect(() => {
    if (connection) {
      connection.start()
        .then(() => {
          console.log('Connected to SignalR Hub');
          connection.invoke('JoinRentalGroup', rentalId);

          connection.on('ReceiveMessage', (message: ChatMessage) => {
            setMessages(prev => [...prev, message]);
          });

          connection.on('LoadMessages', (loadedMessages: ChatMessage[]) => {
            setMessages(loadedMessages);
          });
        })
        .catch(err => console.error('Connection failed: ', err));
    }
  }, [connection, rentalId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !connection) return;

    try {
      await connection.invoke('SendMessage', rentalId, newMessage);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message: ', err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 h-[600px] flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Chat - {rentalTitle}
        </h3>
        
        <div className="flex-1 overflow-y-auto mb-4 bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-4">
          {messages.map((msg, index) => {
            const isMe = msg.userEmail === email;
            return (
              <div key={index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-3 ${
                  isMe 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                }`}>
                  <div className="text-xs opacity-75 mb-1">{msg.name}</div>
                  <div>{msg.text}</div>
                  <div className="text-xs opacity-75 mt-1 text-right">
                    {new Date(msg.sentAtUtc).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
          <button
            type="submit"
            disabled={!connection || !newMessage.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
        <div className="mt-2 text-xs text-gray-500 text-center">
          Messages disappear after 60 seconds
        </div>
      </div>
    </Modal>
  );
}