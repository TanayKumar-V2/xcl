import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    clerkID:{
        type:String,
        required:true,
        unique:true
    },

    email:{
        type:String,
        required:true,
        unique:true
    },
    
    firstName:{
        type:String,
        required:true
    },

    lastName:{
        type:String,
        required:true
    },

    userName:{
        type:String,
        required:true,
        unique:true
    },

    profilePicture:{
        type:String,
        default:""
    },

    bannerImage:{
        type:String,
        default:""
    },

    bio:{
        type:String,
        default:"",
        maxLengtgh:160
    },

    locations:{
        type:String,
        default:""
    },

    followers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],

    following:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ]
},{timestamps:true})

const User=mongoose.model("User", userSchema)

export default User
