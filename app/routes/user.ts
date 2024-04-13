import {
    ClerkExpressRequireAuth,
    WithAuthProp,
} from '@clerk/clerk-sdk-node';
import express, { Request, Response, Router } from 'express';
import { deleteRecord, listRecordsByUser, updateRecord } from '../../db/db';
import { cors_policy } from '../utils';
import { cf } from '../../lib/cloudflare';
import { UpdateRecordParams } from '../../types/routes/dns';
import jwt from 'jsonwebtoken';

export const router = Router();
router.use(cors_policy);
router.use(ClerkExpressRequireAuth())
router.use(express.json());



router.get(
    '/domains',
    async (req: WithAuthProp<Request>, res: Response) => {
        const userEmail = req.auth.claims?.email as string
        if(!userEmail){
            return res.status(400).send({msg: "email not passed"})
        }
        const r = await listRecordsByUser(userEmail);
        res.send(r)
    }
);

router.delete("/records/:record_id", async (req, res) => {
    const record_id = req.params.record_id
    const userEmail = req.auth.claims?.email as string
    if(!userEmail){
        return res.status(400).send({msg: "email not passed"})
    }
    const r = await listRecordsByUser(userEmail);
    const db_res = r.find((item) => {
        return item.id == record_id
    })
    if(!db_res){
        return res.status(400).send({msg: "invalid record id"})
    }
    const cf_res = await cf.deleteDnsRecord({
        record_id: db_res.id,
        zone_id: db_res.zone_id || ""
    });
    if (!cf_res.success) {
      return res.status(404).send(JSON.stringify(cf_res.errors));
    }
    const resp = await deleteRecord(db_res.id)
    res.send(resp)
  });  

router.put("/records", async (req, res) => {
    const rec: UpdateRecordParams = req.body;
    const userEmail = req.auth.claims?.email as string
    if(!userEmail){
        return res.status(400).send({msg: "email not passed"})
    }
    let r = await listRecordsByUser(userEmail);
    const db_res = r.find((item) => {
        return item.id == rec.record_id
    })
    if(!db_res){
        return res.status(400).send({msg: "invalid record id"})
    }
    const cf_res = await cf.updateDnsRecord(db_res.ip, db_res.cname, rec.record_id, rec.zone_id);
    if (!cf_res.success) {
      return res.status(404).send(JSON.stringify(cf_res.errors));
    }
    const db_r = await updateRecord(rec.record_id, rec.ip)
    res.send(db_r);
  });

router.get("/token", (req, res)=>{
    const userEmail = req.auth.claims?.email as string
    const key = process.env.JWT_SECRET 
    if(!key || !userEmail){
        return res.status(500).send({msg: "server lost info"})
    }
    const data = {
        email: userEmail
    }
    const token = jwt.sign(data, key, {
        expiresIn: '90d'
    })
    res.send({token: token, msg: "success"})
})