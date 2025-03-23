import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from './ErrorMessage';

const SearchForm = ({ setSearchResults }) => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Умный поиск - запрос пользователя
  const [userQuery, setUserQuery] = useState('');
  const [userAge, setUserAge] = useState('');
  const [userLocation, setUserLocation] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userQuery.trim()) {
      setError('Пожалуйста, введите текст запроса');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Вызов API умного поиска
      const response = await fetch('http://localhost:8001/process_query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_query: userQuery,
          user_age: userAge || '30',
          user_location: userLocation || 'Москва'
        }),
      });
      
      if (!response.ok) {
        throw new Error('Ошибка в запросе');
      }
      
      const data = await response.json();
      
      // Сохраняем результаты в состоянии и перенаправляем на страницу результатов
      setSearchResults(data);
      navigate('/results');
    } catch (err) {
      console.error('Ошибка:', err);
      setError('Произошла ошибка при обработке запроса. Пожалуйста, попробуйте еще раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
      <h2 className="text-2xl font-bold text-green-600 mb-6">Умный поиск авиабилетов</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 mb-2">Ваш запрос</label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            rows="3"
            placeholder="Например: Хочу полететь из Новосибирска в Санкт-Петербург в апреле на неделю с ребенком"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">Ваш возраст (необязательно)</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Например: 30"
              value={userAge}
              onChange={(e) => setUserAge(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Ваше местоположение (необязательно)</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Например: Москва"
              value={userLocation}
              onChange={(e) => setUserLocation(e.target.value)}
            />
          </div>
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md font-medium transition-colors"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Обработка запроса...
              </div>
            ) : (
              'Найти рейсы'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;