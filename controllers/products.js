const { validationResult, body } = require('express-validator');
const Product = require('../models/product');
const Type = require('../models/type');
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
      await Product.findByIdAndRemove(req.params._id);

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
      if (!req.files.length) {
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

      console.log(req.files)

      let product = null
      if (req.body.type) {
        req.body.type = await Type.findOne({ _id: req.body.type })
      }

      if (req.body._id) {
        req.body.images = req.files.map(file => 'files/' + file.originalname)
        let query = {'_id': req.body._id};
        let product = await Product.findOneAndUpdate(query, req.body, { new: true })
        return res.send(product)
      } else {
        let images = req.files.map(file => 'files/' + file.originalname)
        product = {
          ...req.body,
          images: images,
          created_at: new Date(),
          priceWithDiscount: req.body.type && req.body.type.discount ? req.body.price - (req.body.price * req.body.type.discount / 100) : null
        }
        await Product.create(product)
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
