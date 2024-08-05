import {
    ClerkExpressRequireAuth,
    WithAuthProp,
} from '@clerk/clerk-sdk-node';
import express, { Request, Response, Router } from 'express';
import recordService from '../../service/recordService'
import { cors_policy } from '../utils';
import { UpdateRecordParams } from '../../service/recordService';
import jwt from 'jsonwebtoken';

export const router = Router();
router.use(cors_policy);
router.use(ClerkExpressRequireAuth())
router.use(express.json());



router.get(
    '/domains',
    async (req: WithAuthProp<Request>, res: Response) => {
        const userEmail = req.auth.claims?.email as string
        try {
            const r = await recordService.getRecordsForUser(userEmail);
            res.status(r.code).send(r)
        }
        catch (err) {
            console.log(err)
            res.status(502).send({ msg: "error while getting back domains for user" })
        }
    }
);

router.delete("/records/:record_id", async (req, res) => {
    const record_id = req.params.record_id
    const userEmail = req.auth.claims?.email as string
    try {
        const r = await recordService.deleteRecord(userEmail, record_id);
        res.status(r.code).send(r)
    }
    catch (err) {
        console.log(err)
        res.status(502).send({ msg: "error while getting deleting record for user" })
    }
});

router.put("/records", async (req, res) => {
    const rec: UpdateRecordParams = req.body;
    const userEmail = req.auth.claims?.email as string
    try {
        const r = await recordService.updateRecord(userEmail, rec);
        res.status(r.code).send(r)
    }
    catch (err) {
        console.log(err)
        res.status(502).send({ msg: "error while getting updating record for user" })
    }
});

router.get("/token", (req, res) => {
    const userEmail = req.auth.claims?.email as string
    const key = process.env.JWT_SECRET
    if (!key || !userEmail) {
        return res.status(500).send({ msg: "server lost info" })
    }
    const data = {
        email: userEmail
    }
    const token = jwt.sign(data, key, {
        expiresIn: '90d'
    })
    res.send({ token: token, msg: "success" })
})