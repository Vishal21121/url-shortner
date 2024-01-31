import mongoose from "mongoose";

const connectToDB = async () => {
    try {
        const connection = await mongoose.connect("mongodb://127.0.0.1:27017/urlshortner")
        console.log("MongoDb connected to the database: ", connection.connection.host);
    } catch (error) {
        console.log("Error connecting to MongoDB: ", error.message);
        process.exit(1);
    }
}

export default connectToDB