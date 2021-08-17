const { validationResult, body } = require('express-validator');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require('../models/user');

module.exports = {
    async signup(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }
            const { name, email, password, phone } = req.body;
            const oldUser = await User.findOne({ email: email });
            if (oldUser) {
                return res.status(409).json({ message: "User already exist" });
            }
            let encryptedPassword = await bcrypt.hash(password, 10)
            const user = await User.create({
                ...req.body,
                password: encryptedPassword,
            });
            console.log(process.env.TOKEN_KEY)
            user.token = jwt.sign(
                {user_id: user._id, email},
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );
            return res.json(user)
        } catch (err) {
            return next(err)
        }
    },

    async login(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }
            const { email, password } = req.body;
            const user = await User.where({ email: email }).findOne()
            if (!user) {
                return res.status(401).json({ error: 'Not such user!' });
            }
            bcrypt.compare(password, user.password, async function(err, result) {
                if (err) {
                    return res.status(500).json({ error: 'Unable to hash password' })
                }
                if (result) {
                    return res.json(user)
                } else {
                    return res.status(401).json({ error: 'Not such user!' });
                }
            });
        } catch (err) {
            return next(err)
        }
    },

    validate(method) {
        switch (method) {
            case 'signup': {
                return [
                    body('name').not()
                        .isEmpty().withMessage('Name is required'),
                    body('phone').not()
                        .isEmpty().withMessage('Phone is required')
                        .isNumeric().withMessage('Phone must be a number'),
                    body('email').not()
                        .isEmpty().withMessage('Email is required')
                        .isEmail().withMessage('Email is invalid'),
                    body('password').not()
                        .isEmpty().withMessage('Password is required')
                        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
                ]
            }
            case 'login': {
                return [
                    body('email').not()
                        .isEmpty().withMessage('Name is required'),
                    body('password').not()
                        .isEmpty().withMessage('Password is required'),
                ]
            }
        }
    }
}

