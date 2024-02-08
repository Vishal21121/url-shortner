import { validationResult } from "express-validator"

export const validation = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    const errorsExtracted = []
    errors.array().map((err) => errorsExtracted.push({ [err.path]: err.msg }))
    return res.status(422).json({
        status: "failure",
        data: {
            statusCode: 422,
            value: errorsExtracted
        }
    })
}