import express from "express"
import urlRouter from "./routes/url.routes.js"
import userRouter from "./routes/user.routes.js"
import connectToDB from "./db/dbConfig.js"
import cors from "cors"

const app = express()

const port = 8080
connectToDB()

app.use(express.json())
app.use(cors())
app.use("/api/v1", urlRouter)
app.use("/api/v1/users", userRouter)

app.listen(port, () => {
    console.log(`Listening at port ${port}`);
})