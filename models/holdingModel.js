module.exports = (sequelize, DataTypes) => {
  const Holding = sequelize.define("Holding", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    ticker: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    kind: {
      type: DataTypes.ENUM("fund", "stock"),
      allowNull: false,
    },
    sharesOwned: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
  });

  return Holding;
};
