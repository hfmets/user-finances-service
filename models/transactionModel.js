module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define("Transaction", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    kind: {
      type: DataTypes.ENUM("buy", "sell"),
      allowNull: false,
    },
    ticker: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    sharesTransacted: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  });

  return Transaction;
};
