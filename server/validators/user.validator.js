import { body } from 'express-validator';

export const userRegisterValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Please enter a valid email address"),
        body("username")
            .trim()
            .notEmpty()
            .withMessage("Please enter a username")
            .isLowercase()
            .withMessage("Username must be lowercase")
            .isLength({ min: 3 })
            .withMessage("Username must be at least 3 characters long"),
        body("password")
            .trim()
            .notEmpty()
            .withMessage("Please enter your password")
            .isLength({ min: 8 })
            .withMessage("Password must be at least 8 characters long"),
    ]
}

export const userLoginValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Please enter a valid email address"),
        body("password")
            .trim()
            .notEmpty()
            .withMessage("Please enter your password")
    ]
}

