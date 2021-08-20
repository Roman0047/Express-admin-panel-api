const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    title: String,
    created_at: String,
    updated_at: String,
    deleted_at: String,
    item_id: String,
    type: String,
});

module.exports = mongoose.model('History', schema);