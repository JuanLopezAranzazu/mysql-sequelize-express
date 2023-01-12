const express = require("express");
const router = express.Router();
// sequelize
const { Op } = require("sequelize");
// models
const { Reminders, Users } = require("./../models/index");
// middlewares
const { verifyToken } = require("./../middlewares/Auth");

router.get("/", verifyToken, async (req, res, next) => {
  try {
    const { user } = req;
    const reminders = await Reminders.findAll({
      where: { userId: user.id },
      include: Users,
    });
    res.json(reminders);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", verifyToken, async (req, res, next) => {
  try {
    const { params, user } = req;
    const reminders = await Reminders.findOne({
      where: { [Op.and]: [{ id: params.id }, { UserId: user.id }] },
      include: Users,
    });
    res.json(reminders);
  } catch (error) {
    next(error);
  }
});

router.post("/", verifyToken, async (req, res, next) => {
  try {
    const { body, user } = req;
    const reminderSaved = await Reminders.create({ ...body, UserId: user.id });
    res.status(201).json(reminderSaved);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", verifyToken, async (req, res, next) => {
  try {
    const { body, params, user } = req;
    // find reminder
    const reminderFound = await Reminders.findByPk(params.id);
    if (!reminderFound) {
      throw new Error("Reminder not found");
    }

    const userFound = await Users.findByPk(user.id);
    if (!userFound) {
      throw new Error("User not found");
    }

    // validate user
    if (reminderFound.UserId !== userFound.id) {
      throw new Error("You do not have permission");
    }

    const reminderUpdated = await Reminders.update(body, {
      where: { id: params.id },
    });
    res.json(reminderUpdated);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", verifyToken, async (req, res, next) => {
  try {
    const { params, user } = req;
    // find reminder
    const reminderFound = await Reminders.findByPk(params.id);
    if (!reminderFound) {
      throw new Error("Reminder not found");
    }

    const userFound = await Users.findByPk(user.id);
    if (!userFound) {
      throw new Error("User not found");
    }

    // validate user
    if (reminderFound.UserId !== userFound.id) {
      throw new Error("You do not have permission");
    }

    const reminderDeleted = await Reminders.destroy({
      where: { id: params.id },
    });
    res.status(204).json(reminderDeleted);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
