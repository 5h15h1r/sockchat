const {registerUser, loginUser, allUsers} = require('../controllers/userControllers')
const express = require('express')
const { protect } = require('../middleware/authMiddleware')
const router = express.Router()

router.route('/').post(registerUser).get(protect, allUsers)
router.route('/login').post(loginUser)

module.exports = router