import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from '../store';
import { ThemeProvider } from '../../design-system/theme/theme';
import { setupAuthInterceptors } from '../../api/interceptors/authInterceptor';

// Initialize Axios Interceptors
setupAuthInterceptors();

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
};
