import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { deleteNotifications, getNotifications } from "../controllers/notification.controller.js";

const router=Router()

router.get('/',protectRoute,getNotifications)
router.delete('/:notificationId',protectRoute,deleteNotifications)

export default router