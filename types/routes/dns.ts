export interface CreateRecordParams {
    ip: string;
    subdomain: string;
    rootdomain: string;
    zone_id: string
  }
  
export type UpdateRecordParams = CreateRecordParams & { record_id: string };
export type UpdateRecordResponse = CreateRecordParams & { record_id: string };


export type DeleteRecordParams = {
    record_id: string;
    zone_id:   string
}