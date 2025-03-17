import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background-color: var(--background-color);
`;

const LoginForm = styled.form`
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

const LoginButton = styled.button`
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

const RegisterLink = styled.div`
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

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { login, error } = useAuth();
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
    
    if (!formData.username || !formData.password) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await login(formData);
      if (result && result.redirectToAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Errore durante il login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      <Logo>WaiChat</Logo>
      <LoginForm onSubmit={handleSubmit}>
        <h2>Accedi</h2>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <FormGroup>
          <label htmlFor="username">Username o Email</label>
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
        
        <LoginButton type="submit" disabled={isLoading}>
          {isLoading ? 'Accesso in corso...' : 'Accedi'}
        </LoginButton>
        
        <RegisterLink>
          Non hai ancora un account? <Link to="/register">Registrati</Link>
        </RegisterLink>
      </LoginForm>
    </LoginContainer>
  );
};

export default Login; 