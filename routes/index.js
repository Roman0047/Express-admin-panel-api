const productsRouter = require('./products');
const typesRouter = require('./types')

module.exports = function (app, middleware) {
  app.use('/api/products', productsRouter);
  app.use('/api/types', typesRouter);
};
