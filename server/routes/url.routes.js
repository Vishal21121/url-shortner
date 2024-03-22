import expres from "express"
import { createNewShortUrl, findLongUrl, findUrlClickedCount, findUserUrls } from "../controllers/urls.controllers.js"
import { urlCreateValidator } from "../validators/url.validator.js"
import { validation } from "../middleware/validate.middleware.js"

const router = expres.Router()

router.route("/create").post(urlCreateValidator(), validation, createNewShortUrl)
router.route("/analytics/:id").get(findUrlClickedCount)
router.route("/myurls/:userId").get(findUserUrls)



export default router