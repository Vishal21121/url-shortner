import { body } from "express-validator";

export const urlCreateValidator = () => {
    return [
        body("longUrl")
            .trim()
            .notEmpty()
            .withMessage("please provide a long Url")
            .isURL()
            .not()
            .withMessage("Please provide a valid url"),
        body("aliase")
            .trim()
            .notEmpty()
            .withMessage("please provide an aliase")
            .isLength({ min: 3, max: 12 })
            .withMessage("aliase must be between 3 to 12 characters long"),
        body("userId")
            .trim()
            .notEmpty()
            .withMessage("please provide an userId")
            .isMongoId()
            .not()
            .withMessage("Please enter a valid userId")
    ]
}