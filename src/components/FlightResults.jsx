import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';

const FlightResults = ({ searchResults }) => {
  const [activeTab, setActiveTab] = useState('withoutBaggage');

  // Format date from ISO string to Russian locale format
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('ru-RU', {
      weekday: 'short',
      day: 'numeric',
      month: 'long'
    });
  };

  // Format time from ISO string
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  // Calculate flight duration between two ISO strings
  const calculateDuration = (departureTime, arrivalTime) => {
    const departure = new Date(departureTime);
    const arrival = new Date(arrivalTime);
    const durationMs = arrival - departure;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}ч ${minutes}м`;
  };

  // Check if we have search results (from the JSON data)
  if (!searchResults || !searchResults.results || searchResults.results.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Header />
        <div className="bg-white p-8 rounded-lg shadow-md mt-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mt-4">Рейсы не найдены</h2>
          <p className="text-gray-600 mt-2">Попробуйте изменить параметры поиска</p>
          <Link to="/" className="btn-primary mt-6 inline-block">Вернуться к поиску</Link>
        </div>
      </div>
    );
  }

  // Get flights data from results
  const flights = searchResults.results;
  
  // Get first flight for reference data
  const firstFlight = flights[0];
  
  // Generate date options from the flights data
  const generateDateOptions = () => {
    // Get unique dates from flights
    const uniqueDates = [...new Set(flights.map(flight => {
      const date = new Date(flight.departure_time);
      return date.toISOString().split('T')[0]; // Get YYYY-MM-DD format
    }))].sort();
    
    // Take at most 3 unique dates
    return uniqueDates.slice(0, 3).map(dateStr => {
      const date = new Date(dateStr);
      const day = date.toLocaleDateString('ru-RU', { weekday: 'short' }).replace('.', '');
      const dateFormatted = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
      
      // Find the cheapest flight on this date
      const flightsOnThisDate = flights.filter(flight => 
        new Date(flight.departure_time).toISOString().split('T')[0] === dateStr
      );
      
      const cheapestPrice = flightsOnThisDate.length > 0 
        ? Math.min(...flightsOnThisDate.map(flight => flight.economy_basic_price))
        : null;
      
      return {
        day,
        date: dateFormatted,
        price: cheapestPrice,
        perPassenger: true
      };
    });
  };
  
  const dateOptions = generateDateOptions();

  // Extract departure and arrival cities from the first flight
  const departureCity = firstFlight.departure_city;
  const arrivalCity = firstFlight.arrival_city;
  
  // Extract departure date for the header
  const departureDateFormatted = formatDate(firstFlight.departure_time);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        {/* Верхняя навигация */}
        <div className="flex items-center mb-4">
          <Link to="/" className="text-gray-600 hover:text-green-600 mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7m0 0l-7 7 7 7" />
            </svg>
          </Link>
          <div className="bg-white rounded-lg p-3 flex items-center flex-grow">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-gray-700 font-medium">
              {`${departureCity}-${arrivalCity}`}
            </span>
            <div className="ml-auto flex items-center space-x-2">
              <button className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Выбор с багажом/без багажа */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          <button 
            className={`py-3 px-4 rounded-lg text-center ${activeTab === 'withoutBaggage' ? 'bg-white font-semibold shadow-md' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveTab('withoutBaggage')}
          >
            Без багажа
          </button>
          <button 
            className={`py-3 px-4 rounded-lg text-center ${activeTab === 'withBaggage' ? 'bg-white font-semibold shadow-md' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveTab('withBaggage')}
          >
            С багажом
          </button>
        </div>
        
        {/* Информация о направлении */}
        <div className="mb-6">
          <div className="flex items-center text-gray-600 mb-1">
            <svg className="h-6 w-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span>Туда · {departureDateFormatted}</span>
          </div>
          <div className="flex items-center mb-2">
            <h2 className="text-xl font-bold">{departureCity}</h2>
            <span className="mx-2 text-gray-500">OVB</span>
            <svg className="h-5 w-5 text-gray-400 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            <h2 className="text-xl font-bold ml-1">{arrivalCity}</h2>
            <span className="ml-2 text-gray-500">MOW</span>
          </div>
        </div>
        
        {/* Список вариантов дат */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {dateOptions.map((date, idx) => (
            <div key={idx} className="bg-white rounded-lg p-3 text-center">
              <div className="text-gray-800">{date.day}, {date.date}</div>
              {date.price && (
                <>
                  <div className="mt-2 font-bold text-lg">от {date.price} ₽</div>
                  <div className="text-sm text-gray-500">за 1 пассажира</div>
                </>
              )}
            </div>
          ))}
        </div>
        
        {/* Результаты поиска - список рейсов */}
        {flights.map((flight) => (
          <div key={flight.id} className="bg-white rounded-lg shadow-md mb-6 animate-fade-in flight-card overflow-hidden">
            {/* Верхний блок с информацией о рейсе */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-gray-700 mr-2">Прямой</span>
                  <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                {flight.baggage_price > 0 && (
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center mt-3">
                <div className="flex items-center">
                  <div className="text-2xl font-bold">{formatTime(flight.departure_time)}</div>
                  <div className="text-sm text-gray-500 ml-2">OVB</div>
                </div>
                
                <div className="text-gray-500 text-sm text-center mx-2">
                  {calculateDuration(flight.departure_time, flight.arrival_time)}
                </div>
                
                <div className="flex items-center">
                  <div className="text-2xl font-bold">{formatTime(flight.arrival_time)}</div>
                  <div className="text-sm text-gray-500 ml-2">MOW</div>
                </div>
              </div>
              
              <div className="flex items-center mt-2">
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mr-2">
                    <span className="text-white font-bold text-xs">S7</span>
                  </div>
                  {flight.airline}
                </div>
              </div>
            </div>
            
            {/* Нижний блок с ценой */}
            <div className="p-4 bg-gray-50 flex justify-end items-center">
              <div className="text-right">
                {activeTab === 'withBaggage' && flight.baggage_price > 0 && (
                  <div className="text-sm text-gray-500">
                    + багаж {flight.baggage_price} ₽
                  </div>
                )}
                <div className="text-2xl font-bold text-gray-900">
                  {activeTab === 'withBaggage' && flight.baggage_price > 0 
                    ? (flight.economy_basic_price + flight.baggage_price) 
                    : flight.economy_basic_price} ₽
                </div>
                <div className="text-xs text-gray-500">
                  {flight.meal_type && <span>Питание: {flight.meal_type}</span>}
                  {flight.pet_transport && <span> • Перевозка животных</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Блок для пенсионеров и молодежи */}
        <div className="bg-white rounded-lg shadow-md mb-6 p-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="font-medium">Специальные тарифы</div>
              <div className="text-sm text-gray-600">Для пенсионеров и молодежи до 23 лет</div>
            </div>
          </div>
          <button className="px-4 py-2 border border-green-600 text-green-600 rounded-lg font-medium hover:bg-green-50">
            Подробнее
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlightResults;