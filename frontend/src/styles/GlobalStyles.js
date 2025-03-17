import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    --primary-color: #128C7E;
    --secondary-color: #25D366;
    --accent-color: #075E54;
    --background-color: #ECE5DD;
    --chat-bg: #FFFFFF;
    --message-sent: #DCF8C6;
    --message-received: #FFFFFF;
    --text-color: #333333;
    --text-secondary: #6B7C85;
    --border-color: #E1E1E1;
    --shadow-color: rgba(0, 0, 0, 0.08);
    --error-color: #FF3B30;
    --success-color: #34C759;
    --ai-message: #F0F0F0;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: var(--background-color);
    color: var(--text-color);
    font-size: 16px;
    line-height: 1.5;
  }

  a {
    color: var(--primary-color);
    text-decoration: none;
    transition: color 0.2s ease;
    
    &:hover {
      color: var(--accent-color);
    }
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
    background: none;
    font-family: inherit;
  }

  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    outline: none;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    padding: 10px;
  }

  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --primary-color: #00A884;
      --secondary-color: #25D366;
      --accent-color: #02735E;
      --background-color: #121B22;
      --chat-bg: #1F2C34;
      --message-sent: #005C4B;
      --message-received: #1F2C34;
      --text-color: #E9EDEF;
      --text-secondary: #8696A0;
      --border-color: #374248;
      --shadow-color: rgba(0, 0, 0, 0.3);
      --error-color: #FF453A;
      --success-color: #30D158;
      --ai-message: #323739;
    }
  }
`; 