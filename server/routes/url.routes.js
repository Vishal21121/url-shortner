import expres from "express"
import { createNewShortUrl } from "../controllers/urls.controllers.js"
const router = expres.Router()

router.route("/url-create").post(createNewShortUrl)

export default router