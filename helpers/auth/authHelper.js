const jwt = require('jsonwebtoken');
const config = require('config');
const Token = require('../../lib/service/src/repository/token/token');

class AuthHelper {
  generateTokens(payload) {
    const accessToken = jwt.sign(
      payload,
      config.get('service').jwt.access_secret,
      {
        expiresIn: config.get('service').jwt.extraOptions.shortExpiresIn
      }
    );
    const refreshToken = jwt.sign(
      payload,
      config.get('service').jwt.refresh_secret,
      {
        expiresIn: config.get('service').jwt.extraOptions.longExpiresIn
      }
    );
    return {
      accessToken,
      refreshToken
    };
  }

  validateAccessToken(token) {
    try {
      const userData = jwt.verify(
        token,
        config.get('service').jwt.access_secret
      );
      return userData;
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(
        token,
        config.get('service').jwt.refresh_secret
      );
      return userData;
    } catch (e) {
      return null;
    }
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await Token.findOne({ where: { userId } });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
    }
    const token = await Token.create({
      userId,
      refreshToken
    });
    return token;
  }

  async removeToken(refreshToken) {
    const tokenData = await Token.destroy({ where: { refreshToken } });
    return tokenData;
  }

  async findToken(refreshToken) {
    const tokenData = await Token.findOne({ where: { refreshToken } });
    return tokenData;
  }
}

module.exports = new AuthHelper();
