let express = require('express');
let router = express.Router();
let controller = require('../controllers/history')

router.get('/', controller.list)

module.exports = router;