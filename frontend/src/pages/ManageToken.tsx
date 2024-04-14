import { useUser } from "@clerk/clerk-react";
import React, { useState } from "react";
import AuthError from "./AuthError";
import { Box, Button, TextField } from "@mui/material";
import { UserContext } from "../App";
import ResponsiveAppBar from "../components/AppBar";




export default function ManageToken() {
    const { isSignedIn, isLoaded } = useUser();
    const [token, setToken] = useState<string>("Default")
    const userContext = React.useContext(UserContext);
    const ddns = userContext.ddnsClient
    if (!isLoaded) {
        return "loading"
    }
    return (
        <>
        <ResponsiveAppBar></ResponsiveAppBar>
            {isSignedIn ?
                <Box
                    margin='100px'
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column"
                    }}
                    
                >
                    <TextField
                        id="token-id"
                        label="Copy"
                        value={token}
                        sx={{
                            minWidth: '500px'
                        }}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    <br />
                    <Button variant="contained" onClick={async () => {
                        const r = await ddns?.getToken()
                        setToken(r.token)
                    }}>Get Token</Button>
                </Box>
                : <AuthError />}
        </>
    )

}