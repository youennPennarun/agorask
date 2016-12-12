const getFieldNames = require('graphql-parse-fields');

const flatten = function(fieldsObj) {
  let fields = [];
  Object.keys(fieldsObj).forEach(fieldName => {
    if (fieldsObj[fieldName] === true) {
      fields.push(fieldName);
    } else {
      flatten(fieldsObj[fieldName]).forEach(child => {
        fields.push(`${fieldName}.${child}`);
      });
    }
  });
  return fields;
};

function getFields(info, type) {
  const parsed = getFieldNames(info);
  const flat = flatten(parsed);
  if (type === Object) {
    const result = {};
    flat.forEach(value => {
      result[value] = 1;
    });
    return result;
  } else if (type === String) {
    return flat.join(' ');
  }
  return flat;
}

function needMoreFields(fields, obj) {
  const missingFields = Object.assign({}, fields);
  if (obj instanceof Array) {
    if (obj.length) {
      obj = obj[0];
    } else {
      return true;
    }
  }
  console.log(obj);
  if (obj.toObject) {
    obj = obj.toObject();
  }
  Object.keys(obj).forEach(key => {
    if (obj[key]) {
      delete missingFields[key];
    }
  });
  return !!(missingFields.length);
}

module.exports = {
  getFields,
  needMoreFields,
};
