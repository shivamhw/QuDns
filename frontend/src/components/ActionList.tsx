import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import { Records } from '@prisma/client';
import { useNavigate } from 'react-router-dom';


export default function ActionList({ records } : {records : Records[]}) {
  const navigate = useNavigate();
  return (
    <Box>
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
    </Box>
  );
}