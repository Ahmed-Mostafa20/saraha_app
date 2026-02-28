import { userModel } from '../../database/index.js'
import { BadRequestException, NotFoundException } from '../../responce/index.js'
import { hashPassword, comparePassword, genrateNewAccessToken } from '../../common/index.js'
import { genrateToken } from '../../common/index.js'


export const signUp = async (data, file) => {
    const { userName, email, password, provider } = data
    const userExists = await userModel.findOne({ email })
    if (userExists) {
        return BadRequestException({ message: 'User already exists' })
    }
    let hashedPassword = await hashPassword(password)
    const user = await userModel.create({ userName, email, password: hashedPassword, provider, profileImage: file ? file.path : '' })
    return user
}

export const login = async (data, host) => {
    const { email, password } = data
    const user = await userModel.findOne({ email })
    if (!user) {
        return NotFoundException({ message: 'User not found' })
    }
    const isMatched = await comparePassword(password, user.password)
    if (!isMatched) {
        return BadRequestException({ message: 'user name or password is incorrect' })
    }

    let { accessToken, refreshToken } = await genrateToken(user, host)

    return { user, accessToken, refreshToken }
}

export const getUserById = async (decodedId) => {
    const user = await userModel.findById(decodedId)
    if (user) {
        return user
    }
    else {
        return NotFoundException({ message: 'User not found' })
    }
}

export const getNewAccessToken = async (token) => {
    const newAccessToken = genrateNewAccessToken(token)
    return newAccessToken

}

export const viewProfile = async (viewerId, userId) => {
    if (viewerId.toString() === userId.toString()) {
        return BadRequestException({ message: 'the viewer is the same as the user ' })
    }
    const user = await userModel.findByIdAndUpdate(userId, { $inc: { viewCount: 1 } },
        { returnDocument: 'after' }).select('-password')
    if (user) {
        return user
    }
    else {
        return NotFoundException({ message: 'User not found' })
    }
}