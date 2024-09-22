import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import axios from 'axios';

// Keyframe for fading in the elements
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Container for the entire app with a dark background
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #1b1b1b; /* Darker background */
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #f1f1f1; /* Light text */
`;

// Form container with delay-based transitions
const FormContainer = styled.form`
  background: #2a2a2a; /* Darker form background */
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  padding: 30px;
  width: 400px;
  text-align: center;
  animation: ${fadeIn} 0.5s ease-in-out forwards;
  animation-delay: 0.1s; /* First element appears after 100ms */
  opacity: 0;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  margin-bottom: 1rem;
  animation: ${fadeIn} 0.5s ease-in-out forwards;
  animation-delay: 0.2s; /* Appears after the form container */
  opacity: 0;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 2px solid #444;
  border-radius: 8px;
  background-color: #333;
  color: #fff;
  font-size: 1rem;
  margin-bottom: 20px;
  transition: border 0.3s ease;
  animation: ${fadeIn} 0.5s ease-in-out forwards;
  animation-delay: 0.3s; /* Appears after title */
  opacity: 0;

  &:focus {
    border-color: #4CAF50;
    outline: none;
  }
`;

const SubmitButton = styled.button`
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  animation: ${fadeIn} 0.5s ease-in-out forwards;
  animation-delay: 0.4s; /* Appears after the textarea */
  opacity: 0;

  &:hover {
    background-color: #45a049;
    box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const ErrorMessage = styled.p`
  color: #ff4d4d;
  font-size: 0.9rem;
`;

const ResponseContainer = styled.div`
  background: #333;
  margin-top: 20px;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  width: 100%;
`;

const FiltersContainer = styled.div`
  margin: 10px 0;
  display: flex;
  justify-content: center;
`;

const FilterLabel = styled.label`
  margin-right: 10px;
  font-size: 1rem;
`;

const ResponsePre = styled.pre`
  text-align: left;
  background-color: #444;
  padding: 12px;
  border-radius: 8px;
  color: #fff;
  overflow: auto;
`;

const apiUrl = 'https://<your-backend-url>.netlify.app/.netlify/functions/api/bfhl'; // Replace with your backend URL

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      document.body.style.backgroundColor = '#1b1b1b'; // Set background color after render
    }, 10);
  }, []);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const parsedJson = JSON.parse(jsonInput);
      const { data } = parsedJson;

      if (!Array.isArray(data)) throw new Error('Invalid JSON structure');

      // Make POST request to the backend
      const response = await axios.post(apiUrl, { data });
      setResponseData(response.data);
    } catch (e) {
      setError('Invalid JSON input');
    }
  };

  // Handle checkbox changes for filters
  const handleFilterChange = (event) => {
    const { value, checked } = event.target;
    setSelectedFilters((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

  // Render filtered response
  const renderFilteredResponse = () => {
    if (!responseData) return null;

    const filteredData = {};
    if (selectedFilters.includes('Numbers')) {
      filteredData.numbers = responseData.numbers;
    }
    if (selectedFilters.includes('Alphabets')) {
      filteredData.alphabets = responseData.alphabets;
    }
    if (selectedFilters.includes('Highest lowercase alphabet')) {
      filteredData.highest_lowercase_alphabet = responseData.highest_lowercase_alphabet;
    }

    return (
      <ResponseContainer>
        <h3>Filtered Response</h3>
        <ResponsePre>{JSON.stringify(filteredData, null, 2)}</ResponsePre>
      </ResponseContainer>
    );
  };

  return (
    <AppContainer>
      <FormContainer onSubmit={handleSubmit}>
        <Title>Process JSON Data</Title>
        <TextArea
          rows="5"
          placeholder="Enter valid JSON here..."
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
        />
        {error && <ErrorMessage><FaTimesCircle /> {error}</ErrorMessage>}
        <SubmitButton type="submit">Submit</SubmitButton>
      </FormContainer>

      {responseData && (
        <>
          <ResponseContainer>
            <h3>API Response</h3>
            <ResponsePre>{JSON.stringify(responseData, null, 2)}</ResponsePre>

            <FiltersContainer>
              <FilterLabel>
                <input
                  type="checkbox"
                  value="Numbers"
                  onChange={handleFilterChange}
                /> Numbers
              </FilterLabel>
              <FilterLabel>
                <input
                  type="checkbox"
                  value="Alphabets"
                  onChange={handleFilterChange}
                /> Alphabets
              </FilterLabel>
              <FilterLabel>
                <input
                  type="checkbox"
                  value="Highest lowercase alphabet"
                  onChange={handleFilterChange}
                /> Highest lowercase alphabet
              </FilterLabel>
            </FiltersContainer>
          </ResponseContainer>
          {renderFilteredResponse()}
        </>
      )}
    </AppContainer>
  );
}

export default App;
