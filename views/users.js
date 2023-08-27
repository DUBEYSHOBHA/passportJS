var mongoose = require("mongoose");
mongoose.set('strictQuery', false);
var plm = require('passport-local-mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/poke");

var userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    photo: String
})

userSchema.plugin(plm);

module.exports = mongoose.model("user", userSchema);