import { Request, Response, Router } from "express";

export const router = Router();


//get current ip
router.get("/ip", (req: Request, res: Response) => {
    res.send(JSON.stringify({ "msg": "pong" }))
})

// update current ip
router.get("/ip", (req: Request, res: Response) => {
    res.send(JSON.stringify({ "msg": "pong" }))
})
