import { nanoid } from "nanoid";
import Url from "../models/url.models.js";

export const createNewShortUrl = async (req, res) => {
    const { longUrl } = req.body
    const shortUrl = nanoid(8)
    if (!longUrl) {
        return res.status(400).json({
            status: "failure",
            data: {
                statusCode: 400,
                message: "Please provide a url"
            }
        })
    }
    try {
        const foundLongUrl = await Url.findOne({ redirectUrl: longUrl })
        if (foundLongUrl) {
            return res.status(400).json({
                status: "failure",
                data: {
                    statusCode: 400,
                    message: "short url already exists for this url "
                }
            })
        }
        const createdUrl = await Url.create({ shortUrl, redirectUrl: longUrl, clicked: 0 })
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