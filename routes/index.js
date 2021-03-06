const productsRouter = require('./products')
const typesRouter = require('./types')
const authRouter = require('./auth')
const profileRouter = require('./profile')
const historyRouter = require('./history')

module.exports = function (app, middleware) {
  app.use('/api/products', productsRouter);
  app.use('/api/types', typesRouter);
  app.use('/api', authRouter);
  app.use('/api/profile', profileRouter);
  app.use('/api/history', historyRouter);
};
