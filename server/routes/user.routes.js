import { userLoginValidator, userRegisterValidator } from "../validators/user.validator.js"
import { createUser, handleSocialLogin, handleSuccessSocialLogin, logOutUser, loginUser } from "../controllers/user.controllers.js"
import { validation } from "../middleware/validate.middleware.js"
import express from "express"
import passport from "passport"
import "../passport/index.js"

const router = express.Router()


router.route("/createAccount").post(userRegisterValidator(), validation, createUser)

router.route("/login").post(userLoginValidator(), validation, loginUser)

// passport routes

// scope: profile and email indicates the details which we want from the google's account
router.route("/google").get(passport.authenticate("google", { scope: ["profile", "email"] }), (req, res) => {
    res.send("redirecting to google.com...")
})

router.route("/google/callback").get(passport.authenticate("google"), handleSocialLogin)
router.route("/user-details").get(handleSuccessSocialLogin)
router.route("/logout").get(logOutUser)

export default router