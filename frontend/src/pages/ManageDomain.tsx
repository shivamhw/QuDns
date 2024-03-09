import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import * as React from 'react';
import { useLocation } from 'react-router-dom';
import TopBar from '../components/TopBar';
import { UserContext } from '../App';
import { Records } from '@prisma/client';


export function ManageDomain(){
    const { state: record } : {state: Records} = useLocation()
    const [ip, setIp] = React.useState(record.ip)
    const dns = React.useContext(UserContext).ddnsClient

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
        <Typography variant="h4" gutterBottom>
            This is Your Domain {record.cname}
      </Typography>
        <TextField id="outlined-basic" defaultValue={record.ip} label="IP" variant="outlined" onChange={(e) => {
          setIp(e.target.value)
        }}/>
        <Box
        display={'flex'}
        gap='8px'>
        <Button variant='contained' onClick={async ()=>{
          const r = await dns?.updateRecord({
            ip: ip,
            subdomain: record.cname,
            rootdomain: record.rootDomain,
            zone_id: record.zone_id || "",
            record_id: record.id
          })
          console.log("r ", r)
        }}>Update</Button>
        <Button variant='contained' color='warning' onClick={async ()=>{
          const r = await dns?.deleteRecord({
            record_id: record.id,
            zone_id: record.zone_id || ""
          })
          console.log("r in del ", r)
        }}>Delete</Button>
        </Box>
      </Stack>
        </>
    )
}