import express from 'express'
import { auth, SuccessResponse, validation, multer_local, extensions } from '../../common/index.js'
import { deleteUser, sendOtpToForgetPassword, updatePassword, updateUser, verifyOtpForForgetPassword } from './user.services.js'
import { forgotPasswordValidationSchema, updatePasswordValidationSchema, updateUserValidationSchema } from './user.validation.js'

const router = express.Router()

router.put('/update-user', multer_local({ customPath: 'user/profile_image', allowedExtensions: extensions.image }).single('image'),
    validation(updateUserValidationSchema), auth, async (req, res) => {
        const data = await updateUser(req.userId, req.body, req.file)
        return SuccessResponse({ res, status: 200, message: "user updated", data })
    })

router.delete('/delete-user', auth, async (req, res) => {
    const data = await deleteUser(req.userId)
    return SuccessResponse({ res, status: 200, message: "user deleted", data })
})
router.put('/update-password', multer_local().none(), validation(updatePasswordValidationSchema), auth, async (req, res) => {
    const data = await updatePassword(req.userId, req.body)
    return SuccessResponse({ res, status: 200, message: "password updated", data })
})
router.post('/send-otp-to-forget-password', multer_local().none(), async (req, res) => {
    const data = await sendOtpToForgetPassword(req.body.email)
    return SuccessResponse({ res, status: 200, message: "OTP sent", data })
})
router.put('/verify-otp-for-forget-password', multer_local().none(), validation(forgotPasswordValidationSchema), async (req, res) => {
    const data = await verifyOtpForForgetPassword(req.body)
    return SuccessResponse({ res, status: 200, message: "password updated", data })
})

export { router as UserRouter }