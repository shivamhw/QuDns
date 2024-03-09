import React from 'react'
import Stack from '@mui/material/Stack';
import CustomizedSelects from '../components/CustomizedSelect';
import TopBar from '../components/TopBar';
import { useUser } from '@clerk/clerk-react';

function App() {
  const { isLoaded } = useUser()
  console.log("is loaded ", isLoaded)
  return (
    <>
      <Stack
        alignItems="center"
        justifyContent='center'
        sx={{
          height: '100vh'
        }}
        spacing={2}>
        <TopBar></TopBar>
        <CustomizedSelects>
        </CustomizedSelects>

      </Stack>
    </>
  )
}

export default App
