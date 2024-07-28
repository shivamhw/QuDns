import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ClerkProvider } from '@clerk/clerk-react'
import CssBaseline from '@mui/material/CssBaseline';
import ErrorBoundary from './components/ErrorBoundary.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey="pk_test_aW5maW5pdGUtZ3JvdXBlci05MS5jbGVyay5hY2NvdW50cy5kZXYk">
      <CssBaseline>
        <ErrorBoundary>
    <App />
    </ErrorBoundary>
    </CssBaseline>
    </ClerkProvider>
  </React.StrictMode>,
)
