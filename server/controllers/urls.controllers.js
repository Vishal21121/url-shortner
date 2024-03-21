import mongoose from "mongoose";
import Url from "../models/url.models.js";
import { User } from "../models/user.models.js"
import redis from "ioredis"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"

const client = new redis()

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
    const createdUrl = await Url.create({ aliase: aliase, redirectUrl: longUrl, clicked: 0, userId: userId, shortUrl: `localhost:8080/api/v1/${aliase}` })
    await client.rpush(`user:${userId}:urls`, JSON.stringify(createdUrl))
    return res.status(201).json(new ApiResponse(
        201,
        {
            value: createdUrl
        },
        "Url created successfully"
    ))
})

export const findLongUrl = async (req, res) => {
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
        const foundUrl = await Url.findOne({ aliase: id })
        if (!foundUrl) {
            return res.status(404).json({
                status: "failure",
                data: {
                    statusCode: 404,
                    message: "Url does not exist"
                }
            })
        }
        const updatedDoc = await Url.findOneAndUpdate(
            { aliase: id },
            { $inc: { clicked: 1 } },
            { new: true } // This option returns the modified document
        );
        let listLength = await client.llen(`user:${foundUrl.userId}:urls`)
        let cacheLists = await client.lrange(`user:${foundUrl.userId}:urls`, 0, listLength)
        // console.log(typeof JSON.parse(cacheLists[0])._id, typeof id)
        // console.log(JSON.parse(cacheLists[0])._id, foundUrl._id)
        let index = cacheLists.findIndex(el => JSON.parse(el)._id == foundUrl._id)
        await client.lset(`user:${foundUrl.userId}:urls`, index, JSON.stringify(updatedDoc))
        res.redirect(foundUrl.redirectUrl)
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

export const findUserUrls = async (req, res) => {
    const { userId } = req.params
    if (!userId) {
        return res.status(400).json({
            status: "failure",
            data: {
                statusCode: 400,
                message: "Please provide a userId"
            }
        })
    }
    try {
        const userKey = `user:${userId}:urls`
        let length = await client.llen(userKey)
        const urlsFromCache = await client.lrange(userKey, 0, length);
        if (urlsFromCache.length) {
            let parsedList = []
            urlsFromCache.forEach((el) => {
                parsedList.push(JSON.parse(el))
            })
            return res.status(200).json({
                status: "success",
                data: {
                    statusCode: 200,
                    value: parsedList
                }
            })
        }
        const foundUrls = await Url.find({ userId: userId })
        if (!foundUrls) {
            return res.status(404).json({
                status: "failure",
                data: {
                    statusCode: 404,
                    message: "No urls found for this user"
                }
            })
        }
        foundUrls.forEach(async (el) => {
            await client.rpush(userKey, JSON.stringify(el))
        })
        return res.status(200).json({
            status: "success",
            data: {
                statusCode: 200,
                value: foundUrls
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