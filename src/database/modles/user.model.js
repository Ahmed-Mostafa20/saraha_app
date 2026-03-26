import mongoose from 'mongoose'
import { genderEnums, providerEnums, roleEnums } from '../../common/index.js'

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 20

    },
    lastName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 20
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    phone: String,
    DOB: Date,
    gender: {
        type: String,
        enum: Object.values(genderEnums),
        default: genderEnums.MALE
    },
    provider: {
        type: String,
        enum: Object.values(providerEnums),
        default: providerEnums.SYSTEM
    },
    role: {
        type: String,
        enum: Object.values(roleEnums),
        default: roleEnums.USER
    },
    viewCount: {
        type: Number,
        default: 0
    },
    profileImage: {
        type: String,
        default: ""
    },
    loginCount: {
        type: Number,
        default: 0
    },
    lockUntil: {
        type: Date,
    },
    twoStepEnabled: {
        type: Boolean,
        default: false
    },
    otpCode: {
        type: String
    },
    otpExpires: {
        type: Date
    },
    emailOtpCode: {
        type: String
    },
    emailOtpExpires: {
        type: Date
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    deleteAfter: {
        type: Date,
        default: () => Date.now() + 24 * 60 * 60 * 1000,
        index: { expires: 0 }
    },
    sharedName:{
        type: String,
        unique: true,
    }

},
    {
        timestamps: true
    })

userSchema.virtual('userName').set(function (value) {
    let [firstName, lastName] = value.split(' ')
    this.firstName = firstName
    this.lastName = lastName
}).get(function () {
    return `${this.firstName} ${this.lastName}`
})

export const userModel = mongoose.model('User', userSchema)