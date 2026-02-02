import mongoose from 'mongoose'
import { ENV } from './env.js'

export const connectDb=async()=>{
    try {
        await mongoose.connect(ENV.MONGO_URI)
        console.log("Connected to Database succesfully")
    } catch (error) {
        console.error("Error connecting DB", error)
        process.exit(1)
    }
}