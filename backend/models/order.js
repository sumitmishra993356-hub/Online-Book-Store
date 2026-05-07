const mongoose = require("mongoose");

const order = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "user",
    },
    book:
    {
        type: mongoose.Types.ObjectId,
        ref: "books",
    },
    status: {
        type: String,
        default: "order placed",
        enum: ["order placed", "out for delivery", "Delivered", "cancelled"]
    },
    // returnRequested: {
    //     type: Boolean, default: false
    // },
    // returnApproved: {
    //     type: String,
    //     enum: ["none", "requested", "approved", "rejected"],
    //     default: "none"
    // },
    returnStatus: {
        type: String,
        enum: ["requested", "approved", "rejected", "none"],
        default: "none"
    },
    returnedAt: { type: Date }
},
    {
        timestamps: true
    }
);
module.exports = mongoose.model("Order", order);