import mongoose, { mongo } from "mongoose";
import Url from "../models/url.models.js";
import { User } from "../models/user.models.js"
import { createClient } from "redis"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"

// const client = createClient({
//     url: process.env.REDIS_CONNECTION_URL,
//     retry_strategy: function (options) {
//         if (options.error && options.error.code === 'ECONNREFUSED') {
//             return new Error('The server refused the connection');
//         }
//         if (options.total_retry_time > 1000 * 60 * 60) {
//             return new Error('Retry time exhausted');
//         }
//         if (options.attempt > 10) {
//             return undefined;
//         }
//         return Math.min(options.attempt * 100, 3000);
//     }
// });

// client.on('error', function (err) {
//     console.log('Redis error: ', err);
// });

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
    const createdUrl = await Url.create({ aliase: aliase, redirectUrl: longUrl, clicked: 0, userId: userId, shortUrl: `http://localhost:8080/${aliase}` })
    // await client.rpush(`user:${userId}:urls`, JSON.stringify(createdUrl))
    // await client.set(`url:${aliase}`, createdUrl.redirectUrl)
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
        // return res.status(400).json({
        //     status: "failure",
        //     data: {
        //         statusCode: 400,
        //         message: "Please provide a url"
        //     }
        // })
        throw new ApiError(400, "Please provide a url", [])
    }

    const foundUrl = await Url.findOne({ aliase: id })
    if (!foundUrl) {
        // return res.status(404).json({
        //     status: "failure",
        //     data: {
        //         statusCode: 404,
        //         message: "Url does not exist"
        //     }
        // })
        throw new ApiError(404, "Url does not exist", [])
    }

    const updatedDoc = await Url.findOneAndUpdate(
        { aliase: id },
        { $inc: { clicked: 1 } },
        { new: true } // This option returns the modified document
    );
    // let listLength = await client.llen(`user:${foundUrl.userId}:urls`)
    // let cacheLists = await client.lrange(`user:${foundUrl.userId}:urls`, 0, listLength)
    // console.log(typeof JSON.parse(cacheLists[0])._id, typeof id)
    // console.log(JSON.parse(cacheLists[0])._id, foundUrl._id)
    // let index = cacheLists.findIndex(el => JSON.parse(el)._id == foundUrl._id)
    // await client.lset(`user:${foundUrl.userId}:urls`, index, JSON.stringify(updatedDoc))
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
    console.log("user urls")
    if (!userId) {
        // return res.status(400).json({
        //     status: "failure",
        //     data: {
        //         statusCode: 400,
        //         message: "Please provide a userId"
        //     }
        // })
        throw new ApiError(400, "Please provide a userId", [])
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Please provide a valid userId", [])
    }


    // const userKey = `user:${userId}:urls`
    // let length = await client.llen(userKey)
    // const urlsFromCache = await client.lrange(userKey, 0, length);
    // if (urlsFromCache.length) {
    //     let parsedList = []
    //     urlsFromCache.forEach((el) => {
    //         parsedList.push(JSON.parse(el))
    //     })
    //     return res.status(200).json({
    //         status: "success",
    //         data: {
    //             statusCode: 200,
    //             value: parsedList
    //         }
    //     })
    // }
    const foundUrls = await Url.find({ userId: userId })
    if (!foundUrls) {
        // return res.status(404).json({
        //     status: "failure",
        //     data: {
        //         statusCode: 404,
        //         message: "No urls found for this user"
        //     }
        // })
        throw new ApiError(404, "No urls found for this user", [])
    }
    // foundUrls.forEach(async (el) => {
    //     await client.rpush(userKey, JSON.stringify(el))
    // })
    // return res.status(200).json({
    //     status: "success",
    //     data: {
    //         statusCode: 200,
    //         value: foundUrls
    //     }
    // })
    return res.status(200).json(new ApiResponse(
        200,
        {
            value: foundUrls
        },
        ""
    ))
})