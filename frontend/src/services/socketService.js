import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.callbacks = {
      receiveMessage: [],
      userTyping: [],
      userOnline: [],
      userOffline: []
    };
  }

  connect(token) {
    const serverUrl = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';
    
    this.socket = io(serverUrl, {
      auth: {
        token
      },
      transports: ['websocket'],
      withCredentials: true
    });
    
    this.setupListeners();
    
    return this.socket;
  }
  
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
  
  setupListeners() {
    if (!this.socket) return;
    
    this.socket.on('receive_message', (data) => {
      this.callbacks.receiveMessage.forEach(callback => callback(data));
    });
    
    this.socket.on('user_typing', (data) => {
      this.callbacks.userTyping.forEach(callback => callback(data));
    });
    
    this.socket.on('user_online', (data) => {
      this.callbacks.userOnline.forEach(callback => callback(data));
    });
    
    this.socket.on('user_offline', (data) => {
      this.callbacks.userOffline.forEach(callback => callback(data));
    });
  }
  
  joinChat(chatId) {
    if (this.socket) {
      this.socket.emit('join_chat', chatId);
    }
  }
  
  leaveChat(chatId) {
    if (this.socket) {
      this.socket.emit('leave_chat', chatId);
    }
  }
  
  sendMessage(messageData) {
    if (this.socket) {
      this.socket.emit('send_message', messageData);
    }
  }
  
  typing(data) {
    if (this.socket) {
      this.socket.emit('typing', data);
    }
  }
  
  onReceiveMessage(callback) {
    this.callbacks.receiveMessage.push(callback);
    return () => {
      this.callbacks.receiveMessage = this.callbacks.receiveMessage.filter(cb => cb !== callback);
    };
  }
  
  onUserTyping(callback) {
    this.callbacks.userTyping.push(callback);
    return () => {
      this.callbacks.userTyping = this.callbacks.userTyping.filter(cb => cb !== callback);
    };
  }
  
  onUserOnline(callback) {
    this.callbacks.userOnline.push(callback);
    return () => {
      this.callbacks.userOnline = this.callbacks.userOnline.filter(cb => cb !== callback);
    };
  }
  
  onUserOffline(callback) {
    this.callbacks.userOffline.push(callback);
    return () => {
      this.callbacks.userOffline = this.callbacks.userOffline.filter(cb => cb !== callback);
    };
  }
}

export default new SocketService();