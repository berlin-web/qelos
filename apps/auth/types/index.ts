import {Request} from 'express'

export interface AuthRequest extends Request {
  headers: {
    tenant: string,
    authorization?: string,
    Authorization?: string,
    tenanthost?: string,
    origin?: string,
    host?: string,
  }
  userPayload: {
    sub: string,
    tenant: string,
    email: string,
    name: string,
    fullName: string,
    firstName: string,
    lastName: string,
    birthDate: string,
    roles: string[],
    isPrivileged: boolean,
    user: any
  }
}
