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
            ...userCreated
        },
        "User created successfully"
    ))
})

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email: email })
    if (!user) {
        return res.status(401).json(new ApiResponse(
            401,
            {
                message: "Please enter correct credentials"
            },
            "Please enter correct credentials"
        ))
    }
    const isPasswordCorrect = await user.isPasswordCorrect(password)
    if (!isPasswordCorrect) {
        return res.status(401).json(new ApiResponse(
            401,
            {
                message: "Please enter correct credentials"
            },
            "Please enter correct credentials"
        ))
    }
    const loggedInUser = await User.findOne({ _id: user._id }).select("-password")
    console.log(loggedInUser)
    return res.status(200).json(new ApiResponse(
        200,
        {
            _id: loggedInUser._id,
            email: loggedInUser.email,
            username: loggedInUser.username
        },
        ""
    ))
})

export const handleSocialLogin = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user?._id);
    if (!user) {
        throw new ApiError(404, "User does not exist");
    }
    const data = {
        _id: req.user?._id,
        username: req.user?.username,
        email: req.user?.email,
    }
    const options = {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
    }
    return res.
        status(301)
        .cookie("user", data, options)
        .redirect(
            `${process.env.CLIENT_SSO_REDIRECT_URL}`
        );
});

export const handleSuccessSocialLogin = asyncHandler(async (req, res) => {
    if (req.cookies?.user) {
        return res.status(200).json(new ApiResponse(200, { ...req.cookies?.user }, ""))
    }
    throw new ApiError(401, "Login info not found", [])
})

export const logOutUser = async (req, res) => {
    const options = {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
    }
    res.clearCookie("user", options)
    return res.status(200).json(new ApiResponse(200, {}, "User logout successfully"));
}
