import asyncHandler from 'express-async-handler'
import Post from '../models/post.model.js'
import User from '../models/user.model.js'
import { getAuth } from '@clerk/express'
import cloudinary from '../config/cloudinary.js'
import Notification from '../models/notification.model.js'
import Comment from '../models/comment.model.js'

export const getPosts=asyncHandler(async(req,res)=>{
    const posts=await Post.find()
    .sort({createdAt:-1})
    // Fixed: populated fields now use 'userName' to match the schema
    .populate("user","userName firstName lastName profilePicture")
    .populate({
        path:"comments",
        populate:{
            path:"user",
            select:"userName firstName lastName profilePicture"
        }
    })

    res.status(200).json({posts})
})

export const getPost=asyncHandler(async(req,res)=>{
    const {postId}=req.params

    const post=await Post.findById(postId)
    // Fixed: populated fields now use 'userName'
    .populate("user","userName firstName lastName profilePicture")
    .populate({
        path:"comments",
        populate:{
            path:"user",
            select:"userName firstName lastName profilePicture"
        }
    })

    if(!post){
        return res.status(404).json({error:"Cannot find post"})
    }
    res.status(200).json({post})
})

export const getUserPosts=asyncHandler(async(req,res)=>{
    const {username}=req.params

    // Fixed: search query to use 'userName'
    const user=await User.findOne({userName: username})

    if(!user){
        return res.status(404).json({message:"User not found"})
    }

    const posts=await Post.find({user:user._id})
    .sort({createdAt:-1})
    // Fixed: populated fields now use 'userName'
    .populate("user","userName firstName lastName profilePicture")
    .populate({
        path:"comments",
        populate:{
            path:"user",
            select:"userName firstName lastName profilePicture"
        }
    })

    res.status(200).json({posts})
})

export const createPost=asyncHandler(async(req,res)=>{
    const{userId}=getAuth(req)
    const{content}=req.body
    const imageFile=req.file

    if(!content && !imageFile){
        return res.status(400).json({message:"Post must contain either content or image"})
    }
    
    // Fixed: clerkId -> clerkID
    const user=await User.findOne({clerkID:userId})
    if(!user){
        return res.status(404).json({message:"User not found"})
    }
    
    let imageUrl=""
    if(imageFile){
        try {
            // Fixed: Added missing colon in base64 string
            const base64Image=`data:${imageFile.mimetype};base64,${imageFile.buffer.toString(
                "base64"
            )}`
            const uploadResponse=await cloudinary.uploader.upload(base64Image,{
                folder:"social_media_posts",
                resource_type:"image",
                transformation:[
                    {width:800,height:600,crop:"limit"},
                    {quality:'auto'},
                    // Fixed: formart -> format
                    {format:"auto"} 
                ]
            })
            imageUrl=uploadResponse.secure_url
        } catch (uploadError) {
            console.error("Cloudinary Upload error", uploadError)
            // Fixed: Added return to prevent continuing to create the post
            return res.status(400).json({message:"Failed to upload image"})
        }
    }
    const post=await Post.create({
        user:user._id,
        content:content || "",
        image:imageUrl
    })

    res.status(201).json({post:post})
})

export const likePost=asyncHandler(async(req,res)=>{
    const {userId}=getAuth(req)
    const{postId}=req.params

    // Fixed: clerkId -> clerkID
    const user=await User.findOne({clerkID:userId})
    // Fixed: findOne -> findById
    const post=await Post.findById(postId)

    if(!user || !post){
        return res.status(404).json({error:"Post or user not found"})
    }
    const isLiked=post.likes.includes(user._id)

    if(isLiked){
        await Post.findByIdAndUpdate(postId,{
            $pull:{likes:user._id}
        })
    }else{
        await Post.findByIdAndUpdate(postId,{
            $push:{likes:user._id}
        })

        if(post.user.toString()!==user._id.toString()){
            await Notification.create({
                from:user._id,
                to:post.user,
                type:"like",
                post:postId
            })
        }
    }

    res.status(201).json({
        message:isLiked?"Post unliked successfully":"Post liked successfully"
    })
})

export const deletePost=asyncHandler(async(req,res)=>{
    const{userId}=getAuth(req)
    const{postId}=req.params

    // Fixed: clerId -> clerkID
    const user=await User.findOne({clerkID:userId})
    // Fixed: findOne -> findById
    const post=await Post.findById(postId)

    if(!user || !post){
        return res.status(404).json({error:"User or post not found"})
    }

    if(post.user.toString()!==user._id.toString()){
        // Fixed: Added return and changed to 403 Forbidden
        return res.status(403).json({error:"You can only delete your posts"})
    }

    await Comment.deleteMany({post:postId})
    await Post.findByIdAndDelete(postId)

    res.status(200).json({message:"Post deleted"})
})