import express from "express";
import { cf } from "../../lib/cloudflare";
import {
  ClerkExpressRequireAuth,
} from '@clerk/clerk-sdk-node';
import { CFRoot, Result } from "../../types/cloudflare";
import {getDomainDetails, getRecord, listDomains, createRecord} from "../../db/db"
import { CreateRecordParams } from '../../types/routes/dns'
import { cors_policy } from "../utils";


export const router = express.Router();
router.use(cors_policy);
router.use(ClerkExpressRequireAuth())
router.use(express.json());
router.get("/domains/:domain", async (req, res) => {
  const name = req.params.domain as string || ""
  // TODO: add validation for name
  if(name){
    const r = await getDomainDetails(name)
    if(r){
     return res.send(r)
    }else{
      return res.status(404).send({"msg": "No domain found"})
    }
  }else{
    res.status(400).send({msg: "no domain specified"})
  }
})

router.get("/domains", async (req, res) => {
  const db_records = await listDomains()
  res.send(db_records)
})

router.get("/checkAvailability", async (req, res) => {
  const subdomain = req.query.subdomain as string || ""
  const rootdomain = req.query.rootdomain as string || ""
  // TODO: add validation for name
  if(!subdomain || !rootdomain){
    return res.status(404).send({msg:"empty search string not allowed"})
  }
  if(await getDomainDetails(rootdomain)){
    const db_records = await getRecord(`${subdomain}.${rootdomain}`)
    res.send(!(!!db_records))
  }else{
    return res.status(403).send("Invalid root domain")
  }
})

router.get("/records", async (req, res) => {
  const zone_id = req.query.zone_id as string 
  const name = req.query.name as string || ""
  console.log("searching dns rec for name ", name)
  res.send(
    JSON.stringify(
      (await cf.listDnsRecords(name, zone_id)).map((record) => {
        if (name) {
          if (name == record.name) {
            return {
              name: record.name,
              id: record.id,
            };
          }
        }
        else {
          return {
            name: record.name,
            id: record.id,
          };
        }
      })
    )
  );
});

// TODO: optimize this
router.get("/records/:record_id", async (req, res) => {
  const record_id = req.params.record_id;
  const zone_id = req.query.zone_id as string
  const record_details = (await cf.listDnsRecords("",zone_id)).filter((record) => {
    return record.id == record_id;
  });
  if (record_details.length == 0) {
    return res.status(404).send({
      msg: "no record found",
    });
  }
  res.send(JSON.stringify(record_details));
});


router.post("/records", async (req , res) => {
  // check auth DONE
  // Get email from auth
  // check root domain in DB get zone ID
  // Check record in db
  const email : any = req.auth.claims?.email  || "";
  const rec: CreateRecordParams = req.body;
  const fullname = rec.subdomain+"."+rec.rootdomain
  const subdomains = await getRecord(fullname)
  const domainDetails = await getDomainDetails(rec.rootdomain)
  if((!!subdomains)){
    return res.status(400).send({msg: "the provided dns record already exists " + fullname})
  }
  if(!(!!domainDetails)){
    return res.status(400).send({msg: "provided root domain does not exists" + rec.rootdomain})
  }

  const cf_res : CFRoot & {
    result: Result
  } = await cf.createDnsRecord(rec.ip, rec.subdomain, rec.zone_id);
  if (!cf_res.success) {
    return res.status(500).send(JSON.stringify(cf_res.errors));
  }
  const dbRes = await createRecord({
    cname: cf_res.result.name,
    id: cf_res.result.id,
    ip: cf_res.result.content,
    userId: email,
    rootDomain: cf_res.result.zone_name,
    zone_id: rec.zone_id
  })
  res.send(dbRes);
});



