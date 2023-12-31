import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import App from './App';
import {AuthContestProvider} from './store/auth_context';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthContestProvider>
    <App />
  </AuthContestProvider>
);
