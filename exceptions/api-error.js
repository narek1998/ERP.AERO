const response = require('./../helpers/http/response');

module.exports = class ApiError extends Error {
  status;
  errors;

  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnauthorizedError() {
    const responseStatus = response.status.UNAUTHORIZED;
    const data = response.dispatch({
      error: 'Пользователь не авторизован',
      code: responseStatus
    });
    return res.status(responseStatus).json(data);
  }

  static BadRequest(message, errors = []) {
    const responseStatus = response.status.BAD_REQUEST;
    const data = response.dispatch({
      message,
      errors,
      code: responseStatus
    });
    return res.status(responseStatus).json(data);
  }
};
