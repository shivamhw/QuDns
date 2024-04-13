import { Request, Response, Router } from "express";
import authMiddleware from '../middleware'
import { listRecordsByUser, updateRecord } from "../../db/db";
import { cf } from "../../lib/cloudflare";



export const router = Router();
router.use(authMiddleware())


router.get("/ip", async (req: Request, res: Response) => {
    const userEmail = req.query.email as string
    const cname = req.query.cname as string
    if(!userEmail || !cname){
        return res.status(400).send({msg: "email not passed"})
    }
    const r = await listRecordsByUser(userEmail);
    const db_res = r.find((item ) => {
        return item.cname == cname
    })
    if(!db_res){
        return res.status(404).send(
            {
                msg: "no record found"
            }
        )
    }
    res.send(db_res)
})

// update current ip
router.put("/ip", async (req: Request, res: Response) => {
    const userEmail = req.query.email as string
    const cname = req.query.cname as string
    const ip = req.query.ip as string
    if(!userEmail || !cname || !ip ){
        return res.status(400).send({msg: "email not passed"})
    }
    const r = await listRecordsByUser(userEmail);
    const db_res = r.find((item ) => {
        return item.cname == cname
    })
    if(!db_res){
        return res.status(400).send({msg: "invalid record id"})
    }
    const cf_res = await cf.updateDnsRecord(ip, db_res.cname, db_res.id, db_res.zone_id || "");
    if (!cf_res.success) {
      return res.status(404).send(JSON.stringify(cf_res.errors));
    }
    const db_r = await updateRecord(db_res.id, ip)
    res.send(db_r);
})
