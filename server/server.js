import express from "express"
import urlRouter from "./routes/url.routes.js"
import connectToDB from "./db/dbConfig.js"
import cors from "cors"

const app = express()

const port = 8080
connectToDB()

app.use(express.json())
app.use(cors())
app.use("/api/v1", urlRouter)

app.listen(port, () => {
    console.log(`Listenin at port ${port}`);
})