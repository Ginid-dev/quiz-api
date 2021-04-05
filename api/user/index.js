const router = require("express").Router();
const models = require("../../models");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const { accountVerificationEmail } = require("../../component/email");

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;
  let userData = null;

  if (!email) return next(new Error("Email is required"));

  if (!password) return next(new Error("Password is required"));

  return models.User.findOne({
    where: { email: email },
    attributes: ["id", "email", "emailVerified", "password"],
  })
    .then((user) => {
      if (!user) throw new Error("Email o password errati");
      userData = user;
      return bcrypt.compare(password, user.password);
    })
    .then((result) => {
      if (!result) throw new Error("Email o password errati");
      if (result && !userData.emailVerified)
        throw new Error(
          "Per favore controlla la tua email per validare il tuo account"
        );
      return models.User.authData(userData);
    })
    .then((data) => {
      res.status(200).json({
        success: true,
        data: data,
      });
    })
    .catch(next);
});

router.post("/register", (req, res, next) => {
  const { email, password } = req.body;
  let userData = null;
  if (!email) return next(new Error("Email is required"));

  if (!password) return next(new Error("Password is required"));

  return models.User.findOne({
    where: { email: email },
    attributes: ["id"],
  })
    .then((user) => {
      if (user) throw new Error("Email già esistente");
      return bcrypt.hash(password, saltRounds);
    })
    .then((hash) => {
      return models.User.create({
        email: email,
        password: hash,
      })
        .then((user) => {
          return models.User.authData(user);
        })
        .then((result) => {
          userData = result;
          return accountVerificationEmail(email, result.authToken);
        })
        .then(() => {
          res.status(200).json({
            success: true,
            data: userData,
          });
        });
    })
    .catch(next);
});

router.post("/verfiy", (req, res, next) => {
  const { token } = req.body;
  if (!token) return next(new Error("token is required"));

  return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return next(new Error("Questo collegamento non è valido"));
    if (decoded)
      return models.User.findOne({
        where: { id: decoded.userId },
        attributes: ["id", "email", "emailVerified", "updatedAt"],
      })
        .then((user) => {
          if (!user) throw new Error("Questo collegamento non è valido");

          if (
            new Date(decoded.createdAt).getTime() <
            new Date(user.updatedAt).getTime()
          )
            throw new Error("Questo collegamento non è valido");
          user.emailVerified = true;
          return Promise.all([user.save(), models.User.authData(user)]);
        })
        .then((result) => {
          res.status(200).json({
            success: true,
            data: result[1],
          });
        })
        .catch(next);
  });
});

router.use(require("../../middleware/auth"));
router.post("/refresh", (req, res, next) => {
  const userId = req.user.userId;

  return models.User.findOne({
    where: { id: 2 },
    attributes: ["id", "email", "emailVerified"],
  })
    .then((user) => {
      if (!user) return null;
      return models.User.authData(user);
    })
    .then((result) => {
      if (!result)
        res.status(401).json({
          success: false,
          message: "Unauthorize",
        });
      else
        res.status(200).json({
          success: true,
          data: result,
        });
    })
    .catch(next);
});

module.exports = router;
