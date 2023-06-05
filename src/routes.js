const authRouter = require('./components/auth/api');
const fileRouter = require('./components/file/api');

module.exports = (app) => {
  app.use('/', authRouter);
  app.use('/file', fileRouter);
};
