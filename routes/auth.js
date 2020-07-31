const express = require('express');
const router = express.Router();
const mongoose= require('mongoose');
const bcrypt = require('bcryptjs');
const User = mongoose.model("User");
const jwt = require('jsonwebtoken');
const {JWT_SECRET}=require('../config/keys');
const requireLogin = require('../middleware/requireLogin');



router.post('/signup',(req,res)=> {
    const {name,email,password,profilePic} = req.body;
    if(!name || !email ||!password) {
       return  res.status(422).json({error:"Please enter all the fields."});
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser) {
            return  res.status(422).json({error:"User already exists with this username."});
        }
        bcrypt.hash(password,12)
        .then(hashedPassword=> {
            const user = new User({
                name,
                email,
                password: hashedPassword,
                profilePic
            })
            user.save()
            .then(user=>{
                res.json({message:"Saved successfully"})
            })
            .catch(err=>{
                console.log(err);
            })
        })
        .catch(err=>{
            console.log(err);
        })
    })
    .catch(err=>{
        console.log(err); 
    }) 
})

router.post('/login',(req,res) => {
    const {email,password} = req.body;
    if(!email || !password) {
       return res.status(422).json({error:"Please enter all the required fields."});
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser) {
            return res.status(422).json({error:"Wrong email/password entered"});
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if (doMatch) {
                const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
               const {_id,name,email,following,followers,profilePic} = savedUser
                res.json({token,user:{_id,name,email,following,followers,profilePic}});
                
            }else{
                res.status(422).json({error:"Wrong email/password entered"});
            }
        })
        .catch(err=>{
        console.log(err);
        });
    })
    .catch(err=>{
        console.log(err);
        });
 })

module.exports = router;