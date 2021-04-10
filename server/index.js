require("dotenv").config();

const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const {
  createAccessTokens,
  createCustomerTokens,
  validateToken,
  validateTokens,
} = require("./JWT");
const cors = require("cors");
const sequelize = require("sequelize");
const db = require("./database/connection");
const cookieParser = require("cookie-parser");
const { User, Passcode } = require("./database/models");

const saltRounds = 10;
const PORT = 8000;

//------------------------Middleware---------------------------

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.urlencoded());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

//-------------------------Routes------------------------------

//only used to initialize single master passcode
app.post("/createPasscode", async (req, res) => {
  const { passcode } = req.body;
  const hashedPasscode = await bcrypt.hash(passcode, saltRounds);

  Passcode.create({ id: "master", passcode: hashedPasscode })
    .then((info) => {
      console.log(info);
      console.log("New passcode successfully inserted into the db");
      res.json(true);
    })
    .catch((err) => {
      console.log("Passcode already exists", err);
      res.json(false);
    });
});

app.post("/passcode", async (req, res) => {
  const { passcode } = req.body;
  const auth = await Passcode.findOne({ where: { id: "master" } });
  bcrypt.compare(passcode, auth.passcode).then((result) => {
    if (result) {
      const accessToken = createAccessTokens(result);
      console.log(accessToken);
      res.cookie("access-token", accessToken, {
        maxAge: 60 * 60 * 24 * 1000,
        httpOnly: true,
      });
      res.json(true);
    } else {
      res.json(false);
    }
  });
});

app.post("/customer", async (req, res) => {
  const { pseudonym } = req.body;
  const customer = await User.findOne({ where: { pseudonym: pseudonym } });
  if (customer) {
    const customerToken = createCustomerTokens(customer);
    res.cookie("customer-token", customerToken, {
      maxAge: 60 * 60 * 24 * 1000,
      httpOnly: true,
    });
    res.send({ auth: true });
  } else {
    res.json({
      auth: false,
      message: "Hmm, you're not on the list. Are you new?",
    });
  }
});

app.post("/newCustomer", validateToken, async (req, res) => {
  const { pseudonym } = req.body;
  try {
    const auth = await User.create({ pseudonym: pseudonym });
<<<<<<< HEAD
    res.send({ auth: true });
=======
    res.json({ auth: true, customer: auth });
>>>>>>> dd222ae70904e188433133a10e2fc3a596755436
  } catch {
    res
      .status(404)
      .send({ auth: false, message: "pseudonym already in exists" });
  }
});

app.get("/isAuth", validateTokens, (req, res) => {
  res.send(true);
  //you should only be able to access this route if you have given the passcode and your name
  // validateTokens(req, res, () => {
  //   res.send({ auth: true });
  // });
});

//------------------------Start Server-------------------------
app.listen(PORT, async () => {
  // await db.sync({ force: true });
  console.log(`Now listening on http://localhost:${PORT}`);
});
