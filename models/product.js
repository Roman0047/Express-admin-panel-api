const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    title: String,
    description: String,
    created_at: String,
    updated_at: String,
    deleted_at: String,
    images: Array,
    price: Number,
    priceWithDiscount: Number,
    type: Object,
});

module.exports = mongoose.model('Product', schema);