const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const UserSchema = new Schema ({
    userId: {type: String, default: ""}
    // timestamps: {type: Date, default: Date.now}
},
{
    timestamps: true
})


module.exports = mongoose.model("UserSchema", UserSchema)


// var ItemSchema = new Schema({
//     name: { type: String, required: true, trim: true }
// },
// {
//     timestamps: true
// });
