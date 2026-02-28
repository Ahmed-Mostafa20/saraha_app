import joi from 'joi'

export const messageValidationSchema = joi.object().keys({
    message: joi.string().min(10).max(600).required(),
    image: joi.string().optional()
    }) 

    