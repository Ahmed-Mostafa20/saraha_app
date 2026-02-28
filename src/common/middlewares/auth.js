import { UnauthorizedException } from '../../responce/index.js'
import { decodeToken } from '../security/security.js'


export const auth = (req, res, next) => {
    if (!req.headers.authorization) {
        return UnauthorizedException({ message: 'Unauthorized' })
    }
    const [flag, token] = req.headers.authorization.split(' ')
    switch (flag) {
        case 'Bearer':
            let decodedData = decodeToken(token)
            req.userId = decodedData.id
            next()
            break;
        default:
            return UnauthorizedException({ message: 'Unauthorized' })
    }
}