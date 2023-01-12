const jwt = require("jsonwebtoken");
// models
const { Users, Roles } = require("./../models/index");

const verifyToken = async (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) return res.status(403).json({ message: "No token provided" });

  try {
    const user = await jwt.verify(token, "JWT_SECRET");
    console.log("AUTHENTICATED TOKEN", user);
    req.user = user;

    const userFound = await Users.findByPk(req.user.id);
    if (!userFound) return res.status(404).json({ message: "No user found" });

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized!" });
  }
};

const checkRoles = (...roles) => {
  return async (req, res, next) => {
    console.log("AUTHENTICATED ROLE", req.user);

    const userFound = await Users.findByPk(req.user.id);
    if (!userFound) {
      throw new Error("User not found");
    }

    const roleFound = await Roles.findByPk(userFound.RoleId);
    if (!roleFound) {
      throw new Error("Role not found");
    }

    if (roles.includes(roleFound.name)) {
      next();
      return;
    }

    return res.status(403).json("User unauthorized");
  };
};

module.exports = { verifyToken, checkRoles };
