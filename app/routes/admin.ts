import { Request, Response, Router } from "express";

export const router = Router();

router.get("/ping", (req: Request, res: Response) => {
    res.send(JSON.stringify({ "msg": "pong" }))
})
