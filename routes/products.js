let express = require('express');
let router = express.Router();
let controller = require('../controllers/products')

router.get('/', controller.list)
router.get('/:_id', controller.get)
router.delete('/:_id', controller.remove)
router.post('/', controller.validate('store'), controller.store)

module.exports = router;