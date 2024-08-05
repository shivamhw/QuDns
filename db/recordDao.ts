import db_client from './db'
import { Record } from '@prisma/client'


export async function getRecords() {
    const res = await db_client.record.findMany({})
    return res
}

export async function getRecordByName(url: string) {
    const res = await db_client.record.findFirst({
        where: {
            fqdn: {
                equals: url
            }
        }
    })
    return res
}

export async function listRecordsByUser(userEmail: string){
    const res = await db_client.record.findMany({
        where:{
            userEmail:{
                equals: userEmail
            }
        }
    })
    return res;
}

export async function deleteRecord(record_id: string) {
    const res = await db_client.record.delete({
        where: {
            id: record_id
        }
    })
    return res
}

export async function updateRecord(record_id: string, refers: string) {
    const res = await db_client.record.update({
        where: {
            id: record_id
        },
        data: {
            refers: refers
        }
    })
    return res
}

export async function createRecord(rec: Record) {
    const res = await db_client.record.create({
        data: {
            ...rec
        }
    })
    return res
}

