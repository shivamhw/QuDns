import express from "express";
import { cf } from "../../lib/cloudflare";
import {
  ClerkExpressRequireAuth,
} from '@clerk/clerk-sdk-node';
import { CreateRecordParams } from '../../service/recordService'
import { cors_policy } from "../utils";
import domainService from '../../service/domainService'
import recordService from '../../service/recordService'
export const router = express.Router();
router.use(cors_policy);
router.use(ClerkExpressRequireAuth())
router.use(express.json());


router.get("/domains/:domain", async (req, res) => {
  const name = req.params.domain as string || ""
  // TODO: add validation for name
  try {
    const rec = await domainService.getDomainByName(name)
    res.status(rec.code).send(rec)
  } catch (err) {
    console.log("error in get domain")
    res.status(502).send({ msg: "service failed in getting domain" })
  }
})

router.get("/domains", async (req, res) => {
  try {
    const rec = await domainService.getDomains()
    res.status(rec.code).send(rec)
  } catch (err) {
    console.log("error in get domain")
    res.status(502).send({ msg: "service failed in getting domain" })
  }
})

router.get("/checkAvailability", async (req, res) => {
  const subdomain = req.query.subdomain as string || ""
  const rootdomain = req.query.rootdomain as string || ""
  let is_available = true
  // TODO: add validation for name
  if (!subdomain || !rootdomain) {
    return res.status(404).send({ msg: "empty search string not allowed" })
  }
  try {
    if (await domainService.getDomainByName(rootdomain)) {
      const db_records = await recordService.getRecordByName(`${subdomain}.${rootdomain}`)
      if(db_records.code == 200 ){
          is_available = false
      }
      res.status(db_records.code).send(is_available)
    } else {
      return res.status(403).send("Invalid root domain")
    }
  } catch (err) {
    res.status(502).send({ msg: "error getting availability for domain" })
  }

})

router.get("/records", async (req, res) => {
  const zone_id = req.query.zone_id as string
  const name = req.query.name as string || ""
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
  const record_details = (await cf.listDnsRecords("", zone_id)).filter((record) => {
    return record.id == record_id;
  });
  if (record_details.length == 0) {
    return res.status(404).send({
      msg: "no record found",
    });
  }
  res.send(JSON.stringify(record_details));
});


router.post("/records", async (req, res) => {
  // check auth DONE
  // Get email from auth
  // check root domain in DB get zone ID
  // Check record in db
  const email: any = req.auth.claims?.email || "";
  const rec: CreateRecordParams = req.body;
  const subdomains = await recordService.getRecordByName(rec.fqdn)
  const domainDetails = await domainService.getDomainByName(rec.rootdomain)
  if ((!!subdomains)) {
    return res.status(400).send({ msg: "the provided dns record already exists " + rec.fqdn })
  }
  if (!(!!domainDetails)) {
    return res.status(400).send({ msg: "provided root domain does not exists" + rec.rootdomain })
  }
  if( rec.fqdn.split(".").length > 2 ){
    return res.status(400).send({ msg: "multilevel not allowed " + rec.rootdomain })
  }

  const dbRes = await recordService.createRecord(email, {
    fqdn: rec.fqdn,
    ip: rec.ip,
    rootdomain: rec.rootdomain,
    zone_id: rec.zone_id
  })
  res.send(dbRes);
});



