import { userModel } from '../../database/index.js'
import { BadRequestException, comparePassword, hashPassword, NotFoundException, sendEmail } from '../../common/index.js'
import { baseURL } from '../../../config/index.js'


export const updateUser = async (userId, data, file) => {
    let updateData = { ...data }
    if (file) {
        updateData.profileImage = file.path
    }
    const user = await userModel.findOneAndUpdate({ _id: userId }, data, { returnDocument: 'after' })
    if (user) {
        return user
    }
    else {
        return NotFoundException({ message: 'User not found' })
    }
}

export const deleteUser = async (userId) => {
    const user = await userModel.findOneAndDelete({ _id: userId })
    if (user) {
        return user
    }
    else {
        return NotFoundException({ message: 'User not found' })
    }
}

export const updatePassword = async (userId, data) => {
    let { oldPassword, newPassword } = data
    const user = await userModel.findById(userId)
    if (!user) {
        return NotFoundException({ message: 'User not found' })
    }
    let isMatched = await comparePassword(oldPassword, user.password)
    if (!isMatched) {
        return BadRequestException({ message: 'Old password is incorrect' })
    }
    if (oldPassword === newPassword) {
        return BadRequestException({ message: 'New password must be different from old password' })
    }
    let hashedPassword = await hashPassword(newPassword)
    user.password = hashedPassword
    await user.save()
    return user
}
export const sendOtpToForgetPassword = async (email) => {
    const user = await userModel.findOne({ email })
    if (!user) {
        return NotFoundException({ message: 'User not found' })
    }
    const OTP = Math.floor(100000 + Math.random() * 900000).toString()
    user.otpCode = OTP
    user.otpExpires = Date.now() + 5 * 60 * 1000
    await user.save()
    await sendEmail(user.email, 'Your OTP Code', `Your OTP code to reset your password is ${OTP}. It will expire in 5 minutes.`)
    return user.email
}
export const verifyOtpForForgetPassword = async (data) => {
    let { otp, newPassword, email } = data
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
    let hashedPassword = await hashPassword(newPassword)
    user.password = hashedPassword
    await user.save()
    return user
}
export const shareProfileLink = async (userId) => {
    const user = await userModel.findById(userId)
    if (!user) {
        return NotFoundException({ message: 'User not found' })
    }
    const profileLink = `${baseURL}${user.sharedName}`
    return profileLink
}

export const getUserData = async (data) => {
    let { sharedLink } = data
    let sharedName = sharedLink.split('/')[3]
    const user = await userModel.findOne({ sharedName }, {
        password: 0, otpCode: 0, otpExpires: 0, deleteAfter: 0,
        isEmailVerified: 0, emailOtpExpires: 0, emailOtpCode: 0, twoStepEnabled: 0
    })
    return user
}