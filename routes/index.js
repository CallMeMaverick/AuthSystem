const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const { ensureAuthenticated } = require("../middleware/auth");

router.post('/signup', userController.signUp);
router.post("/signin", userController.signIn);

// Protected route
router.get('/protected', ensureAuthenticated, userController.protected);

module.exports = router;
