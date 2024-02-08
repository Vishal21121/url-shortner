import mongoose from "mongoose";

const UrlSchema = mongoose.Schema({
    shortUrl: {
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
    }
}, { timestamps: true, })

const Url = mongoose.model("Url", UrlSchema)
export default Url