const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: String,
    created_at: String,
    discount: Number
});

module.exports = mongoose.model('Type', schema);