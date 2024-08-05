import { Domain } from "@prisma/client"
import db_client from "./db"


export async function getDomains(){
    const res = await db_client.domain.findMany({})
    return res
}


export async function createDomain(domain: Domain) {
    const res = await db_client.domain.create({
        data:{
            ...domain
        }
    })
    return res
}

export async function deleteDomain(domain_id: string) {
    const res = await db_client.domain.delete({
        where: {
            id: domain_id
        }
    })
    return res
}

export async function updateDomain(domain: Domain){
    const res = await db_client.domain.update({
        where:{
                id: domain.id
        },
        data : {
            enabled: domain.enabled
        }
    })
    return res
}

export async function getDomainByName(domain: string){
    const res = await db_client.domain.findFirst({
        where:{
            rootDnsName:{
                equals: domain
            }
        }
    })
    return res
}

