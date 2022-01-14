const Transactions = require("../models/index").Transactions;
const Holdings = require("../models/index").Holdings;
const Users = require("../models/index").Users;

const purchase = async (req, res) => {
  const input_data = {
    kind: "buy",
    ticker: req.body.ticker,
    value: req.body.value,
    sharesTransacted: req.body.sharesTransacted,
    UserId: req.body.UserId,
  };

  const user = await Users.findOne({ where: { id: req.body.UserId } });

  if (user) {
    await Transactions.create(input_data).catch((err) => {
      console.log(`Something went wrong: ${err}`);
      res.status(500).end("Server error");
    });

    user.decrement("accountBalance", { by: req.body.value });

    const [holding, created] = await Holdings.findOrCreate({
      where: { UserId: req.body.UserId, ticker: req.body.ticker },
      defaults: {
        sharesOwned: req.body.sharesTransacted,
        kind: req.body.holdingKind,
      },
    });

    if (!created) {
      await Holdings.increment(
        { sharesOwned: req.body.sharesTransacted },
        { where: { UserId: req.body.UserId, ticker: req.body.ticker } }
      );
    }
    res.status(200).send("Transaction completed");
  } else {
    res.status(404).send("No user found with that ID");
  }
};

const sell = async (req, res) => {
  const input_data = {
    kind: "sell",
    ticker: req.body.ticker,
    value: req.body.value,
    sharesTransacted: req.body.sharesTransacted,
    UserId: req.body.UserId,
  };

  await Transactions.create(input_data);

  await Holdings.decrement(
    { sharesOwned: req.body.sharesTransacted },
    { where: { UserId: req.body.UserId, ticker: req.body.ticker } }
  );

  res.status(200).send("Sale made");
};

module.exports = {
  purchase,
  sell,
};
