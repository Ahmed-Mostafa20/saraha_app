import { messageModel, userModel } from '../../database/index.js'
import { BadRequestException, NotFoundException } from '../../responce/index.js'


export const sendMessage = async (data, id) => {
    const { message, image } = data
    let userExists = await userModel.findById(id)
    if (!userExists) {
        return NotFoundException({ message: 'User not found' })
    }
    let addedMessage = await messageModel.create({ message, image, reciverId: id })
    if (addedMessage) {
        return addedMessage
    }
    else {
        return BadRequestException({ message: 'message not sent' })
    }
}

export const getMessages = async (id) => {
    let messages = await messageModel.find({ reciverId: id }).populate('reciverId')
    if (messages) {
        return messages
    }
    else {
        return NotFoundException({ message: 'messages not found' })
    }
}

export const getMessageById = async (messageId, userId) => {
    let message = await messageModel.findOne({ _id: messageId, reciverId: userId }).populate('reciverId')
    if (message) {
        return message
    }
    else {
        return NotFoundException({ message: 'message not found' })
    }
}

export const deleteMessage = async (messageId) => {
    let message = await messageModel.findByIdAndDelete(messageId)
    if (message) {
        return message
    }
    else {
        return NotFoundException({ message: 'message not found' })
    }
}