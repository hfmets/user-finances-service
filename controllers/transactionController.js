const Transactions = require("../models/index").Transactions;
const Holdings = require("../models/index").Holdings;
const Users = require("../models/index").Users;
const { buySchema, sellSchema } = require("../validation/validation");
const axios = require("axios");

const purchase = async (req, res) => {
  const { error } = buySchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const input_data = {
    kind: "buy",
    ticker: req.body.ticker,
    value: req.body.value,
    sharesTransacted: req.body.sharesTransacted,
    UserId: req.body.userId,
  };

  try {
    const user = await Users.findOne({ where: { id: req.body.userId } });
    if (user && user.accountBalance > input_data.value) {
      await Transactions.create(input_data);
      user.decrement("accountBalance", { by: req.body.value });

      const [holding, created] = await Holdings.findOrCreate({
        where: { UserId: req.body.userId, ticker: req.body.ticker },
        defaults: {
          sharesOwned: req.body.sharesTransacted,
          kind: req.body.holdingKind,
        },
      });

      if (!created) {
        await Holdings.increment(
          {
            sharesOwned: req.body.sharesTransacted,
          },
          { where: { UserId: req.body.userId, ticker: req.body.ticker } }
        );
      }
      return res.send({ status: "OK", message: "Transaction completed" });
    } else {
      return res
        .status(400)
        .send({ status: "Invalid", message: "Insufficient funds" });
    }
  } catch (err) {
    console.log(`Something went wrong: ${err}`);
    return res.status(500).send("Server error");
  }
};

const sell = async (req, res) => {
  const { error } = sellSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const input_data = {
    kind: "sell",
    ticker: req.body.ticker,
    sharesTransacted: req.body.sharesTransacted,
    UserId: req.body.userId,
  };
  const shareValue = await axios.get(
    `https://api.marketstack.com/v1/eod/latest?access_key=54b1c1a5b9ea427c6d17888d33b619aa&symbols=${input_data.ticker}&limit=1`
  );
  console.log(shareValue.data.data[0].close);
  input_data.value =
    shareValue.data.data[0].close * input_data.sharesTransacted;
  try {
    const user = await Users.findOne({ where: { id: req.body.userId } });
    if (user) {
      await Transactions.create(input_data);
      user.increment("accountBalance", {
        by: input_data.value,
      });

      await Holdings.decrement(
        { sharesOwned: req.body.sharesTransacted },
        { where: { UserId: req.body.userId, ticker: req.body.ticker } }
      );
      return res.send({ status: "OK", message: "Transaction completed" });
    }
  } catch (err) {
    console.log(`Something went wrong: ${err}`);
    return res.status(500).send("Server error");
  }
};

const getUserBalance = async (req, res) => {
  try {
    const user = await Users.findOne({ where: { id: req.body.userId } });
    if (user) {
      return res.send({ status: "OK", accountBalance: user.accountBalance });
    }
  } catch (err) {
    console.log(`Something went wrong: ${err}`);
    return res.status(500).send("Server error");
  }
};

const addFundsToUser = async (req, res) => {
  try {
    const increment = await Users.increment(
      { accountBalance: req.body.fundsToBeAdded },
      { where: { id: req.body.userId } }
    );
    return res.send({ status: "OK", increment: increment });
  } catch (err) {
    console.log(`Something went wrong: ${err}`);
    return res.status(500).send("Server error");
  }
};

const getHoldingsAndTransactions = async (req, res) => {
  try {
    const holdings = await Holdings.findAll({
      where: { UserId: req.body.userId },
    });
    const transactions = await Transactions.findAll({
      where: { UserId: req.body.userId },
    });

    if (holdings && transactions) {
      return res.send({
        status: "OK",
        transactions: transactions,
        holdings: holdings,
      });
    }
  } catch (err) {
    console.log(`Something went wrong: ${err}`);
    return res.status(500).send("Server error");
  }
};

module.exports = {
  purchase,
  sell,
  getUserBalance,
  addFundsToUser,
  getHoldingsAndTransactions,
};
