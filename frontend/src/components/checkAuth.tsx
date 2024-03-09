import { client } from '../clients/ddns';
import React, { useState } from 'react'


export default function CheckAuth(){
  const [authData, setaData] = useState()
    return(
        <>
    <button onClick={ async () =>{
        const r = await client.testAuth();
        setaData(r)
      }}>Get auth data</button>
          {
        JSON.stringify(authData)
  
      }
      </>
    )
}