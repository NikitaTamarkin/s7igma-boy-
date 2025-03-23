import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SearchForm from './components/SearchForm';
import FlightResults from './components/FlightResults';
import Header from './components/Header';
import './index.css';

function App() {
  const [searchResults, setSearchResults] = useState(null);
  
  return (
    <Router>
      <div className="app min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={
            <div className="container mx-auto px-4 py-8">
              <Header />
              <div className="mt-6">
                <SearchForm setSearchResults={setSearchResults} />
              </div>
            </div>
          } />
          
          <Route path="/results" element={
            <FlightResults searchResults={searchResults} />
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;