import User from "../models/user.models.js"


export const createUser = async (req, res) => {
    const { username, email, password } = req.body
    try {
        const userExists = await User.findOne({ $or: [{ email: email }, { username: username }] })
        if (userExists) {
            return res.status(409).json({
                status: "failure",
                data: {
                    statusCode: 409,
                    message: "User with this email or username already exists"
                }
            })
        }
        const user = await User.create({ username, email, password })
        return res.status(201).json({
            status: "success",
            data: {
                statusCode: 201,
                data: user
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
