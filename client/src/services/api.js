import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const fetchCustomers = async (page = 1, limit = 1000) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/customers?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

export const searchCustomers = async (query) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/customers`);
    return response.data.filter(customer => 
      customer.first_name.toLowerCase().includes(query.toLowerCase()) ||
      customer.last_name.toLowerCase().includes(query.toLowerCase()) ||
      customer.email.toLowerCase().includes(query.toLowerCase())
    );
  } catch (error) {
    console.error('Error searching customers:', error);
    throw error;
  }
};