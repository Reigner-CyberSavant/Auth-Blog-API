
const {createHmac} = require('crypto');
const { hash } = require('bcryptjs');


exports.hashPassword = async (value, saltValue = 12) => {
  if (!value) throw new Error("Password is required");
  const result = await hash(value, saltValue);
  return result;
};

exports.hashedValidation = async (value, saltValue = 12) => {
  if (!value) throw new Error("Password is required");
  const result = await hash(value, saltValue);
  return result;
}

exports.hmacProcess = (value, key) => {
    const result = createHmac('sha256', key).update(value).digest('hex');
    return result;
}

