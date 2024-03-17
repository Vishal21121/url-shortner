import mongoose from "mongoose";

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

export default connectToDB