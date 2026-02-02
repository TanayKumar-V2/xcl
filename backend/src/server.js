import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { ENV } from './config/env.js'
import userRoutes from './routes/user.routes.js'
import { connectDb } from './config/db.js'
import {clerkMiddleware} from '@clerk/express'
dotenv.config()

const app=express()

app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())

app.use('/api/users', userRoutes)

connectDb()


app.listen(ENV.PORT,()=>{
    console.log(`Listening at port: ${ENV.PORT}`)
})