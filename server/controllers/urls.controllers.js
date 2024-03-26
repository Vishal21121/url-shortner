import mongoose, { mongo } from "mongoose";
import Url from "../models/url.models.js";
import { User } from "../models/user.models.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import { connectToRedis } from "../db/dbConfig.js";
import dotenv from "dotenv"
dotenv.config()

const client = connectToRedis()

export const createNewShortUrl = asyncHandler(async (req, res) => {
    const { longUrl, aliase, userId } = req.body
    const userFound = await User.findOne({ _id: userId })
    if (!userFound) {
        throw new ApiError(400, "No user exists with this userId", [])
    }
    const foundAliase = await Url.findOne({ aliase: aliase })
    if (foundAliase) {
        throw new ApiError(400, "This aliase already exists", [])
    }
    const createdUrl = await Url.create({ aliase: aliase, redirectUrl: longUrl, clicked: 0, userId: userId, shortUrl: `${process.env.SERVER_URI}/${aliase}` })
    await client.set(`url:${aliase}`, createdUrl.redirectUrl)
    return res.status(201).json(new ApiResponse(
        201,
        {
            value: createdUrl
        },
        "Url created successfully"
    ))
})

export const findLongUrl = asyncHandler(async (req, res) => {
    const { id } = req.params
    if (!id) {
        throw new ApiError(400, "Please provide a url", [])
    }
    const urlFromRedis = await client.get(`url:${id}`)
    await Url.findOneAndUpdate(
        { aliase: id },
        { $inc: { clicked: 1 } },
        { new: true } // This option returns the modified document
    );
    if (urlFromRedis) {
        return res.status(301).redirect(urlFromRedis)
    }
    const foundUrl = await Url.findOne({ aliase: id })
    if (!foundUrl) {
        throw new ApiError(404, "Url does not exist", [])
    }
    await client.set(`url:${id}`, foundUrl.redirectUrl)
    res.status(301).redirect(foundUrl.redirectUrl)
})

export const findUrlClickedCount = async (req, res) => {
    const { id } = req.params
    if (!id) {
        return res.status(400).json({
            status: "failure",
            data: {
                statusCode: 400,
                message: "Please provide a url"
            }
        })
    }
    try {
        const foundCount = await Url.findOne({ aliase: id })
        if (!foundCount) {
            return res.status(404).json({
                status: "failure",
                data: {
                    statusCode: 404,
                    value: null
                }
            })
        }
        return res.status(200).json({
            status: "success",
            data: {
                statusCode: 200,
                value: foundCount.clicked
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

export const findUserUrls = asyncHandler(async (req, res) => {

    const { userId } = req.params
    if (!userId) {
        throw new ApiError(400, "Please provide a userId", [])
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Please provide a valid userId", [])
    }


    const foundUrls = await Url.find({ userId: userId })
    if (!foundUrls) {
        throw new ApiError(404, "No urls found for this user", [])
    }
    return res.status(200).json(new ApiResponse(
        200,
        {
            value: foundUrls
        },
        ""
    ))
})

export const deleteUrl = asyncHandler(async (req, res) => {
    const { urlId } = req.body
    if (!urlId) {
        throw new ApiError(400, "Please provide urlId", [])
    }
    if (!mongoose.Types.ObjectId.isValid(urlId)) {
        throw new ApiError(400, "Please provide correct urlId", [])
    }
    const deleteUrl = await Url.findOneAndDelete({ _id: urlId })
    if (!deleteUrl) {
        throw new ApiError(404, "Url not found", [])
    }
    return res.status(200).json(new ApiResponse(
        200,
        {
            deleteUrl
        },
        "Url deleted successfully"
    ))
})