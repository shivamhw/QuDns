import React from "react";
import { Link } from "react-router-dom";

export default function AuthError(){
    return (
        <>
        <h1>
            You are not allowed herer go to <Link to="/">Home</Link>
        </h1>
        </>
    )
}