import { Button, Stack, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import TopBar from "../components/TopBar";
import { result } from "../components/Results";
import { UserContext } from "../App";
import  { Link, useLocation } from 'react-router-dom'

export default function Checkout(){
    const ddns = React.useContext(UserContext).ddnsClient
    const { state : result } : {state: result} = useLocation()
    const [ip, setIp ] = useState<string>("192.168.53.2")
    console.log("resul sh luya", result)
    if(!result){
        return (
            <>
            <h1>Yaha direct anan mana h </h1> <br />
            <Link to="/"> Home</Link>
            </>
        )
    }
    return (
        <Stack
        alignItems="center"
        justifyContent='center'
        sx={{
          height: '100vh'
        }}
        spacing={2}>
        <TopBar></TopBar>
        <Typography variant="h4" gutterBottom>
            This is Your Domain {result.subdomain}
      </Typography>
        <TextField id="outlined-basic" defaultValue="192.168.53.2" label="IP" variant="outlined" onChange={(e) => {
            setIp(e.target.value)
        }}/>
        {/* <TextField id="outlined-basic" label="Outlined" variant="outlined" /> */}
        {result.isAvailable ? <Button sx={{ m: 1 }} variant='contained' onClick={
          async () =>{
          const r = await ddns?.createRecord(ip, result.subdomain, result.rootdomain, result.zone_id ?? "");
          console.log("this is recrod creation ", r)
        }
        }>Checkout</Button> : "" }
      </Stack>
    )
}