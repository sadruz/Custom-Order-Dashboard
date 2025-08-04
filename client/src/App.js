import React, { useState, useEffect } from 'react';
import { fetchCustomers, searchCustomers } from './services/api';
import CustomerCard from './components/CustomerCard';
import SearchBar from './components/SearchBar';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

function App() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchMode, setSearchMode] = useState(false);

  useEffect(() => {
  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await fetchCustomers(1, 1000); // Request first 1000 customers
      setCustomers(data);
    } catch (err) {
      setError('Failed to load customers. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  loadCustomers();
}, []);

  const loadCustomers = async () => {
    setLoading(true);
    setSearchMode(false);
    try {
      const data = await fetchCustomers();
      setCustomers(data);
    } catch (err) {
      setError('Failed to load customers. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      loadCustomers();
      return;
    }

    setLoading(true);
    setSearchMode(true);
    try {
      const results = await searchCustomers(query);
      setCustomers(results);
    } catch (err) {
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>Customer Dashboard</h1>
      <SearchBar onSearch={handleSearch} />
      
      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="customer-grid">
          {customers.length > 0 ? (
            customers.map(customer => (
              <CustomerCard key={customer.id} customer={customer} />
            ))
          ) : (
            <p>{searchMode ? 'No matching customers found' : 'No customers available'}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;