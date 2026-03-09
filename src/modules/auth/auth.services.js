import { userModel } from '../../database/index.js'
import { BadRequestException, NotFoundException } from '../../common/index.js'
import { hashPassword, comparePassword, genrateNewAccessToken } from '../../common/index.js'
import { genrateToken } from '../../common/index.js'
import { sendEmail } from '../../common/index.js'


export const signUp = async (data, file) => {
    const { userName, email, password, provider } = data
    const userExists = await userModel.findOne({ email })
    if (userExists) {
        return BadRequestException({ message: 'User already exists' })
    }
    let hashedPassword = await hashPassword(password)
    const OTP = Math.floor(100000 + Math.random() * 900000).toString()
    let emailOtpCode = OTP
    let emailOtpExpires = Date.now() + 24 * 60 * 60 * 1000
    const user = await userModel.create({ userName, email, password: hashedPassword, provider, profileImage: file ? file.path : '', emailOtpCode, emailOtpExpires })
    sendEmail(user.email, 'email verification code', `Your OTP code to  verify your email is 
         ${OTP}. It will expire in 24 hours.`)
    return user
}

export const login = async (data, host) => {
    const { email, password } = data
    const user = await userModel.findOne({ email })
    if (!user) {
        return NotFoundException({ message: 'user name or password is incorrect' })
    }
    if (user.lockUntil && user.lockUntil > Date.now()) {
        return BadRequestException({ message: 'Account is locked. Please try again later.' })
    }
    if (!user.isEmailVerified) {
        return BadRequestException({ message: 'Please verify your email before logging in' })
    }
    const isMatched = await comparePassword(password, user.password)
    if (!isMatched) {
        user.loginCount += 1
        if (user.loginCount >= 5) {
            user.lockUntil = Date.now() + 5 * 60 * 1000
            user.loginCount = 0
        }
        await user.save()
        return BadRequestException({ message: 'user name or password is incorrect' })
    }
    user.loginCount = 0
    user.lockUntil = null
    await user.save()
    if (user.twoStepEnabled) {
        const OTP = Math.floor(100000 + Math.random() * 900000).toString()
        user.otpCode = OTP
        user.otpExpires = Date.now() + 5 * 60 * 1000
        await user.save()
        sendEmail(user.email, 'Two-step verification code', `Your OTP code to enable two-step verification is 
         ${OTP}. It will expire in 5 minutes.`)
        return { message: 'OTP code sent to email' }
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

export const sendOtpToEnableTwoStep = async (userId) => {
    const user = await userModel.findById(userId)
    if (!user) {
        return NotFoundException({ message: 'User not found' })
    }
    if (user.twoStepEnabled) {
        return BadRequestException({ message: 'Two-step verification is already enabled' })
    }
    const OTP = Math.floor(100000 + Math.random() * 900000).toString()
    user.otpCode = OTP
    user.otpExpires = Date.now() + 5 * 60 * 1000
    await user.save()
    await sendEmail(user.email, 'Your OTP Code', `Your OTP code to enable two-step verification
     is ${OTP}. It will expire in 5 minutes.`)
    return user
}
export const verifyOtpToEnableTwoStep = async (userId, data) => {
    let { otp } = data
    const user = await userModel.findById(userId)
    if (!user) {
        return NotFoundException({ message: 'User not found' })
    }
    if (user.twoStepEnabled) {
        return BadRequestException({ message: 'Two-step verification is already enabled' })
    }
    if (user.otpCode != otp) {
        return BadRequestException({ message: 'Invalid OTP code' })
    }
    if (user.otpExpires < Date.now()) {
        return BadRequestException({ message: 'OTP code has expired' })
    }
    user.twoStepEnabled = true
    await user.save()
    return user

}
export const verfiyOtp = async (email, otp, host) => {
    const user = await userModel.findOne({ email })
    if (!user) {
        return NotFoundException({ message: 'User not found' })
    }
    if (user.otpCode != otp) {
        return BadRequestException({ message: 'Invalid OTP code' })
    }
    if (user.otpExpires < Date.now()) {
        return BadRequestException({ message: 'OTP code has expired' })
    }
    let { accessToken, refreshToken } = await genrateToken(user, host)
    return { user, accessToken, refreshToken }
}

export const verifyEmail = async (data) => {
    let {email , otp } = data
    const user = await userModel.findOne({ email })
    if (!user) {
        return NotFoundException({ message: 'User not found' })
    }
    if (user.isEmailVerified) {
        return BadRequestException({ message: 'Email is already verified' })
    }
    if (user.emailOtpCode != otp) {
        return BadRequestException({ message: 'Invalid OTP code' })
    }
    if (user.emailOtpExpires < Date.now()) {
        return BadRequestException({ message: 'OTP code has expired' })
    }
    user.isEmailVerified = true
    user.deleteAfter = null
    await user.save()
    return user
}

export const resendEmailVerificationOtp = async (email) => {
    const user = await userModel.findOne({ email })
    if (!user) {
        return NotFoundException({ message: 'User not found' })
    }
    if (user.isEmailVerified) {
        return BadRequestException({ message: 'Email is already verified' })
    }
    const OTP = Math.floor(100000 + Math.random() * 900000).toString()
    user.emailOtpCode = OTP 
    user.emailOtpExpires = Date.now() + 24 * 60 * 60 * 1000
    await user.save()
    await sendEmail(user.email, 'Your OTP Code', `Your OTP code to verify your email is ${OTP}. It will expire in 24 hours.`)
    return user.email
}   