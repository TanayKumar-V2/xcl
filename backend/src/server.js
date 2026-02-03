import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { ENV } from './config/env.js'
import userRoutes from './routes/user.routes.js'
import postRoutes from './routes/post.routes.js'
import commentRoutes from './routes/comment.routes.js'
import notificationRoutes from './routes/notification.routes.js'
import { connectDb } from './config/db.js'
import {clerkMiddleware} from '@clerk/express'
import { arcJetMiddleware } from './middleware/arcjet.middleware.js'
dotenv.config()

const app=express()

app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())
app.use(arcJetMiddleware)

app.get("/", (req, res) => res.send("Hello from server"));

app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/comments',commentRoutes)
app.use('/api/notifications',notificationRoutes)

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

const startServer=async()=>{
    try {
        await connectDb()

        if(ENV.NODE_ENV!=="production"){
            app.listen(ENV.PORT,()=>{console.log("Server running on port:"+ENV.PORT)})
        }

    } catch (error) {
        console.error("Failed to start server",error.message)
        process.exit(1)
    }
}

startServer()

export default app