import mongoose from "mongoose";
import bcrypt from "bcrypt"
import { AvailableSocialLogins, UserLoginType } from "../constants.js";

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    loginType: {
        type: String,
        enum: AvailableSocialLogins,
        default: UserLoginType.EMAIL_PASSWORD,
    },
}, { timestamps: true, })


UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

UserSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

export const User = mongoose.model("User", UserSchema)
