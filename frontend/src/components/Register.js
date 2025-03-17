import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const RegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background-color: var(--background-color);
`;

const RegisterForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  padding: 30px;
  background-color: var(--chat-bg);
  border-radius: 12px;
  box-shadow: 0 4px 12px var(--shadow-color);

  h2 {
    margin-bottom: 24px;
    text-align: center;
    color: var(--primary-color);
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
  }

  input {
    width: 100%;
    padding: 12px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    font-size: 16px;
    transition: border-color 0.2s;

    &:focus {
      border-color: var(--primary-color);
    }
  }
`;

const RegisterButton = styled.button`
  padding: 12px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 10px;

  &:hover {
    background-color: var(--accent-color);
  }

  &:disabled {
    background-color: var(--text-secondary);
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: var(--error-color);
  margin-bottom: 20px;
  text-align: center;
`;

const LoginLink = styled.div`
  margin-top: 20px;
  text-align: center;
  font-size: 15px;

  a {
    color: var(--primary-color);
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Logo = styled.div`
  font-size: 32px;
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: 30px;
  text-align: center;
`;

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validazione form
    if (formData.password !== formData.confirmPassword) {
      setError('Le password non corrispondono');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('La password deve contenere almeno 6 caratteri');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Rimuovi confirmPassword prima di inviare i dati
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName
      };
      
      await register(userData);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Errore durante la registrazione');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <Logo>WaiChat</Logo>
      <RegisterForm onSubmit={handleSubmit}>
        <h2>Registrati</h2>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <FormGroup>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <label htmlFor="fullName">Nome Completo</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
          />
        </FormGroup>
        
        <FormGroup>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <label htmlFor="confirmPassword">Conferma Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </FormGroup>
        
        <RegisterButton type="submit" disabled={isLoading}>
          {isLoading ? 'Registrazione in corso...' : 'Registrati'}
        </RegisterButton>
        
        <LoginLink>
          Hai già un account? <Link to="/login">Accedi</Link>
        </LoginLink>
      </RegisterForm>
    </RegisterContainer>
  );
};

export default Register; 