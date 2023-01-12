// models
const { Users } = require("./../models/index");

const checkExistingUser = async (req, res, next) => {
  try {
    console.log(req.body);
    const userFound = await Users.findOne({
      where: { username: req.body.username },
    });
    if (userFound)
      return res.status(400).json({ message: "The user already exists" });

    const email = await Users.findOne({ where: { email: req.body.email } });
    if (email)
      return res.status(400).json({ message: "The email already exists" });

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { checkExistingUser };
