import axios, { AxiosInstance } from "axios";
import { listDomain } from "../../../types/ddns";
import axiosRetry from "axios-retry"
import { Records } from "@prisma/client";
import Cookies from "js-cookie";
import { DeleteRecordParams, UpdateRecordParams } from '../../../types/routes/dns';



export class ddns{
    private static api : ddns
    private client : AxiosInstance
    private constructor(baseUrl : string = "/"){
        this.client = axios.create({
            baseURL: baseUrl,
            withCredentials: true 
        })
        
        this.enableRetry()
        this.enableMiddleware()
    }
    public static getInstance(){
        if(!ddns.api){
            console.log("api client not initialized")
            this.api = new ddns()
        }else{
            console.log("cached api client")
        }
        return this.api
    }

    // TODO: this is a hack plz fix this
    public enableRetry(){
        axiosRetry(this.client, {
            retries: 3, // number of retries
            retryDelay: (retryCount) => {
                console.log(`retry attempt: ${retryCount}`);
                return retryCount * 2000; // time interval between retries
            },
            retryCondition: (error) => {
                // if retry condition is not specified, by default idempotent requests are retried
                if(error.response){
                return error.response.status === 401;
                }
                return false;
            },
        });
         
    }

    public enableMiddleware(){
        this.client.interceptors.request.use(async (config) => {
            config.headers.Authorization =  Cookies.get("__session");
            return config;
        }, (error) => {
            return Promise.reject(error);
    });
    }

    public async listRecords(zone_id: string){
        const res = await this.client.get("/dns/records", {
            params:{
                zone_id: zone_id
            }
        })
        console.log(res.data)
        return res.data
    }

    public async listDomains() : Promise<listDomain[]>{
        console.log("coookie before callin g", Cookies.get("__session"))
        const res = await this.client.get("/dns/domains")
        console.log(res.data)
        return res.data
    }

    public async getRecordsByName(name: string, zone_id: string){
        const res = await this.client.get("/dns/records", {
            params:{
                name: name,
                zone_id: zone_id
            }
        })
        return res.data
    }

    public async getRecordsByEmail() : Promise<Records[]>{
        const res = await this.client.get("/user/domains")
        return res.data
    }

    public async checkAvailability(subdomain:string, rootdomain: string){
        const res = await this.client.get("/dns/checkAvailability", {
            params:{
                rootdomain: rootdomain,
                subdomain: subdomain
            }
        })
    return res.data
    }
    public async getToken(){
        const res = await this.client.get("/user/token")
        console.log(res.data)
        return res.data
}

    public async createRecord(ip: string, subdomain: string | undefined, rootdomain: string | undefined, zone_id: string){
        const res = await this.client.post("/dns/records", {
                subdomain: subdomain,
                rootdomain: rootdomain,
                ip: ip,
                zone_id: zone_id
        })
        return res.data
    }

    public async updateRecord(req : UpdateRecordParams){
        const res = await this.client.put<UpdateRecordParams>("/user/records", req)
        return res.data
    }
    public async deleteRecord(req : DeleteRecordParams){
        const res = await this.client.delete<DeleteRecordParams>("/user/records/"+req.record_id)
        return res.data
    }
}

export const client = ddns.getInstance()

// const main = async ()=>{
//     var c = ddns.getInstance()
//     var r = await c.listRecords()
//     console.log(r)
//     var c = ddns.getInstance()
//     var f = await c.listRecords()
// }

// main()