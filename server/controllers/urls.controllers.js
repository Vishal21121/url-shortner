import mongoose from "mongoose";
import Url from "../models/url.models.js";
import { User } from "../models/user.models.js"

export const createNewShortUrl = async (req, res) => {
    const { longUrl, aliase, userId } = req.body
    try {
        const userFound = await User.findOne({ _id: userId })
        if (!userFound) {
            return res.status(400).json({
                status: "failure",
                data: {
                    statusCode: 400,
                    message: "No user exists with this userId"
                }
            })
        }
        const foundAliase = await Url.findOne({ aliase: aliase })
        if (foundAliase) {
            return res.status(400).json({
                status: "failure",
                data: {
                    statusCode: 400,
                    message: "This aliase already exists"
                }
            })
        }
        const createdUrl = await Url.create({ aliase: aliase, redirectUrl: longUrl, clicked: 0, userId: userId, shortUrl: `http://localhost:8080/api/v1/${aliase}` })
        return res.status(201).json({
            status: "success",
            data: {
                statusCode: 201,
                value: createdUrl
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
        await Url.findOneAndUpdate(
            { aliase: id },
            { $inc: { clicked: 1 } },
            { new: true } // This option returns the modified document
        );
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