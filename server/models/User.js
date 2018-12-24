const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    cities : [{type: Schema.Types.ObjectId, ref: 'City'}]
})

const User = mongoose.model("User", userSchema)
module.exports = User