import { Response } from 'express'
import jwt, { Secret } from 'jsonwebtoken'
import {
  jwtSecret, refreshTokenSecret, tokenExpiration,
  cookieTokenExpiration, cookieBaseDomain
} from '../../config';

export function verifyToken(token: string, tenant: string) {
  if (!token.trim()) {
    return Promise.reject()
  }
  return verify(token, tenant, jwtSecret)
}

export function verifyRefreshToken(refreshToken: string, tenant: string) {
  return verify(refreshToken, tenant, refreshTokenSecret)
}

function verify(token: string, tenant: string, secret: Secret) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err || !decoded || (decoded as any).tenant !== tenant) {
        // the 401 code is for unauthorized status
        return reject(err || { message: 'token is empty' })
      }
      return resolve(decoded)
    })
  })
}

export function getUniqueId(creationTime = Date.now().toString()) {
  return creationTime + ':' + Buffer.from(Math.random().toString()).toString('base64')
}

function getCookieParameters(cookieId: string, maxAge: string, domain?: string) {
  let cookieParams: any = { maxAge, httpOnly: true, path: '/api' }
  if (domain || cookieBaseDomain) {
    cookieParams.domain = domain || cookieBaseDomain
    cookieParams.sameSite = 'None'
    cookieParams.secure = true
  }

  return [cookieId, cookieParams]
}

export function setCookie(res: Response, cookieName: string, cookieId: string, maxAge?: number | string, domain?: string) {
  const [id, parameters] = getCookieParameters(cookieId, (maxAge || cookieTokenExpiration).toString(), domain)
  res.cookie(cookieName, id, parameters)
  return res
}

export function getSignedToken(user: any, workspace: any, tokenIdentifier: string, expiresIn = tokenExpiration) {
  const secretParams = {
    workspace,
    sub: user._id,
    tenant: user.tenant,
    username: user.username,
    email: user.email,
    phone: user.phone,
    name: user.name,
    fullName: user.fullName,
    firstName: user.firstName,
    lastName: user.lastName,
    roles: user.roles,
    profileImage: user.profileImage,
  }
  if (tokenIdentifier) {
    (secretParams as any).tokenIdentifier = tokenIdentifier
  }
  return {
    payload: secretParams,
    token: jwt.sign(secretParams, jwtSecret, { expiresIn })
  }
}


