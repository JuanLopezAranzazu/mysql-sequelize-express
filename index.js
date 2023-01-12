const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// db
const db = require("./models/index");

const { Roles, Users } = db;
const { hash } = require("./middlewares/Password");

const createRoles = async (roles) => {
  try {
    const count = await Roles.count();
    if (count > 0) return;

    const rolesSaved = await Roles.bulkCreate(roles);
    console.log(rolesSaved);
  } catch (error) {
    console.error(error.message);
  }
};
createRoles([{ name: "admin" }, { name: "user" }]);

const createUsers = async (users) => {
  try {
    const count = await Users.count();
    if (count > 0) return;

    const saltsOrRounds = 10;

    for (const user of users) {
      const passwordHash = await hash(user.password, saltsOrRounds);
      user.password = passwordHash;
    }

    const usersSaved = await Users.bulkCreate(users);
    console.log(usersSaved);
  } catch (error) {
    console.error(error);
  }
};
createUsers([
  { email: "admin", username: "admin", password: "admin", RoleId: 1 },
]);

// routes
const userRouter = require("./routes/User");
app.use("/users", userRouter);
const reminderRouter = require("./routes/Reminder");
app.use("/reminders", reminderRouter);
const authRouter = require("./routes/Auth");
app.use("/auth", authRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

db.sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log("SERVER RUNNING IN PORT", 3001);
  });
});
