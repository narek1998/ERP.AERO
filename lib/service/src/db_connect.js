const { Sequelize } = require('sequelize');
const config = require('config');
const winston = require('winston');

const { host, user, password, port, database } = config.get('db').mysql;

module.exports = new Sequelize(database, user, password, {
  dialect: 'mysql',
  host: host,
  port: port,
  logging: winston.debug
});
