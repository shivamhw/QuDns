import { Request, Response, Router, NextFunction } from "express";
import authMiddleware from '../middleware'



export const router = Router();
router.use(authMiddleware())


//get current ip
router.get("/ip", (req: Request, res: Response) => {
    res.send(JSON.stringify({ "msg": res.locals.email }))
})

// update current ip
router.get("/ip", (req: Request, res: Response) => {
    res.send(JSON.stringify({ "msg": "pong" }))
})
