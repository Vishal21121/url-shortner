import expres from "express"
import { createNewShortUrl, findLongUrl } from "../controllers/urls.controllers.js"
const router = expres.Router()

router.route("/url-create").post(createNewShortUrl)
router.route("/url/:id").get(findLongUrl)

export default router