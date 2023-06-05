const ___ = require('lodash');
const bcrypt = require('bcrypt');
const User = require('../../../lib/service/src/repository/user/user');
const response = require('../../../helpers/http/response');
const authHelper = require('../../../helpers/auth/authHelper');
const ApiError = require('../../../exceptions/api-error');

exports.register = async (req, res, next) => {
  try {
    const { value, password } = req.body;
    const candidate = await User.findOne({ where: { value } });
    if (candidate) {
      const responseStatus = response.status.BAD_REQUEST;
      const data = response.dispatch({
        error: 'value Exist',
        code: responseStatus
      });
      return res.status(responseStatus).json(data);
    }
    const hashPassword = await bcrypt.hash(password, 3);
    const user = await User.create({
      value,
      password: hashPassword
    });
    const tokens = await authHelper.generateTokens({
      id: user.id
    });
    await authHelper.saveToken(user.id, tokens.refreshToken);

    return res.json({ tokens });
  } catch (e) {
    console.log(e);
    res.send({ message: 'Server error' });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { value, password } = req.body;
    const user = await User.findOne({ where: { value } });
    if (!user) {
      const responseStatus = response.status.BAD_REQUEST;
      const data = response.dispatch({
        error: 'User Not found',
        code: responseStatus
      });
      return res.status(responseStatus).json(data);
    }

    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      const responseStatus = response.status.BAD_REQUEST;
      const data = response.dispatch({
        error: 'Wrong password',
        code: responseStatus
      });
      return res.status(responseStatus).json(data);
    }

    const tokens = await authHelper.generateTokens({
      id: user.id
    });
    await authHelper.saveToken(user.id, tokens.refreshToken);
    return res.json({ tokens });
  } catch (e) {
    console.log(e);
    res.send({ message: 'Server error' });
  }
};

exports.refreshTokens = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = authHelper.validateRefreshToken(refreshToken);
    const tokenFromDb = await authHelper.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const user = await User.findOne({ where: { id: userData.id } });
    const tokens = authHelper.generateTokens({ id: user.id });
    await authHelper.saveToken(user.id, tokens.refreshToken);
    return res.json({ tokens });
  } catch (e) {
    console.log(e);
    res.send({ message: 'Server error' });
  }
};

exports.userInfo = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { value } = User.findOne({ where: { id } });
    return res.json({ value });
  } catch (e) {
    console.log(e);
    res.send({ message: 'Server error' });
  }
};
