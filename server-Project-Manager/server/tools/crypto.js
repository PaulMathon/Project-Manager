const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
  const saltRounds = 10;

  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) reject(err);
      resolve(hash);
    });
  });

  return hashedPassword;
};

const comparePasswords = async (passwordSent, passwordStored) => {
  const areEqual = await new Promise((resolve, reject) => {
    bcrypt.compare(passwordSent, passwordStored, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });

  return areEqual;
};


module.exports = {
  hashPassword,
  comparePasswords,
};
