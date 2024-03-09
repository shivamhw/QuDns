export interface CFRoot {
    errors: Error[] | []
    messages: any[]
    result: Result | Result[]
    success: boolean
}

export interface Result {
    content: string
    name: string
    proxied: boolean
    type: string
    comment: string
    created_on: string
    id: string
    locked: boolean
    meta: Meta
    modified_on: string
    proxiable: boolean
    tags: string[]
    ttl: number
    zone_id: string
    zone_name: string
}

export interface Meta {
    auto_added: boolean
    source: string
}

export interface Error {
    code: number
    message: string
}