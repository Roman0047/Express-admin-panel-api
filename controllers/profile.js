const { validationResult, body } = require('express-validator');
const jwt = require("jsonwebtoken");
const User = require('../models/user');
const Product = require("../models/product");

module.exports = {
    async get(req, res, next) {
        try {
            if (req.headers && req.headers.authorization) {
                let authorization = req.headers.authorization.split(' ')[1]
                let decoded = null
                try {
                    decoded = jwt.verify(authorization, process.env.TOKEN_KEY);
                } catch (e) {
                    return res.status(401).json({ error: 'unauthorized'});
                }
                let user = await User.findOne({email: decoded.email})
                let data = {
                    email: user.email,
                    name: user.name,
                    phone: user.phone,
                    token: user.token,
                    _id: user._id,
                }
                return res.send(data);
            }
            return res.status(500).json({ error: 'Invalid token'});
        } catch (err) {
            return next(err)
        }
    },
}
