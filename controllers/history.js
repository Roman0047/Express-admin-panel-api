const History = require('../models/history');
const Type = require("../models/type");

module.exports = {
    async list(req, res, next) {
        try {
            let data = await History.find().sort({ created_at: 'asc' });
            // data.sort(function(a,b){
            //     return new Date(b.created_at) - new Date(a.created_at);
            // });
            return res.send(data);
        } catch (err) {
            return next(err)
        }
    },
}
