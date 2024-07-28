import * as React from 'react';


export default function StatusFeedback({status_code} : {status_code :number}){
    return (
        <>
        <h1>Success {status_code}</h1>
        </>
    )
}