import express from 'express'
import { databaseConnection } from './database/index.js'
import { port } from '../config/index.js'
import { globalErrorHandler } from './responce/index.js'
import {MessageRouter, UserRouter} from './modules/index.js'
const bootstrap = async () => {
    const app = express()
    app.use(express.json())
    await databaseConnection()
    app.use("/uploads", express.static('uploads'))
    app.use('/user',UserRouter)
    app.use('/message',MessageRouter)
    app.use(globalErrorHandler)
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    })
}
export default bootstrap