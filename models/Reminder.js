module.exports = (sequelize, DataTypes) => {
  const Reminders = sequelize.define("Reminders", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Reminders.associate = (models) => {
    Reminders.belongsTo(models.Users);
  };

  return Reminders;
};
