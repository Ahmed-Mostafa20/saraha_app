import {hash , compare } from 'bcrypt'
import {salt} from '../../../config/index.js'

export const hashPassword = async (password) => {
    const hashedPassword = await hash(password, +salt)
    return hashedPassword
}

export const comparePassword = async (password , hashedPassword) => {
    const isMatched = await compare(password, hashedPassword)
    return isMatched
}