const PROP_NAMES = require('../constants/prop-names');

/**
 * Middleware to add proxy target information to the request
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next callback
 */
module.exports = function (req, _res, next) {
  req[PROP_NAMES.target] = {
    host: 'postman-echo.com',
    path: req.url,
    method: req.method
  };

  return next();
};
