import { User } from "../models/user.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


export const createUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body
    const userExists = await User.findOne({ $or: [{ email: email }, { username: username }] })
    if (userExists) {
        throw new ApiError(409, "User with this email or username already exists", [])
    }
    const user = await User.create({ username, email, password })
    const userCreated = await User.findOne({ _id: user._id }).select("-password")
    if (!userCreated) {
        throw new ApiError(500, "Something went wrong while registering the user", [])
    }
    return res.status(201).json(new ApiResponse(
        201,
        {
            data: userCreated
        },
        "User created successfully"
    ))
})

export const loginUser = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(401).json({
                status: "failure",
                data: {
                    statusCode: 401,
                    message: "Enter correct credentials"
                }
            })
        }
        const isPasswordCorrect = await user.isPasswordCorrect(password)
        if (!isPasswordCorrect) {
            return res.status(401).json({
                status: "failure",
                data: {
                    statusCode: 401,
                    message: "Enter correct credentials"
                }
            })
        }
        const loggedInUser = await User.findOne({ _id: user._id }).select("-password")
        return res.status(200).json({
            status: "success",
            data: {
                statusCode: 200,
                data: loggedInUser
            }

        })
    } catch (error) {
        return res.status(500).json({
            status: "failure",
            data: {
                statusCode: 500,
                message: error.message || "Internal server error"
            }
        })
    }
}
