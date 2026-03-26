import dotenv from 'dotenv'

dotenv.config({ path: './config/.env' })

const mongoURL = process.env.DB_URL
const mood = process.env.MOOD
const port = process.env.PORT
const salt = process.env.SALT
const emailHost = process.env.EMAIL_HOST
const emailPassword = process.env.PASSWORD
const baseURL = process.env.BASE_URL

export  { mongoURL, mood, port, salt, emailHost, emailPassword, baseURL }
