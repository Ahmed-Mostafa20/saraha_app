import dotenv from 'dotenv'

dotenv.config({ path: './config/.env' })

const mongoURL = process.env.DB_URL
const mood = process.env.MOOD
const port = process.env.PORT
const salt = process.env.SALT
export  { mongoURL, mood, port, salt }
