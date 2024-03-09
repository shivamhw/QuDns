import * as React from 'react';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export interface result  {
    isAvailable?: boolean
    subdomain?:      string
    rootdomain?: string
    zone_id?: string
}

export default function Resutls({result} : {result: result}) {
  const navigate = useNavigate()
  console.log("result conpomane ", result)
  return (

      <Paper 
      
      sx={{
        margin: '10px',
        minHeight: '50px',
        textAlign:'center'
      }}
      elevation={1}>
        {result.subdomain}.{result.rootdomain} is { result.isAvailable ? "Available" : "Unavailable"}
        <br/>
        {result.isAvailable ? <Button sx={{ m: 1 }} variant='contained' onClick={
          async () =>{
            navigate("/checkout", {
              state: result
            })
        //  await ddns?.createRecord("192.167.5.4", result.subdomain, result.rootdomain);
        }
        }>Checkout</Button> : "" }
      </Paper>


  );
}