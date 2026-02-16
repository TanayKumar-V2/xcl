import asyncHandler from 'express-async-handler'
import User from '../models/user.model.js'
import { clerkClient, getAuth } from '@clerk/express'
import Notification from '../models/notification.model.js'

export const getUserProfile=asyncHandler(async(req, res)=>{
    const {username}=req.params
    const user=await User.findOne({userName: username}) // Fixed: userName
    if(!user){
        return res.status(404).json({ // Standardized to 404 for not found
            error:"user not found"
        })
    }
    return res.status(200).json({user})
})

export const updateProfile=asyncHandler(async(req, res)=>{
    const{userId}=getAuth(req)

    // Fixed: clerkID
    const user=await User.findOneAndUpdate({clerkID:userId},req.body,{new:true})

    if(!user){
        return res.status(404).json({error:"User not found"})
    }

    return res.status(200).json({user})
})

export const syncUser=asyncHandler(async(req,res)=>{
    const {userId}=getAuth(req)

    // Fixed: clerkID
    const existingUser=await User.findOne({clerkID:userId})
    if(existingUser){
        return res.status(200).json({error:"User already exists"})
    }
    
    const clerkUser=await clerkClient.users.getUser(userId)

    const userData={
        clerkID:userId, // Fixed: clerkID
        email:clerkUser.emailAddresses[0].emailAddress,
        firstName:clerkUser.firstName || "",
        lastName:clerkUser.lastName || "",
        // Fixed: userName and removed the erroneous [0] that was breaking the split
        userName: clerkUser.username || clerkUser.emailAddresses[0].emailAddress.split("@")[0], 
        profilePicture:clerkUser.imageUrl || ""
    }

    const user=await User.create(userData)

    return res.status(201).json({ user })
})

export const getCurrentUser=asyncHandler(async(req,res)=>{
    const{userId}=getAuth(req)
    // Fixed: clerkID
    const user=await User.findOne({clerkID:userId})

    if(!user){
        return res.status(404).json({error:"user not found"})
    }

    return res.status(200).json({user})
})

export const followUser=asyncHandler(async(req,res)=>{
    const {userId}=getAuth(req)
    const{targetUserId}=req.params

    if(userId===targetUserId){
        return res.status(400).json({error:"Cannot follow yourself"})
    }

    // Fixed: clerkID
    const currentUser=await User.findOne({clerkID:userId})
    // Fixed: changed findOne to findById so Mongoose knows what to search for
    const targetUser=await User.findById(targetUserId)

    if(!currentUser || !targetUser){
        return res.status(404).json({
            error:"User not found"
        })
    }

    const isFollowing=currentUser.following.includes(targetUserId)

    if(isFollowing){
        await User.findByIdAndUpdate(currentUser._id,{
            $pull:{following:targetUserId},
        })
        await User.findByIdAndUpdate(targetUserId,{ // Fixed target update
            $pull:{followers:currentUser._id}
        })
    }else{
        await User.findByIdAndUpdate(currentUser._id,{
            $push:{following:targetUserId}
        })
        await User.findByIdAndUpdate(targetUserId,{
            $push:{followers:currentUser._id}
        })

        await Notification.create({
            from:currentUser._id,
            to:targetUser._id,
            type:"follow"
        })
    }

    res.status(200).json({message:isFollowing?"User unfollowed successfully":"User followed successfully"})
})