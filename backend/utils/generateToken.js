const jwt = require("jsonwebtoken");
const generateToken = (id) => {
  return jwt.sign({ id }, "10", {
    expiresIn: "30d",
  });
};

module.exports = generateToken;
