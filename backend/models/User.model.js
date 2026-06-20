const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },

    phone:{
        type:String,
        required:true,
        unique:true
    },

    village:{
        type:String,
        required:true
    },

    role:{
        type:String,
        enum:["community","officer"],
        default:"community"
    },

    password:{
        type:String,
        required:true
    }
});

const User=mongoose.model("User",userSchema);
module.exports=User;