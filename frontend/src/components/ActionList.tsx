import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import { Records } from '@prisma/client';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';


export default function ActionList({ records } : {records : Records[]}) {
  const navigate = useNavigate();
  return (
    <Box>
      { records.length > 0 ?
            <List >
                {
                    records.map((rec) => {
                        return (
                        <ListItem
                        key={rec.id}
                        secondaryAction={
                            <IconButton edge="end" aria-label="delete" onClick={() => {
                              navigate("/manage", {
                                state: rec
                              })
                            }}>
                            <SettingsIcon />
                            </IconButton>
                        }
                        >
                        <ListItemText
                            primary={rec.cname}
                        />
                        </ListItem>
                        )
                    }
                    )
}
            </List>
            :
            <Typography variant='h5'>No domains for user</Typography>
}
    </Box>
  );
}