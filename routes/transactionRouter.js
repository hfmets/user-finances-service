const transactionController = require("../controllers/transactionController");
const verify = require("../controllers/verify");
const router = require("express").Router();

router.post("/purchase", verify, transactionController.purchase);

router.post("/sell", verify, transactionController.sell);

router.get("/accountBalance", verify, transactionController.getUserBalance);

router.post("/addFunds", verify, transactionController.addFundsToUser);

router.get(
  "/accountInfo",
  verify,
  transactionController.getHoldingsAndTransactions
);

module.exports = router;
