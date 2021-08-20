const History = require('../models/history');

module.exports = {
    async list(req, res, next) {
        try {
            let data = await History.find().sort({ created_at: 'asc' });

            return res.send(data);
        } catch (err) {
            return next(err)
        }
    },
}
