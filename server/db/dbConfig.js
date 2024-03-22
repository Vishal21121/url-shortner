import mongoose from "mongoose";
import redis from "ioredis"
import dotenv from "dotenv"

dotenv.config()


const connectToDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI
        const connection = await mongoose.connect(mongoUri)
        console.log("MongoDb connected to the database: ", connection.connection.host);
    } catch (error) {
        console.log("Error connecting to MongoDB: ", error.message);
        process.exit(1);
    }
}

const connectToRedis = () => {
    try {
        const client = new redis({
            password: process.env.REDIS_DB_PASSWORD,
            host: process.env.REDIS_DB_HOST,
            port: process.env.REDIS_DB_PORT

        })
        return client
    } catch (error) {
        console.log("Error while connecting to redis: ", error.message)
        process.exit(1)
    }
}

export { connectToDB, connectToRedis }