import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const WindowContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: var(--background-color);
  height: 100%;
  overflow: hidden;
`;

const Header = styled.div`
  padding: 16px;
  display: flex;
  align-items: center;
  background-color: var(--chat-bg);
  border-bottom: 1px solid var(--border-color);
`;

const ChatAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => props.isAI ? 'var(--accent-color)' : 'var(--primary-color)'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 16px;
`;

const ChatInfo = styled.div`
  flex: 1;
`;

const ChatName = styled.div`
  font-weight: 600;
`;

const ChatStatus = styled.div`
  font-size: 13px;
  color: var(--text-secondary);
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const MessageGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.isSent ? 'flex-end' : 'flex-start'};
  margin-bottom: 16px;
  max-width: 80%;
  align-self: ${props => props.isSent ? 'flex-end' : 'flex-start'};
`;

const Message = styled.div`
  padding: 10px 16px;
  border-radius: 16px;
  background-color: ${props => {
    if (props.isAI) return 'var(--ai-message)';
    return props.isSent ? 'var(--message-sent)' : 'var(--message-received)';
  }};
  margin-bottom: 4px;
  box-shadow: 0 1px 2px var(--shadow-color);
  position: relative;
  
  &:first-child {
    border-top-left-radius: ${props => props.isSent ? '16px' : '4px'};
    border-top-right-radius: ${props => props.isSent ? '4px' : '16px'};
  }
  
  &:last-child {
    border-bottom-left-radius: ${props => props.isSent ? '16px' : '16px'};
    border-bottom-right-radius: ${props => props.isSent ? '16px' : '16px'};
    margin-bottom: 0;
  }
`;

const MessageText = styled.div`
  word-break: break-word;
`;

const MessageTime = styled.div`
  font-size: 11px;
  color: var(--text-secondary);
  text-align: ${props => props.isSent ? 'right' : 'left'};
  margin-top: 4px;
`;

const InputContainer = styled.div`
  padding: 16px;
  background-color: var(--chat-bg);
  display: flex;
  align-items: center;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border-radius: 24px;
  border: none;
  background-color: var(--background-color);
  color: var(--text-color);
  
  &::placeholder {
    color: var(--text-secondary);
  }
  
  &:focus {
    outline: none;
  }
`;

const SendButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 12px;
  cursor: pointer;
  border: none;
  
  &:disabled {
    background-color: var(--text-secondary);
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px;
  text-align: center;
  color: var(--text-secondary);
  
  p {
    margin-top: 12px;
    font-size: 14px;
  }
`;

const ChatWindow = ({ chat, messages = [], onSendMessage }) => {
  const { user } = useAuth();
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!messageText.trim()) return;
    
    onSendMessage(messageText);
    setMessageText('');
  };
  
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };
  
  if (!chat) {
    return (
      <WindowContainer>
        <EmptyState>
          <span role="img" aria-label="Welcome" style={{ fontSize: '48px' }}>👋</span>
          <p>Seleziona una chat per iniziare a messaggiare</p>
        </EmptyState>
      </WindowContainer>
    );
  }
  
  return (
    <WindowContainer>
      <Header>
        <ChatAvatar isAI={chat.type === 'ai'}>
          {chat.type === 'ai' ? 'AI' : getInitials(chat.name || 'Chat')}
        </ChatAvatar>
        <ChatInfo>
          <ChatName>
            {chat.name || (chat.type === 'direct' ? 'Chat Diretta' : chat.type === 'ai' ? 'Assistente AI' : 'Gruppo')}
          </ChatName>
          <ChatStatus>
            {chat.type === 'ai' ? 'Assistente AI' : 'Online'}
          </ChatStatus>
        </ChatInfo>
      </Header>
      
      <MessagesContainer>
        {messages.length === 0 ? (
          <EmptyState>
            <span role="img" aria-label="Start" style={{ fontSize: '32px' }}>💬</span>
            <p>Inizia la conversazione inviando un messaggio!</p>
          </EmptyState>
        ) : (
          messages.map((message, index) => {
            const isSent = message.senderId === user?.id;
            const isAI = chat.type === 'ai' && !isSent;
            
            return (
              <MessageGroup key={message.id || index} isSent={isSent}>
                <Message isSent={isSent} isAI={isAI}>
                  <MessageText>{message.content}</MessageText>
                </Message>
                <MessageTime isSent={isSent}>
                  {formatTime(message.createdAt)}
                </MessageTime>
              </MessageGroup>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      
      <InputContainer>
        <form onSubmit={handleSendMessage} style={{ display: 'flex', width: '100%' }}>
          <MessageInput
            type="text"
            placeholder="Scrivi un messaggio..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
          />
          <SendButton type="submit" disabled={!messageText.trim()}>
            <span role="img" aria-label="Send">➤</span>
          </SendButton>
        </form>
      </InputContainer>
    </WindowContainer>
  );
};

export default ChatWindow; 