import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const SidebarContainer = styled.div`
  width: 350px;
  height: 100%;
  background-color: var(--chat-bg);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 768px) {
    width: 100%;
    display: ${props => (props.isMobileVisible ? 'flex' : 'none')};
  }
`;

const Header = styled.div`
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--chat-bg);
  border-bottom: 1px solid var(--border-color);
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 12px;
`;

const UserName = styled.div`
  font-weight: 600;
`;

const Actions = styled.div`
  display: flex;
  gap: 16px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 20px;
  cursor: pointer;
  
  &:hover {
    color: var(--primary-color);
  }
`;

const SearchBar = styled.div`
  padding: 12px 16px;
  background-color: var(--chat-bg);
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 16px;
  border-radius: 20px;
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

const ChatList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
`;

const ChatItem = styled.div`
  padding: 12px 16px;
  display: flex;
  align-items: center;
  cursor: pointer;
  background-color: ${props => props.isActive ? 'rgba(0, 0, 0, 0.05)' : 'transparent'};
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const ChatAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: ${props => props.isAI ? 'var(--accent-color)' : 'var(--primary-color)'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 16px;
  flex-shrink: 0;
`;

const ChatInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ChatName = styled.div`
  font-weight: 600;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LastMessage = styled.div`
  font-size: 14px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ChatTime = styled.div`
  font-size: 12px;
  color: var(--text-secondary);
  margin-left: 8px;
  white-space: nowrap;
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

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: var(--text-secondary);
`;

const ChatSidebar = ({ chats = [], activeChat, onSelectChat, loading }) => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredChats = chats.filter(chat => {
    const chatName = chat.name || (chat.type === 'direct' ? 'Chat Diretta' : 'Gruppo');
    return chatName.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };
  
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    return date.toLocaleDateString();
  };
  
  return (
    <SidebarContainer>
      <Header>
        <UserInfo>
          <Avatar>{user ? getInitials(user.fullName || user.username) : '?'}</Avatar>
          <UserName>{user ? (user.fullName || user.username) : 'Utente'}</UserName>
        </UserInfo>
        <Actions>
          <ActionButton onClick={logout}>
            <span role="img" aria-label="Logout">🚪</span>
          </ActionButton>
        </Actions>
      </Header>
      
      <SearchBar>
        <SearchInput 
          type="text" 
          placeholder="Cerca chat..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </SearchBar>
      
      <ChatList>
        {loading ? (
          <LoadingState>Caricamento chat...</LoadingState>
        ) : filteredChats.length > 0 ? (
          filteredChats.map(chat => (
            <ChatItem 
              key={chat.id} 
              isActive={activeChat && activeChat.id === chat.id}
              onClick={() => onSelectChat(chat)}
            >
              <ChatAvatar isAI={chat.type === 'ai'}>
                {chat.type === 'ai' ? 'AI' : getInitials(chat.name || 'Chat')}
              </ChatAvatar>
              <ChatInfo>
                <ChatName>{chat.name || (chat.type === 'direct' ? 'Chat Diretta' : chat.type === 'ai' ? 'Assistente AI' : 'Gruppo')}</ChatName>
                <LastMessage>{chat.lastMessage || 'Nessun messaggio'}</LastMessage>
              </ChatInfo>
              {chat.lastMessageTime && (
                <ChatTime>{formatTime(chat.lastMessageTime)}</ChatTime>
              )}
            </ChatItem>
          ))
        ) : (
          <EmptyState>
            <span role="img" aria-label="Empty" style={{ fontSize: '32px' }}>💬</span>
            <p>Nessuna chat disponibile. Inizia una nuova conversazione!</p>
          </EmptyState>
        )}
      </ChatList>
    </SidebarContainer>
  );
};

export default ChatSidebar; 