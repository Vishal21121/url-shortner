import expres from "express"
import { createNewShortUrl, findLongUrl, findUrlClickedCount } from "../controllers/urls.controllers.js"
import { urlCreateValidator } from "../validators/url.validator.js"
import { validation } from "../middleware/validate.middleware.js"

const router = expres.Router()

router.route("/url-create").post(urlCreateValidator(), validation, createNewShortUrl)
router.route("/:id").get(findLongUrl)
router.route("/url/analytics/:id").get(findUrlClickedCount)



export default router