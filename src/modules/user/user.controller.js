import express from 'express'

import { signUp, login, getUserById, getNewAccessToken, viewProfile } from './user.services.js'
import { signUpValidationSchema, loginValidationSchema } from './user.validation.js'
import { SuccessResponse } from '../../responce/index.js'
import { auth, validation } from '../../common/index.js'
import { multer_local } from '../../common/middlewares/multer.js'


const router = express.Router()

router.post('/signup', validation(signUpValidationSchema), multer_local({ customPath: 'user' }).single('image'),async (req, res) => {
    const user = await signUp(req.body,req.file)
    return SuccessResponse({ res, status: 201, message: "user added", data: user })
})
router.post('/login', validation(loginValidationSchema), async (req, res) => {
    const user = await login(req.body, `${req.protocol}://${req.host}`)
    return SuccessResponse({ res, status: 200, message: "user logged in", data: user })
})
router.get('/get-user', auth, async (req, res) => {
    const user = await getUserById(req.userId)
    return SuccessResponse({ res, status: 200, message: "user logged in", data: user })
})
router.get('/get-new-access-token', async (req, res) => {
    const newAccessToken = await getNewAccessToken(req.headers.authorization)
    return SuccessResponse({ res, status: 200, message: "new token", data: newAccessToken })
})
router.get('/viwe-profile/:id', auth, async (req, res) => {
    const user = await viewProfile(req.userId, req.params.id)
    return SuccessResponse({ res, status: 200, message: "view count updated", data: user })
})
export { router as UserRouter }