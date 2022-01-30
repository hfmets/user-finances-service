const express = require("express");
const app = express();
const port = process.env.PORT || 3334;

const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const cors = require("cors");

const corsOptions = {
  origin: "http://localhost:4200",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());

const transactionRouter = require("./routes/transactionRouter");
app.use("/api/transactions", transactionRouter);

const holdingsRouter = require("./routes/holdingsRouter");
app.use("/api/holdings", holdingsRouter);

app.listen(port, () => {
  console.log(`Now listening on port: ${port}`);
});
