import express from 'express'

import { signUp, login, getUserById, getNewAccessToken, viewProfile, sendOtpToEnableTwoStep, verifyOtpToEnableTwoStep, verfiyOtp, verifyEmail, resendEmailVerificationOtp } from './auth.services.js'
import { signUpValidationSchema, loginValidationSchema } from './auth.validation.js'
import { SuccessResponse } from '../../common/index.js'
import { auth, validation } from '../../common/index.js'
import { extensions, multer_local } from '../../common/middlewares/multer.js'


const router = express.Router()

router.post('/signup', multer_local({ customPath: 'user/profile_image', allowedExtensions: extensions.image }).single('image'),
    validation(signUpValidationSchema), async (req, res) => {
        const user = await signUp(req.body, req.file)
        return SuccessResponse({ res, status: 201, message: "user added successfully and otp sent to your email", data: user })
    })
router.post('/login', multer_local().none(), validation(loginValidationSchema), async (req, res) => {
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
router.post('/send-otp-to-enable-two-step-verification', auth, async (req, res) => {
    const data = await sendOtpToEnableTwoStep(req.userId)
    return SuccessResponse({ res, status: 200, message: "Two-step verification enabled", data })

})
router.post('/verify-otp-to-enable-two-step-verification', auth, multer_local().none(), async (req, res) => {
    const data = await verifyOtpToEnableTwoStep(req.userId, req.body)
    return SuccessResponse({ res, status: 200, message: "Two-step verification enabled", data })
})
router.post('/verify-otp', multer_local().none(), async (req, res) => {
    const data = await verfiyOtp(req.body.email, req.body.otp, `${req.protocol}://${req.host}`)
    return SuccessResponse({ res, status: 200, message: "OTP verified and user logged in", data })
})

router.put('/verify-email', multer_local().none(),  async (req, res) => {
    const data = await verifyEmail( req.body)
    return SuccessResponse({ res, status: 200, message: "email verified", data })
})
router.post('/resend-email-otp', multer_local().none(), async (req, res) => {
    const data = await resendEmailVerificationOtp(req.body.email)
    return SuccessResponse({ res, status: 200, message: "OTP code resent to email", data })
})

export { router as AuthRouter }