import asyncHandler from 'express-async-handler'
import Comment from '../models/comment.model.js'
import { getAuth } from '@clerk/express'
import User from '../models/user.model.js'
import Post from '../models/post.model.js'
import Notification from '../models/notification.model.js'

export const getComments=asyncHandler(async(req,res)=>{
    // FIX 1: Change postid to postId to match your route parameter
    const{postId}=req.params

    const comments=await Comment.find({post:postId}) // Updated to postId
    .sort({createdAt:-1})
    // FIX 2: Change username to userName to match the User model schema
    .populate("user","userName firstName lastName profilePicture")

    res.status(200).json({comments})
})

export const createComment=asyncHandler(async(req,res)=>{
    const{userId}=getAuth(req)
    const{postId}=req.params
    const{content}=req.body

    if(!content || content.trim()===""){
        // FIX 3: Added 'return' to stop execution if there's no content
        return res.status(400).json({message:"Comment content is required"})
    }
    
    // FIX 4: Change clerkId to clerkID (Capital D)
    const user=await User.findOne({clerkID:userId})
    const post=await Post.findById(postId)

    if(!user || !post){
        return res.status(404).json({error:"Post or user not found"})
    }

    const comment=await Comment.create({
        user:user._id,
        post:postId,
        content
    })

    await Post.findByIdAndUpdate(postId,{
        $push:{comments:comment._id}
    })

    if(post.user.toString()!==user._id.toString()){
        await Notification.create({
            from:user._id,
            to:post.user,
            type:"comment",
            post:postId,
            comment:comment._id
        })
    }

    res.status(201).json({comment})
})

export const deleteComment=asyncHandler(async(req,res)=>{
    const{userId}=getAuth(req)
    const{commentId}=req.params

    // FIX 5: Change clerkId to clerkID (Capital D)
    const user=await User.findOne({clerkID:userId})
    const comment=await Comment.findById(commentId)

    if(!user || !comment){
        return res.status(404).json({error:"User or comment not found"})
    }
    if(comment.user.toString()!==user._id.toString()){
        return res.status(403).json({error:"You can only delete your own comment"})
    }
    await Post.findByIdAndUpdate(comment.post,{
        $pull:{comments:commentId},
    })
    await Comment.findByIdAndDelete(commentId)

    res.status(200).json({message:"Deleted successfully"})
})