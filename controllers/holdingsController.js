const Holdings = require("../models/index").Holdings;

const getHoldingsForUserById = async (req, res) => {
  await Holdings.findAll({ where: { UserId: req.params.UserId } }).then(
    (holdings) => {
      res.status(200).send(holdings);
    }
  );
};

module.exports = {
  getHoldingsForUserById,
};
