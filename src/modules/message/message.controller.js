import express from 'express'
import { deleteMessage, getMessageById, getMessages, sendMessage } from './message.services.js'
import { SuccessResponse } from '../../responce/index.js'
import { auth, validation } from '../../common/index.js'
import { messageValidationSchema } from './message.validation.js'

const router = express.Router()

router.post('/send-message/:id',validation(messageValidationSchema) ,async (req, res) => {
    const message = await sendMessage(req.body,req.params.id)
    return SuccessResponse({ res, status: 201, message: "message sent", data: message })
})

router.get('/get-messages-for-user',auth, async (req, res) => {
    const messages = await getMessages(req.userId)
    return SuccessResponse({ res, status: 201, message: "all messages", data: messages })
})

router.get('/get-message-by-id/:id', auth,async (req, res) => {
    const message = await getMessageById(req.params.id,req.userId)
    return SuccessResponse({ res, status: 201, message: "find message", data: message })
})

router.delete('/delete-message/:id', auth,async (req, res) => {
    const message = await deleteMessage(req.params.id)
    return SuccessResponse({ res, status: 201, message: "message deleted", data: message })
})
export  {router as MessageRouter}