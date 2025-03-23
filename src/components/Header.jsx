import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'agent', text: 'Здравствуйте! Чем я могу вам помочь?' }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleMessageChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    // Add user message
    setMessages([...messages, { sender: 'user', text: newMessage }]);
    setNewMessage('');

    // Simulate agent response after a short delay
    setTimeout(() => {
      setMessages(prevMessages => [
        ...prevMessages, 
        { 
          sender: 'agent', 
          text: 'Спасибо за обращение! Наш оператор скоро свяжется с вами.' 
        }
      ]);
    }, 1000);
  };

  return (
    <header className="bg-white shadow-md relative">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mr-3">
            <span className="text-white font-bold text-xl">S7</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800">Flight Search</h1>
        </Link>
        
        <nav className="hidden md:flex space-x-6">
          <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">Авиабилеты</a>
          <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">Регистрация</a>
          <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">Управление бронированием</a>
          <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">Информация</a>
        </nav>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleChat}
            className="flex items-center bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Поддержка
          </button>
          
          <a href="#" className="text-gray-600 hover:text-green-600 transition-colors hidden md:block">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </a>
          
          <button className="md:hidden focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Полоса с рейтингом Gate и индикатором - как на скриншоте */}
      <div className="bg-gradient-to-r from-green-500 to-green-400 py-1 px-4 text-white flex justify-between items-center">
        <div className="text-sm font-semibold">Gate 7</div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
          <div className="text-sm font-medium">LTE</div>
          <div className="bg-white text-green-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            20
          </div>
        </div>
      </div>

      {/* Support Chat Dialog */}
      {isChatOpen && (
        <div className="absolute right-4 top-24 w-80 bg-white rounded-lg shadow-xl z-50 overflow-hidden border border-gray-200">
          <div className="bg-green-600 text-white p-3 flex justify-between items-center">
            <div className="font-semibold">Техническая поддержка</div>
            <button onClick={toggleChat} className="text-white hover:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div className="p-3 h-60 overflow-y-auto bg-gray-50">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`mb-2 ${message.sender === 'user' ? 'text-right' : ''}`}
              >
                <div 
                  className={`inline-block p-2 rounded-lg ${
                    message.sender === 'user' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-white text-gray-800 border border-gray-300'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>
          
          <form onSubmit={handleMessageSubmit} className="border-t p-3">
            <div className="flex">
              <input
                type="text"
                value={newMessage}
                onChange={handleMessageChange}
                placeholder="Напишите сообщение..."
                className="flex-grow p-2 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-green-500"
              />
              <button 
                type="submit"
                className="bg-green-600 text-white px-3 rounded-r-md hover:bg-green-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </header>
  );
};

export default Header;