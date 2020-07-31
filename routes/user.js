const express = require('express');
const router = express.Router();
const mongoose= require('mongoose');
const requireLogin = require('../middleware/requireLogin');
const Post = mongoose.model('Post');
const User =mongoose.model('User');

router.get('/user/:id',requireLogin,(req,res)=>{
    User.findOne({_id:req.params.id})
    .select("-password")               //Doesn't posts password field to frontend.
    .then(user=>{
        Post.find({postedBy:req.params.id})
        .populate("postedBy","_id name")
        .exec((err,posts)=>{
            if(err) {
                return res.status(422).json({error:err})
            }
            res.json({user,posts})          //sends user and his posts to frontend.
        })
    })
    .catch(err=>{
        res.status(422).json({error:err})
    })
})

router.put('/follow',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.userid,{
        $push:{followers:req.user._id},
    },
    {
        new:true
    },
    (err,result)=>{
        if(err) {
            res.status(422).json({error:err});
        }
        User.findByIdAndUpdate(req.user._id,{
            $push:{following:req.body.userid}
        },
            {
                new:true
            }
        ).select("-password").then((result)=>{
            res.json(result);
        }).catch(err=>{
            res.status(422).json({error:err});
        })
    })
})

router.put('/unfollow',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.userid,{
        $pull:{followers:req.user._id},
    },
    {
        new:true
    },(err,result)=>{
        if(err) {
          return res.status(422).json({error:err});
        }
        User.findByIdAndUpdate(req.user._id,{
            $pull:{following:req.body.userid}
        },
            {
                new:true
            }
        ).select("-password").then((result)=>{
            console.log(result);
            res.json(result);
        }).catch(err=>{
            res.status(422).json({error:err});
        })
    })
})


router.put("/updatepic",requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{profilePic:req.body.profilePic},{new:true},
        (err,result)=>{
            if(err) {
                return res.status(422).json({error:err});
            }else{
                res.json(result);
            }
        })
})


module.exports = router;