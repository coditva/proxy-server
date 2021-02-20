const config = require('../../config');

/**
 * Sends back 403 response
 *
 * @param {Object} res - The response object
 */
function respondWithDenied (res) {
  res
    .status(403)
    .json({
      error: {
        code: 403,
        message: 'You need to be authenticated to perform this action.'
      }
    })
    .end();
}

/**
 * Middleware to authenticate request using bearer token
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next callback
 */
module.exports = function (req, res, next) {
  const authHeader = req.get('authorization');

  // Check if bearer token is present
  if (!(authHeader && authHeader.startsWith('Bearer '))){
    return respondWithDenied(res);
  }

  const headerSplits = authHeader.split(' ');

  // Check if token string is present
  if (headerSplits.length !== 2 || !headerSplits[1]) {
    return respondWithDenied(res);
  }

  // Validate token string
  if (headerSplits[1] !== config.accessToken) {
    return respondWithDenied(res);
  }

  // Finally allow the request
  return next();
};
