import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateToken = (user_id, email, name, role) => {
  return jwt.sign(
    { user_id, email, name, role },  
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

export default generateToken;
