import { userRegisterValidator } from "../validators/user.validator.js"
import { createUser } from "../controllers/user.controllers.js"
import { validation } from "../middleware/validate.middleware.js"
import express from "express"

const router = express.Router()


router.route("/createAccount").post(userRegisterValidator(), validation, createUser)

export default router