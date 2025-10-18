import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api.ts';

const TestConnection = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const testApiConnection = async () => {
      try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, {
          username: 'admin',
          password: 'admin',
        });
        setMessage('Connection successful: ' + response.data.token);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError('Connection failed: ' + error.message);
        } else {
          setError('An unexpected error occurred.');
        }
      }
    };

    testApiConnection();
  }, []);

  return (
    <div>
      <h2>Test Connection</h2>
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default TestConnection;