var mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please Enter username"],
        trim: true
    },
    firstname: {
        type: String,
        required: [true, "Please Enter First name"]
    },
    lastname: {
        type: String,
        required: [true, "Please Enter Last Name"]
    },
    password: {
        type: String,
        required: [true, "Please Enter Password"]
    },
    createon: {
        type: Date
    },
})
const User = mongoose.model("User", UserSchema);
module.exports = User;
