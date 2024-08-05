import axios, { AxiosInstance } from "axios";
import { CFRoot, Result } from "../types/cloudflare";
import { DeleteRecordParams } from "../service/recordService";

export class CloudFlare {
  private TTL: number = 3600;
  private client: AxiosInstance;

  constructor(key: string) {
    this.client = axios.create({
      baseURL: "https://api.cloudflare.com",
      validateStatus: () => true,
      headers: {
        Authorization: `Bearer ${key}`,
      },
    });
  }

  public async createDnsRecord(ip: string, url: string, zone_id: string) {
    const endpoint = `/client/v4/zones/${zone_id}/dns_records`;
    const res = await this.client.post<CFRoot & {
      result : Result
    }>(endpoint, {
      content: ip,
      name: url,
      proxied: false,
      type: "A",
      comment: "Domain record",
      ttl: this.TTL,
    });
    return res.data;
  }

  public async updateDnsRecord(ip: string, url: string, record_id: string, zone_id: string) {
    const endpoint = `/client/v4/zones/${zone_id}/dns_records/${record_id}`;
    const res = await this.client.put<CFRoot>(endpoint, {
      content: ip,
      name: url,
      proxied: false,
      type: "A",
      comment: "Domain record",
      ttl: this.TTL,
    });
    return res.data;
  }

  public async deleteDnsRecord(req : DeleteRecordParams) {
    const endpoint = `/client/v4/zones/${req.zone_id}/dns_records/${req.record_id}`;
    const res = await this.client.delete<CFRoot>(endpoint);
    return res.data;
  }
  
  public async listDnsRecords(name : String = "", zone_id: string) {
    const endpoint = `https://api.cloudflare.com/client/v4/zones/${zone_id}/dns_records?search=${name}`;
    const res = await this.client.get<CFRoot>(endpoint);
    return res.data.result as Result[];
  }
}


export const cf = new CloudFlare(
  process.env.CF_API_KEY || ""
);
