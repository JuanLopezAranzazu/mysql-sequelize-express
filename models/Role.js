module.exports = (sequelize, DataTypes) => {
  const Roles = sequelize.define("Roles", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

  Roles.associate = (models) => {
    Roles.hasMany(models.Users, {
      onDelete: "cascade",
    });
  };

  return Roles;
};
