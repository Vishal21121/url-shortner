import expres from "express"
import { createNewShortUrl, deleteUrl, findLongUrl, findUrlClickedCount, findUserUrls } from "../controllers/urls.controllers.js"
import { urlCreateValidator } from "../validators/url.validator.js"
import { validation } from "../middleware/validate.middleware.js"

const router = expres.Router()

router.route("/create").post(urlCreateValidator(), validation, createNewShortUrl)
router.route("/analytics/:id").get(findUrlClickedCount)
router.route("/myurls/:userId").get(findUserUrls)
router.route("/delete").delete(deleteUrl)



export default router