const bcrypt = require("bcrypt");

const hash = (password, saltsOrRounds) => {
  if (password === null || saltsOrRounds === null) {
    throw new Error("Must Provide Password and salt values");
  }
  if (typeof password !== "string" || typeof saltsOrRounds !== "number") {
    throw new Error(
      "password must be a string and salt must either be a salt string or a number of rounds"
    );
  }
  return bcrypt.hash(password, saltsOrRounds);
};

const verify = (oldPassword, newPassword) => {
  if (!oldPassword || !newPassword) {
    throw new Error("Incorrect or missing passwords");
  }
  return bcrypt.compare(newPassword, oldPassword);
};

module.exports = { hash, verify };
