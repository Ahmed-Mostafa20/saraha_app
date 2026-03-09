import express from 'express'
import { databaseConnection } from './database/index.js'
import { port } from '../config/index.js'
import { globalErrorHandler } from './common/index.js'
import { MessageRouter, AuthRouter, UserRouter } from './modules/index.js'
const bootstrap = async () => {
    const app = express()
    app.use(express.json())
    await databaseConnection()
    app.use("/uploads", express.static('uploads'))
    app.use('/auth', AuthRouter)
    app.use('/message', MessageRouter)
    app.use('/user', UserRouter)
    app.use(globalErrorHandler)
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    })
}
export default bootstrap