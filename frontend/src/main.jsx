import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';
import store from './redux/store';
import { ThemeProvider } from './context/ThemeContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <App />
          <Toaster position="top-right" toastOptions={{ style: { background: '#0f172a', color: '#fff' } }} />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);