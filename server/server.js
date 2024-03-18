import express from "express"
import urlRouter from "./routes/url.routes.js"
import userRouter from "./routes/user.routes.js"
import connectToDB from "./db/dbConfig.js"
import cors from "cors"
import session from "express-session"
import dotenv from "dotenv"
import { errorHandler } from "./middleware/error.middleware.js"

dotenv.config()


const app = express()

const port = process.env.PORT || 8080
connectToDB()

app.use(express.json())
app.use(cors())
app.use(session({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}))
app.use("/api/v1", urlRouter)
app.use("/api/v1/users", userRouter)

app.use(errorHandler)

app.listen(port, () => {
    console.log(`Listening at port ${port}`);
})
