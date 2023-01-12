const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// models
const { Users, Roles } = require("./../models/index");
// middlewares
const { verifyToken } = require("./../middlewares/Auth");
const { hash, verify } = require("./../middlewares/Password");
const { checkExistingUser } = require("./../middlewares/CheckUser");

router.post("/login", async (req, res, next) => {
  try {
    const { body } = req;
    console.log(body);
    const { username, password } = body;

    const userFound = await Users.findOne({ where: { username } });
    if (!userFound) {
      throw new Error("User not found");
    }

    const passwordCorrect = await verify(userFound.password, password);
    if (!passwordCorrect) {
      throw new Error("Password incorrect");
    }

    // create token
    const token = await jwt.sign(
      { id: userFound.id, username: userFound.username },
      "JWT_SECRET",
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (error) {
    next(error);
  }
});

router.post("/register", checkExistingUser, async (req, res, next) => {
  try {
    const { body } = req;
    console.log(body);
    const { password, RoleId, ...rest } = body;

    const roleFound = await Roles.findByPk(RoleId);
    if (!roleFound) {
      throw new Error("Role not found");
    }

    const saltsOrRounds = 10;
    const passwordHash = await hash(password, saltsOrRounds);

    const dataForUser = {
      ...rest,
      RoleId,
      password: passwordHash,
    };

    const userSaved = await Users.create(dataForUser);
    if (!userSaved) {
      throw new Error("Could not create record");
    }

    // create token
    const token = await jwt.sign(
      { id: userSaved.id, username: userSaved.username },
      "JWT_SECRET",
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (error) {
    next(error);
  }
});

router.get("/auth", verifyToken, (req, res) => {
  res.json(req.user);
});

module.exports = router;
