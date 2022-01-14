const holdingsController = require("../controllers/holdingsController");
const router = require("express").Router();

router.get("/:UserId", holdingsController.getHoldingsForUserById);

module.exports = router;
