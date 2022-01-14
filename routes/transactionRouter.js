const transactionController = require("../controllers/transactionController");
const router = require("express").Router();

router.post("/purchase", transactionController.purchase);

router.post("/sell", transactionController.sell);

module.exports = router;
