import { PrismaClient } from '@prisma/client'
const db_client = new PrismaClient()

console.log("Db Client created")
export default db_client