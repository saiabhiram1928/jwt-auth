const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email :{
        type : String,
        required : true
    },
    passwd :{
        type : String,
        required : true
    },
    salt :String 
})

const user = mongoose.model('users' , userSchema , 'Users')
module.exports = user