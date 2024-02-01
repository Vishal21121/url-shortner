import Url from "../models/url.models.js";

export const createNewShortUrl = async (req, res) => {
    const { longUrl, aliase } = req.body
    if (!longUrl) {
        return res.status(400).json({
            status: "failure",
            data: {
                statusCode: 400,
                message: "Please provide a url"
            }
        })
    }
    if (!aliase) {
        return res.status(400).json({
            status: "failure",
            data: {
                statusCode: 400,
                message: "Please provide an aliase"
            }
        })
    }
    if (aliase.length < 8 || aliase.length > 13) {
        return res.status(400).json({
            status: "failure",
            data: {
                statusCode: 400,
                message: "Please provide aliase within 8 to 13 characters"
            }
        })
    }
    try {
        const foundAliase = await Url.findOne({ shortUrl: aliase })
        if (foundAliase) {
            return res.status(400).json({
                status: "failure",
                data: {
                    statusCode: 400,
                    message: "This aliase already exists"
                }
            })
        }
        const createdUrl = await Url.create({ shortUrl: aliase, redirectUrl: longUrl, clicked: 0 })
        return res.status(201).json({
            status: "success",
            data: {
                statusCode: 201,
                value: `http://localhost:8080/api/v1/${createdUrl.shortUrl}`
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
        const foundUrl = await Url.findOne({ shortUrl: id })
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
            { shortUrl: id },
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
        const foundCount = await Url.findOne({ shortUrl: id })
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