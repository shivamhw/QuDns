import { Domain } from "@prisma/client"
import { getDomainByName, getDomains } from "../db/domainDao"

export type DomainResponse = {
    msg: string
    code: number
    data: Domain[]
}

class DomainService {
    async getDomainByName(name: string) {
        if (!name) {
            return { msg: "no domain specified", code: 400 }
        }
        const r = await getDomainByName(name)
        if (r) {
            return { msg: "domain get success", code: 200, data: r }
        }
        return { "msg": "No domain found", code: 404 }
    }

    async getDomains() : Promise<DomainResponse>{
        const db_records = await getDomains()
        return { msg: "get all domain success", code: 200, data: db_records }
    }
}


const ds = new DomainService()

export default ds