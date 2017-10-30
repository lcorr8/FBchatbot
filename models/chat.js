const mongoose = require("mongoose")
const Schema = mongoose.Schema

mongoose.Promise = global.Promise

const ChatSchema = new Schema ({
    userId: {type: String, default: ""},
    // power: {type: Boolean, default: false},
    // gas: {type: Boolean, default: false},
    // plz: {type: String, default: ""},
    // persons: {type: Number, default: ""},
    tariff: {
        source: String,
        zipCode: Number,
        size: String,
        consumption: Number
    },
    answers: []
},
{
    timestamps: true
})


// ChatSchema.methods.summary = function() {
//
//     const summary = {
//         chatId: this._id.toString(),
//         userId: this.userId,
//     }
//     return summary
// }


module.exports = mongoose.model("ChatSchema", ChatSchema)

// profile: {type: mongoose.Schema.Types.Mixed, default: {}},
