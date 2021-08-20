const { validationResult, body } = require('express-validator');
const Product = require('../models/product');
const Type = require('../models/type');
const History = require('../models/history');
const fs = require('fs');

module.exports = {
  async list(req, res, next) {
    try {
      let data = await Product.find().sort({ created_at: 'desc' });
      return res.send(data);
    } catch (err) {
      return next(err)
    }
  },

  async get(req, res, next) {
    try {
      let data = await Product.findOne({ _id: req.params._id })

      return res.send(data);
    } catch (err) {
      return next(err)
    }
  },

  async remove(req, res, next) {
    try {
      let product = await Product.findByIdAndRemove(req.params._id);

      let history = {
        title: product.title,
        item_id: product._id,
        deleted_at: new Date(),
        type: 'product',
      }
      await History.create(history)
      return res.send({ status: true });
    } catch (err) {
      return next(err)
    }
  },

  async store(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      if (!req.files.length && !req.body.image) {
        return res.status(500).json({ error: 'Image is required'});
      }

      req.files.forEach(file => {
        let target_path = 'files/' + file.originalname;
        fs.open(target_path, 'w', (err, fd) => {
          if (err)  throw 'could not open file: ' + err;
          fs.write(fd, file.buffer, 0, file.buffer.length, null, (err) => {
            if (err) throw 'error writing file: ' + err;
            fs.close(fd)
          });
        });
      })

      let product = null
      if (req.body.type) {
        req.body.type = await Type.findOne({ _id: req.body.type })
      }

      if (req.body._id) {
        req.body.images = req.files.map(file => 'files/' + file.originalname)
        let query = {'_id': req.body._id};
        let data = req.body
        if (req.body.image) {
          data.images[0] = req.body.image
          data.priceWithDiscount = req.body.type && req.body.type.discount ? req.body.price - (req.body.price * req.body.type.discount / 100) : null
        }
        let product = await Product.findOneAndUpdate(query, data, { new: true })
        let history = {
          title: product.title,
          item_id: product._id,
          updated_at: new Date(),
          type: 'product',
        }
        await History.create(history)
        return res.send(product)
      } else {
        let images = req.files.map(file => 'files/' + file.originalname)
        product = {
          ...req.body,
          images: images,
          created_at: new Date(),
          priceWithDiscount: req.body.type && req.body.type.discount ? req.body.price - (req.body.price * req.body.type.discount / 100) : null
        }
        let createdProduct = await Product.create(product)

        let history = {
          title: createdProduct.title,
          item_id: createdProduct._id,
          created_at: createdProduct.created_at,
          type: 'product',
        }
        await History.create(history)
      }

      return res.json(product)
    } catch (err) {
      return next(err)
    }
  },

  validate(method) {
    if (method === 'store') {
      return [
        body('title').notEmpty(),
        body('description').notEmpty(),
        body('price').notEmpty(),
      ]
    }
  }
}
