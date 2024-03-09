import { PrismaClient, Records } from '@prisma/client'
const prisma = new PrismaClient()


export async function listRecords(){
    const res = await prisma.records.findMany({})
    return res
}

export async function createRecord(rec : Records){
    const res = await prisma.records.create({
        data: {
            cname:rec.cname,
            id: rec.id,
            ip: rec.ip,
            userId: rec.userId,
            rootDomain: rec.rootDomain,
            zone_id : rec.zone_id
        }
    })
    return res
}

export async function listRecordsByUser(userEmail: string){
    const res = await prisma.records.findMany({
        where:{
            userId:{
                equals: userEmail
            }
        }
    })
    console.log("list record by yuser ", res)
    return res;
}
export async function listDomains(){
    const res = await prisma.domain.findMany({})
    return res
}

export async function getDomainDetails(domain: string){
    const res = await prisma.domain.findFirst({
        where:{
            rootDnsName:{
                equals: domain
            }
        }
    })
    return res
}


export async function getRecord(url: string){
    const res = await prisma.records.findFirst({
        where:{
            cname:{
                equals : url
            }
        }
    })
    return res
}

export async function deleteRecord(record_id: string) {
    const res = await prisma.records.delete({
        where:{
            id: record_id
        }
    })
    return res
}

export async function updateRecord(record_id: string, ip: string) {
    const res = await prisma.records.update({
        where:{
            id: record_id
        },
        data:{
            ip: ip
        }
    })
    return res
}

const main = async ()=>{
    var r = await listRecords()
    console.log("fdsaf", r)
}

// main()