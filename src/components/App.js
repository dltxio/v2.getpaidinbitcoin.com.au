import React from 'react';
import Router from './Router';
import { AuthProvider } from './Auth';
import './App.scss';

const App = () => (
  <AuthProvider>
    <Router />
  </AuthProvider>
);

export default App;
