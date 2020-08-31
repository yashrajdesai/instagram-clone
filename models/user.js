const mongoose =require('mongoose');
const {ObjectId}= mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    profilePic:{type:String,
    default:"https://research.kent.ac.uk/acbm/wp-content/plugins/wp-person-cpt/images/featured-default.png"},
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}],
    googleId:{type:String}
});

mongoose.model("User",userSchema);