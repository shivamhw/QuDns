import cors from 'cors'


export const corsOrigin = {
    origin:'http://localhost:5173', //or whatever port your frontend is using
    credentials:true,            
    optionSuccessStatus:200
}

export const cors_policy = cors(corsOrigin)