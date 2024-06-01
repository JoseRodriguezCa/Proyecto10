const jwt = require("jsonwebtoken");

const generateSign = (id,rol) => {
  return jwt.sign({ id,rol }, process.env.JWT_SECRET, { expiresIn: "30d" });
};


const verifyJwt = (token) => {
    return jwt.verify(token,process.env.JWT_SECRET);
}

module.exports = { generateSign,verifyJwt };
