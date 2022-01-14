const express = require("express");
const app = express();
const port = process.env.PORT || 3334;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const transactionRouter = require("./routes/transactionRouter");
app.use("/api/transactions", transactionRouter);

const holdingsRouter = require("./routes/holdingsRouter");
app.use("/api/holdings", holdingsRouter);

app.listen(port, () => {
  console.log(`Now listening on port: ${port}`);
});
