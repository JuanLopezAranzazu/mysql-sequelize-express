const express = require("express");
const router = express.Router();
// models
const { Users, Reminders, Roles } = require("./../models/index");
// middlewares
const { verifyToken, checkRoles } = require("./../middlewares/Auth");
const { hash } = require("./../middlewares/Password");
const { checkExistingUser } = require("./../middlewares/CheckUser");

router.get("/", verifyToken, checkRoles("admin"), async (req, res, next) => {
  try {
    const users = await Users.findAll({ include: Reminders });
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", verifyToken, checkRoles("admin"), async (req, res, next) => {
  try {
    const { params } = req;
    const user = await Users.findByPk(params.id, { include: Reminders });
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/",
  verifyToken,
  checkRoles("admin"),
  checkExistingUser,
  async (req, res, next) => {
    try {
      const { body } = req;
      console.log(body);

      const { RoleId, password, ...rest } = body;
      const roleFound = await Roles.findByPk(RoleId);
      if (!roleFound) {
        throw new Error("Role not found");
      }

      const saltsOrRounds = 10;
      const passwordHash = await hash(password, saltsOrRounds);

      const userSaved = await Users.create({
        ...rest,
        RoleId,
        password: passwordHash,
      });
      res.status(201).json(userSaved);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/:id",
  verifyToken,
  checkRoles("admin"),
  checkExistingUser,
  async (req, res, next) => {
    try {
      const { body, params } = req;
      console.log(body, params);

      const { RoleId, password, ...rest } = body;
      const roleFound = await Roles.findByPk(RoleId);
      if (!roleFound) {
        throw new Error("Role not found");
      }

      const saltsOrRounds = 10;
      const passwordHash = await hash(password, saltsOrRounds);

      const userUpdated = await Users.update(
        { ...rest, RoleId, password: passwordHash },
        { where: { id: params.id } }
      );
      res.json(userUpdated);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:id",
  verifyToken,
  checkRoles("admin"),
  async (req, res, next) => {
    try {
      const { body, params } = req;
      console.log(body, params);

      const userFound = await Users.findByPk(params.id);
      if (!userFound) {
        throw new Error("User not found");
      }
      const userDeleted = await Users.destroy({ where: { id: params.id } });
      res.status(204).json(userDeleted);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
