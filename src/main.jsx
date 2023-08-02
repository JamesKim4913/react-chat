// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import { AuthProvider } from './contexts/authContext'; // Import the AuthProvider


ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <BrowserRouter>    

    <AuthProvider>

    <Layout>    
    <App /> 
    </Layout>    

    </AuthProvider>   
         
    </BrowserRouter>
  // </React.StrictMode>
)