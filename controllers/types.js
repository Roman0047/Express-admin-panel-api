const { validationResult, body } = require('express-validator');
const Type = require('../models/type');
const Product = require('../models/product');
const fs = require('fs');
const History = require("../models/history");

const updateProducts = async (type, req, res) => {
    let data = await Product.find().sort({ created_at: 'desc' });
    let products = data.filter(item => item.type && item.type.created_at === type.created_at)
    await Promise.all(products.map(async item => {
        if (item.type !== null) {
          item._doc.type = await Type.findOne({ _id: item.type._id });
          if (!item._doc.type) {
              item._doc.priceWithDiscount = null
          } else {
              item._doc.priceWithDiscount = item.type.discount ? item.price - (item.price * item.type.discount / 100) : null
          }
        }
        let query = {'_id': item._id};
        await Product.findOneAndUpdate(query, item, { new: true });
        return item
    }))
}

module.exports = {
    async list(req, res, next) {
        try {
            let data = await Type.find().sort({ created_at: 'desc' });

            return res.send(data);
        } catch (err) {
            return next(err)
        }
    },

    async get(req, res, next) {
        try {
            let data = await Type.findOne({ _id: req.params._id })
            return res.send(data);
        } catch (err) {
            return next(err)
        }
    },

    async remove(req, res, next) {
        try {
            let type = await Type.findByIdAndRemove(req.params._id);

            let history = {
                title: type.name,
                item_id: type._id,
                deleted_at: new Date(),
                type: 'type',
            }
            await History.create(history)
            await updateProducts(type, req, res)
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

            let type = null

            if (req.body._id) {
                let query = {'_id': req.body._id};
                let type = await Type.findOneAndUpdate(query, req.body, { new: true });
                let history = {
                    title: type.name,
                    item_id: type._id,
                    updated_at: new Date(),
                    type: 'type',
                }
                await History.create(history)
                await updateProducts(type, req, res)
                return res.send(type) ;
            } else {
                type = {
                    ...req.body,
                    created_at: new Date()
                }
                let createdType = await Type.create(type)
                let history = {
                    title: createdType.name,
                    item_id: createdType._id,
                    created_at: createdType.created_at,
                    type: 'type',
                }
                await History.create(history)
            }

            return res.json(type)
        } catch (err) {
            return next(err)
        }
    },

    validate(method) {
        if (method === 'store') {
            return [
                body('name').notEmpty(),
            ]
        }
    }
}
