const express = require ("express");
const router = express.Router();
const authController = require ("../controllers/authController");
//MIDDLEWARE import 
const { protect,authorizeAdmin} = require("../middlewares/authMiddleware");


router.post("/register",authController.registerUser);
router.post("/login",authController.loginUser);
router.get("/profile",protect,authController.getUserProfile);
router.get("/admin/users",protect,authorizeAdmin,authController.getAllUsers);


module.exports = router