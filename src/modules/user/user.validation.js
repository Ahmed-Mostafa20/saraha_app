import joi from 'joi'

export const updatePasswordValidationSchema = joi.object().keys({
    oldPassword: joi.string().min(8).max(35).required(),
    newPassword: joi.string().pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,35}$/).required(),
})

export const updateUserValidationSchema = joi.object().keys({
    userName: joi.string().min(3).max(30).optional(),
    email: joi.string().email().optional(),
    provider: joi.optional(),
    profileImage: joi.string().optional(),
    password: joi.forbidden()
})

export const forgotPasswordValidationSchema = joi.object().keys({
    email: joi.string().email().required(),
    otp: joi.string().length(6).required(),
    newPassword: joi.string().pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,35}$/).required(),
})