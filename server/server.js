import express from "express"
import urlRouter from "./routes/url.routes.js"
import connectToDB from "./db/dbConfig.js"

const app = express()
const port = 8080

app.use(express.json())

connectToDB()
app.use("/api/v1", urlRouter)

app.listen(port, () => {
    console.log(`Listenin at port ${port}`);
})