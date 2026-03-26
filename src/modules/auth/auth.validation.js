import joi from 'joi'

export const signUpValidationSchema = joi.object().keys({
    userName: joi.string().min(3).max(30).required(),
    email: joi.string().email().required(),
    password: joi.string().pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,35}$/).required(),
    provider: joi.optional(),
    sharedName: joi.string().min(3).max(30).required(),
})

export const loginValidationSchema = joi.object().keys({
    email: joi.string().email().required(),
    password: joi.string().min(5).max(30).required(),
})    