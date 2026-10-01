import { Router } from "express"
import { getMe, login, logout } from "../controllers/auth.controller.js"

const router: Router = Router()

router.post("/login", login)
router.post("/logout", logout)
router.get("/me", getMe)

export { router as authRoutes }