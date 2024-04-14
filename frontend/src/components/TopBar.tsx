import { SignedIn, SignedOut, SignInButton, useClerk } from "@clerk/clerk-react";
import { Box, Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";


export default function TopBar() {
    const navigate = useNavigate();
    const { signOut } = useClerk();
    return (
        <Box
            display="flex"
            gap="2em"
        >
            <Button variant="contained" onClick={() => {
                navigate("/")
            }}>
                Home
            </Button>
        <SignedIn>
            <Button variant="contained" onClick={() => {
                navigate("/mydomains")
            }}>
                My Domains
            </Button>
            <Button variant="contained" onClick={() => {
                navigate("/token")
            }}>
                manage tokens
            </Button>
            <Button variant="contained" onClick={() => {
                signOut()
            }}>
                SignOut
            </Button>
        </SignedIn>
        <SignedOut>
            <SignInButton>
                <Button variant="contained" >
                    SignIn
                </Button>
            </SignInButton>
        </SignedOut>
        </Box>)
}