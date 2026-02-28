import fs from 'fs'
import jwt from 'jsonwebtoken'
import { BadRequestException } from '../../responce/index.js'

const admin_privateKey = fs.readFileSync('keys/admin_private.key', 'utf-8')
const user_privateKey = fs.readFileSync('keys/user_private.key', 'utf-8')
const user_publicKey = fs.readFileSync('keys/user_public.key', 'utf-8')
const admin_publicKey = fs.readFileSync('keys/admin_public.key', 'utf-8')

export const genrateToken = async (user, host) => {
    let privateKey = undefined
    let audience = undefined
    if (user) {
        switch (user.role) {
            case "0":
                privateKey = admin_privateKey
                audience = 'admin'
                break;
            case "1":
                privateKey = user_privateKey
                audience = 'user'
                break;
            default:
                break;
        }
    }
    let accessToken = jwt.sign({ id: user.id }, privateKey,
        {
            algorithm: 'RS256',
            expiresIn: '30m',
            notBefore: '15s',
            issuer: host,
            audience
        })
    let refreshToken = jwt.sign({ id: user.id }, privateKey, {
        algorithm: 'RS256',
        expiresIn: '1y',
        issuer: host,
        audience
    })

    return { accessToken, refreshToken }

}

export const decodeToken = (token) => {
let decoded = jwt.decode(token)
    let publicKey = undefined
    switch (decoded.aud) {
        case "admin":
            publicKey = admin_publicKey
            break;
        case "user":
            publicKey = user_publicKey
            break;
        default:
            break;
    }
    let decodedData
    try {
        decodedData = jwt.verify(token, publicKey, { algorithms: ['RS256'] })
    } catch (error) {
        return BadRequestException({ message: 'Invalid token' })
    }

    return decodedData
}

export const genrateNewAccessToken = async (token) => {
    const decodedData = decodeToken(token)
    let privateKey = undefined
    switch (decodedData.aud) {
        case "admin":
            privateKey = admin_privateKey
            break;
        case "user":
            privateKey = user_privateKey
            break;
        default:
            break;
    }

    let newAccessToken = jwt.sign({ id: decodedData.id }, privateKey, { 
        algorithm: 'RS256',
         expiresIn: '30m',
          audience : decodedData.aud })
    return newAccessToken
}