import { Request, Response, Router } from "express";
import authMiddleware from '../middleware'
import recordService from '../../service/recordService'


export const router = Router();
router.use(authMiddleware())


router.get("/ip", async (req: Request, res: Response) => {
    const userEmail = req.query.email as string
    const cname = req.query.cname as string
    if(!userEmail || !cname){
        return res.status(400).send({msg: "email not passed"})
    }
    const r = await recordService.getRecordsForUser(userEmail);
    const db_res = r.data?.find((item ) => {
        return item.fqdn == cname
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
    const r = await recordService.getRecordsForUser(userEmail);
    const db_res = r.data?.find((item ) => {
        return item.fqdn == cname
    })
    if(!db_res){
        return res.status(400).send({msg: "invalid record id"})
    }
    const resp = await recordService.updateRecord(userEmail, {
        zone_id: db_res.zone_id,
        record_id: db_res.id,
        ip: ip,
        rootdomain: db_res.rootDomain,
        fqdn: db_res.fqdn
    })
    res.status(resp.code).send(resp);
})
