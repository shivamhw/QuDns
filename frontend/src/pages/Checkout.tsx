import { Button, Stack, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { result } from "../components/Results";
import { UserContext } from "../App";
import  { Link, useLocation } from 'react-router-dom'
import ResponsiveAppBar from "../components/AppBar";
import DescriptionAlerts, { alertProp } from "../components/Alert";

export default function Checkout(){
    const ddns = React.useContext(UserContext).ddnsClient
    const { state : result } : {state: result} = useLocation()
    const [ip, setIp ] = useState<string>("192.168.53.2")
    const [alert, setAlert] = useState<alertProp>()
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
      <>
              <ResponsiveAppBar></ResponsiveAppBar>
        <Stack
        alignItems="center"
        justifyContent='center'
        sx={{
          height: '100vh'
        }}
        spacing={2}>
        <Typography variant="h4" gutterBottom>
           Checkout Your Domain {result.subdomain + "." + result.rootdomain}
      </Typography>
        <TextField id="outlined-basic" defaultValue="192.168.53.2" label="IP" variant="outlined" onChange={(e) => {
            setIp(e.target.value)
        }}/>
        {result.isAvailable ? <Button sx={{ m: 1 }} variant='contained' onClick={
          async () =>{
          const r = await ddns?.createRecord(ip, result.subdomain, result.rootdomain, result.zone_id ?? "");
          console.log("this is recrod creation ", r)
          if(r?.status != 200){
            setAlert({
              severity: "error",
              msg: r?.data['msg'],
              title: "failed"
            })
          }else{
            console.log("seeting alert for success")
            setAlert({
              severity: "success",
              msg: "Suucess",
              title: "success"
            })
          }
        }
        }>Checkout</Button> : "" }
        {alert && <DescriptionAlerts alert={alert}/>}
      </Stack>
      </>
    )
}