
function NotFoundError(message) {
  this.name = 'NotFound';
  this.message = message || 'Not found';
  this.stack = (new Error()).stack;
}
NotFoundError.prototype = Object.create(Error.prototype);
NotFoundError.prototype.constructor = NotFoundError;

module.exports = {
  NotFoundError,
};
