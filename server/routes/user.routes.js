import { userLoginValidator, userRegisterValidator } from "../validators/user.validator.js"
import { createUser, handleSocialLogin, handleSuccessSocialLogin, logOutUser, loginUser } from "../controllers/user.controllers.js"
import { validation } from "../middleware/validate.middleware.js"
import express from "express"
import passport from "passport"
import "../passport/index.js"

const router = express.Router()


router.route("/createAccount").post(userRegisterValidator(), validation, createUser)

router.route("/login").post(userLoginValidator(), validation, loginUser)
router.route("/logout").get(logOutUser)

// passport routes

// scope: profile and email indicates the details which we want from the google's account
router.route("/google").get(passport.authenticate("google", { scope: ["profile", "email"] }), (req, res) => {
    res.send("redirecting to google.com...")
})
router.route("/google/callback").get(passport.authenticate("google"), handleSocialLogin)


router.route("/github").get(passport.authenticate("github", { scope: ["user:email"] }), (req, res) => {
    res.send("redirecting to github.com...")
})
router
    .route("/github/callback")
    .get(passport.authenticate("github"), handleSocialLogin);


router.route("/user-details").get(handleSuccessSocialLogin)
export default router