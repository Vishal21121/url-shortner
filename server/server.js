import express from "express"
import urlRouter from "./routes/url.routes.js"
import userRouter from "./routes/user.routes.js"
import { connectToDB } from "./db/dbConfig.js"
import cors from "cors"
import session from "express-session"
import dotenv from "dotenv"
import { errorHandler } from "./middleware/error.middleware.js"
import passport from "passport"
import cookieParser from "cookie-parser"
import { findLongUrl } from "./controllers/urls.controllers.js"
import { fileURLToPath } from "url"
import path from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()


const app = express()

const port = process.env.PORT || 8080
connectToDB()

app.use(express.json())
app.use(cookieParser())
// app.use(express.static("./dist"))
app.use(cors(
    {
        origin: ['http://localhost:5173'],
        credentials: true,
        optionsSuccessStatus: 200
    }
))
app.use(session({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}))

// passport package 
app.use(passport.session())
app.use(passport.initialize())

app.use("/api/v1/url", urlRouter)
app.use("/api/v1/users", userRouter)
app.use("/:id", findLongUrl)

// providing the static files on routes other than above routes
// app.get("*", (req, res) => {
//     res.status(200).sendFile(path.resolve(__dirname, "./dist/index.html"))
// })
app.use(errorHandler)

app.listen(port, () => {
    console.log(`Listening at port ${port}`);
})
