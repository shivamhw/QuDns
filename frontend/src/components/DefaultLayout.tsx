import React from 'react'
import Stack from '@mui/material/Stack';

function DefaultLayout() {
  return (
    <>
      <Stack
        alignItems="center"
        justifyContent='center'
        sx={{
          height: '100vh'
        }}
        spacing={2}>
      </Stack>
    </>
  )
}

export default DefaultLayout
