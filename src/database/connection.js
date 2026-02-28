import mongoose from 'mongoose'
import { mongoURL } from '../../config/index.js'

export const databaseConnection = async () => {
    const connection = await mongoose.connect(mongoURL
    ).then(() => { console.log("Database connected") }
    ).catch((err) => console.log(err))
}