import { Paper, Typography } from '@mui/material';
import React from 'react';

export default function Footer(){
    return(
        <Paper sx={{marginTop: 'calc(10% + 60px)',
            position: 'fixed',
            bottom: 0,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
            }} component="footer" square variant="outlined"><Typography>shivamhw</Typography></Paper>
    )
}
