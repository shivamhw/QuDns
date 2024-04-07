import { NextFunction, Request, Response } from "express"
import jwt from 'jsonwebtoken';

interface JwtPayload {
    email : string
}


export default function authMiddleware(){
    return  (req: Request, res : Response, next: NextFunction) => {
        let token = req.headers.authorization
        if(!token){
            return res.status(401).send({msg : "Unauthorized"})
        }
        try{
            const email = jwt.verify(token, process.env.JWT_SECRET || "") as JwtPayload
            res.locals.email =  email.email
            next()
        }catch(err){
            return res.status(401).send({msg: "Unauthorized", err: err})
        }
    }
    
}
