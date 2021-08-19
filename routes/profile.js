let express = require('express');
let router = express.Router();
let controller = require('../controllers/profile')

router.get('/', controller.get)

module.exports = router;