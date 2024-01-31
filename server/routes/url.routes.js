import expres from "express"
import { createNewShortUrl, findLongUrl, findUrlClickedCount } from "../controllers/urls.controllers.js"
const router = expres.Router()

router.route("/url-create").post(createNewShortUrl)
router.route("/:id").get(findLongUrl)
router.route("/url/analytics/:id").get(findUrlClickedCount)

export default router