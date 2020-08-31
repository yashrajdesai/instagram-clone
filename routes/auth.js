const express = require('express');
const router = express.Router();
const mongoose= require('mongoose');
const bcrypt = require('bcryptjs');
const User = mongoose.model("User");
const jwt = require('jsonwebtoken');
const {JWT_SECRET,GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET}=require('../config/keys');
const requireLogin = require('../middleware/requireLogin');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;



passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/profile"
  },
  function(accessToken, refreshToken, profile, done) {
    //check user table for anyone with a google ID of profile.id
    console.log(profile);
    User.findOne({
        "googleId": profile.id 
    }, function(err, user) {
        if (err) {
            return done(err);
        }
        //No user was found... so create a new user with values from Facebook (all the profile. stuff)
        if (!user) {
            user = new User({
                name: profile.displayName,
                email: profile.emails[0].value,
                username: profile.username,
                provider: 'google',
                //now in the future searching on User.findOne({'google.id': profile.id } will match because of this next line
                google: profile._json
            });
            user.save(function(err) {
                if (err) console.log(err);
                else {
                    const token = jwt.sign({_id:googleId},JWT_SECRET)
                    const {_id,name,email,following,followers,profilePic} = user
                     res.json({token,user:{_id,name,email,following,followers,profilePic}});
                 }
                return done(err, user);
            });
        }
        //  else {
        //     const token = jwt.sign({_id:googleId},JWT_SECRET)
        //     const {_id,name,email,following,followers,profilePic} = user
        //      res.json({token,user:{_id,name,email,following,followers,profilePic}});
        //     return done(err, user);
        // }
    });
    }
));

const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:"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"
    }
}))

router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile','email'] }));

router.get('/auth/google/profile', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
      
    res.redirect('/profile');
  });

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
                transporter.sendMail({
                    to:user.email,
                    from:"no-reply@instagram.com",
                    subject:"Signup success !",
                    html:"<h1>Welcome to instagram !</h1>"
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