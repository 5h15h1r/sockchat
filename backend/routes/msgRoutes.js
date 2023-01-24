const express = require('express')
const { sendMessage, getAllMessages } = require('../controllers/msgControllers')
const { protect } = require('../middleware/authMiddleware')
const router = express.Router() 

router.route('/').post(protect, sendMessage)
router.route('/:chatid').get(protect, getAllMessages)

module.exports = router