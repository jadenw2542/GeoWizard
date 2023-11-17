/**
 * Router for handling users
 * @author Kahui Wong
 */
const express = require("express")
const router = express.Router()
const { registerUser, loginUser, getUser, googleLoginUser } = require("../controllers/user_controllers")
const { verifyToken } = require("../jwt_middleware")
router.post("/register", registerUser)
router.post("/google/login", googleLoginUser)
router.post("/login", loginUser)
router.get("/me", verifyToken, getUser)
module.exports = router