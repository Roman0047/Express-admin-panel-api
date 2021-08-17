let express = require('express');
let router = express.Router();
let controller = require('../controllers/auth')

router.post('/login', controller.validate('login'), controller.login)
router.post('/signup', controller.validate('signup'), controller.signup)

module.exports = router;