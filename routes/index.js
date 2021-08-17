const productsRouter = require('./products')
const typesRouter = require('./types')
const authRouter = require('./auth')

module.exports = function (app, middleware) {
  app.use('/api/products', productsRouter);
  app.use('/api/types', typesRouter);
  app.use('/api', authRouter);
};
