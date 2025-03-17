import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import socketService from '../services/socketService';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';
import api from '../services/api';

const ChatContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background-color: var(--background-color);
`;

const EmptyStateContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: var(--chat-bg);
  color: var(--text-secondary);
  
  h2 {
    font-size: 24px;
    margin-bottom: 16px;
    color: var(--primary-color);
  }
  
  p {
    font-size: 16px;
    max-width: 400px;
    text-align: center;
    line-height: 1.6;
  }
  
  img {
    width: 200px;
    margin-bottom: 24px;
    opacity: 0.8;
  }
`;

const Chat = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Carica le chat dell'utente
  useEffect(() => {
    const loadChats = async () => {
      try {
        const response = await api.get('/chats');
        setChats(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Errore durante il caricamento delle chat:', error);
        setLoading(false);
      }
    };
    
    if (user) {
      loadChats();
    }
  }, [user]);
  
  // Carica i messaggi quando si seleziona una chat
  useEffect(() => {
    const loadMessages = async () => {
      if (!activeChat) return;
      
      try {
        const response = await api.get(`/messages/${activeChat.id}`);
        setMessages(response.data);
        
        // Partecipa alla chat tramite socket
        socketService.joinChat(activeChat.id);
      } catch (error) {
        console.error('Errore durante il caricamento dei messaggi:', error);
      }
    };
    
    loadMessages();
    
    // Cleanup: lascia la chat precedente
    return () => {
      if (activeChat) {
        socketService.leaveChat(activeChat.id);
      }
    };
  }, [activeChat]);
  
  // Gestisci i messaggi in tempo reale
  useEffect(() => {
    const handleNewMessage = (message) => {
      if (message.chatId === activeChat?.id) {
        setMessages((prevMessages) => [...prevMessages, message]);
        
        // Aggiorna lastMessage nella lista delle chat
        setChats((prevChats) => 
          prevChats.map((chat) => 
            chat.id === message.chatId 
              ? { 
                  ...chat, 
                  lastMessage: message.content,
                  lastMessageTime: message.createdAt
                } 
              : chat
          )
        );
      }
    };
    
    // Sottoscrivi agli eventi socket
    const unsubscribe = socketService.onReceiveMessage(handleNewMessage);
    
    return () => {
      unsubscribe();
    };
  }, [activeChat]);
  
  // Seleziona una chat
  const handleSelectChat = (chat) => {
    setActiveChat(chat);
  };
  
  // Invia un messaggio
  const handleSendMessage = async (content, type = 'text') => {
    if (!activeChat || !content.trim()) return;
    
    try {
      const messageData = {
        content,
        type,
        chatId: activeChat.id,
        senderId: user.id
      };
      
      // Invia il messaggio tramite API
      const response = await api.post('/messages', messageData);
      
      // Emetti l'evento tramite socket
      socketService.sendMessage(response.data);
      
      // Aggiorna lo stato locale
      setMessages((prevMessages) => [...prevMessages, response.data]);
      
      // Aggiorna l'ultima attività della chat
      setChats((prevChats) => 
        prevChats.map((chat) => 
          chat.id === activeChat.id 
            ? { 
                ...chat, 
                lastMessage: content,
                lastMessageTime: new Date().toISOString()
              } 
            : chat
        )
      );
    } catch (error) {
      console.error('Errore durante l\'invio del messaggio:', error);
    }
  };
  
  return (
    <ChatContainer>
      <ChatSidebar 
        chats={chats}
        activeChat={activeChat}
        onSelectChat={handleSelectChat}
        loading={loading}
      />
      
      {activeChat ? (
        <ChatWindow 
          chat={activeChat}
          messages={messages}
          onSendMessage={handleSendMessage}
        />
      ) : (
        <EmptyStateContainer>
          <img src="/logo192.png" alt="WaiChat Logo" />
          <h2>Benvenuto su WaiChat</h2>
          <p>
            Seleziona una chat per iniziare a messaggiare o crea una nuova conversazione.
            Puoi anche chattare con l'AI utilizzando il nostro assistente integrato!
          </p>
        </EmptyStateContainer>
      )}
    </ChatContainer>
  );
};

export default Chat; 