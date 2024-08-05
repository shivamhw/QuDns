import { Record } from "@prisma/client"
import { createRecord, deleteRecord, getRecordByName, listRecordsByUser, updateRecord } from "../db/recordDao"
import { cf } from "../lib/cloudflare"
import { CFRoot, Result } from "../types/cloudflare"


type RecordResponse = {
    msg: string,
    code: number,
    data?: Record[]
}

export interface CreateRecordParams {
    ip: string;
    rootdomain: string;
    zone_id: string
    fqdn: string
}

export type UpdateRecordParams = CreateRecordParams & { record_id: string };
export type UpdateRecordResponse = CreateRecordParams & { record_id: string };


export type DeleteRecordParams = {
    record_id: string;
    zone_id: string
}

class RecordService {
    async getRecordsForUser(userEmail: string): Promise<RecordResponse> {
        if (!userEmail) {
            return { msg: "email not passed", code: 400 }
        }
        const r = await listRecordsByUser(userEmail)
        return { msg: "records success", code: 200, data: r }
    }

    async createRecord(userEmail: string, rec: CreateRecordParams) {
        const cf_res: CFRoot & {
            result: Result
        } = await cf.createDnsRecord(rec.ip, rec.fqdn.split(".")[0], rec.zone_id);
        if (!cf_res.success) {
            return { msg: JSON.stringify(cf_res.errors), code: 502 }
        }
        const r = await createRecord({
            fqdn: cf_res.result.name,
            id: cf_res.result.id,
            refers: cf_res.result.content,
            userEmail: userEmail,
            rootDomain: cf_res.result.zone_name,
            zone_id: rec.zone_id
        })
        return { msg: "records success", code: 200, data: r }
    }

    async getRecordByName(name: string) {
        if (!name) {
            return { msg: "email not passed", code: 400 }
        }
        const r = await getRecordByName(name)
        if (r == null) {
            return { msg: "no records found", code: 404 }
        }
        return { msg: "records success", code: 200, data: r }
    }

    async deleteRecord(userEmail: string, record_id: string) {
        if (!userEmail) {
            return { msg: "email not passed", code: 400 }
        }
        const r = await listRecordsByUser(userEmail);
        const db_res = r.find((item) => {
            return item.id == record_id
        })
        if (!db_res) {
            return { msg: "invalid record id", code: 404 }
        }
        const cf_res = await cf.deleteDnsRecord({
            record_id: db_res.id,
            zone_id: db_res.zone_id || ""
        });
        if (!cf_res.success) {
            return { msg: JSON.stringify(cf_res.errors), code: 502 }
        }
        const resp = await deleteRecord(db_res.id)
        return { msg: "delete success", code: 200, data: resp }
    }

    async updateRecord(userEmail: string, rec: UpdateRecordParams) {
        if (!userEmail) {
            return { msg: "email not passed", code: 400 }
        }
        let r = await listRecordsByUser(userEmail);
        const db_res = r.find((item) => {
            return item.id == rec.record_id
        })
        if (!db_res) {
            return { msg: "invalid record id", code: 404 }
        }
        const cf_res = await cf.updateDnsRecord(db_res.refers, db_res.fqdn, rec.record_id, rec.zone_id);
        if (!cf_res.success) {
            return { msg: JSON.stringify(cf_res.errors), code: 502 }
        }
        const db_r = await updateRecord(rec.record_id, rec.ip)
        return { msg: "update success", code: 200, data: db_r }
    }
}

const rs = new RecordService()
export default rs