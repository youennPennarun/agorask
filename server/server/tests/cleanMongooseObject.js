const clean = function(object) {
  delete object.__v;
  return object;
};

module.exports = function(data) {
  const parsed = JSON.parse(JSON.stringify(data));
  if (parsed instanceof Array) {
    return parsed.map(clean);
  }
  return clean(parsed);         
};
