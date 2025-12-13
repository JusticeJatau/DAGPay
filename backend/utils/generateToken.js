// utils/generateToken.js
import jwt from "jsonwebtoken";

const generateToken = (userId, accountType) => {
  return jwt.sign(
    { 
      id: userId,
      account_type: accountType,
      iat: Math.floor(Date.now() / 1000)
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || "7d"
    }
  );
};

export default generateToken;