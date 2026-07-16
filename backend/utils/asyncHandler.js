/**
 * Wraps an async Express route handler so rejected promises are passed
 * to next(), where the centralized error handler middleware takes over.
 */
function asyncHandler(fn) {
  return function wrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;
