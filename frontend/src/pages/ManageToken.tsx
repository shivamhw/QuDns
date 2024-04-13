import { useUser } from "@clerk/clerk-react";
import React, { useState } from "react";
import AuthError from "./AuthError";
import { Box, Button, TextField } from "@mui/material";
import { UserContext } from "../App";




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
            {isSignedIn ?
                <Box
                    margin='100px'
                >
                    <TextField
                        id="token-id"
                        label="Copy"
                        value={token}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    <Button onClick={async () => {
                        const r = await ddns?.getToken()
                        setToken(r.token)
                    }}>Get Token</Button>
                </Box>
                : <AuthError />}
        </>
    )

}