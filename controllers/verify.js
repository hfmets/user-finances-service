const axios = require("axios");
const cookieParser = require("cookie-parser");

module.exports = function (req, res, next) {
  const sessionCookie = req.cookies["connect.sid"];
  let url = "http://localhost:3333/api/users/verify";
  if (process.env.NODE_ENV === "production") {
    url = "http://backend.vandelay-user.fun/api/users/verify";
  }
  axios
    .post(url, {
      sessionCookie: sessionCookie,
    })
    .then((response) => {
      console.log(response.data);
      req.body.userId = response.data.userId;
      next();
    })
    .catch((err) => {
      //console.log(err);
      return res
        .status(400)
        .send({
          status: "Invalid",
          message: "Invalid user credentials",
          cookie: sessionCookie,
        });
    });
};
