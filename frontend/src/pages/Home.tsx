import React from 'react'
import Stack from '@mui/material/Stack';
import CustomizedSelects from '../components/CustomizedSelect';
import { useUser } from '@clerk/clerk-react';
import ResponsiveAppBar from '../components/AppBar';
import { Typography } from '@mui/material';
import ErrorBoundary from '../components/ErrorBoundary';
function App() {
  return (
    <>
    <ResponsiveAppBar></ResponsiveAppBar>
      <Stack
        alignItems="center"
        justifyContent='center'
        sx={{
          height: '100vh',
          marginTop: '1px'
        }}
        spacing={2}>
        <Typography variant="h2" gutterBottom>
        Search for domains
      </Typography>
      <ErrorBoundary>
        <CustomizedSelects>
        </CustomizedSelects>
        </ErrorBoundary>
      </Stack>
    </>
  )
}

export default App
