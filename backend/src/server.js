import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { ENV } from './config/env.js'
import userRoutes from './routes/user.routes.js'
import postRoutes from './routes/post.routes.js'
import { connectDb } from './config/db.js'
import {clerkMiddleware} from '@clerk/express'
dotenv.config()

const app=express()

app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())

app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)

app.use((err,req,res)=>{
    console.error("Unhandled error:",err)
    res.status(500).json({message:err.message || "Internal Server Error"})
})

connectDb()


app.listen(ENV.PORT,()=>{
    console.log(`Listening at port: ${ENV.PORT}`)
})