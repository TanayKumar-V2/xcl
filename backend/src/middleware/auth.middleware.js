export const protectRoute=async(req, res, next)=>{
    if(!req.auth().isAuthenticated){
        return res.status(401).json({message:"Unauthorised-must be logged in"})
    }
    next()
}