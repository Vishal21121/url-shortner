import mongoose from "mongoose";

const UrlSchema = mongoose.Schema({
    aliase: {
        type: String,
        unique: true,
        required: true
    },
    redirectUrl: {
        type: String,
        required: true
    },
    clicked: {
        type: Number,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    shortUrl: {
        type: String,
        required: true
    }
}, { timestamps: true, })

const Url = mongoose.model("Url", UrlSchema)
export default Url