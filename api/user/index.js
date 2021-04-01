const router = require("express").Router();
const models = require("../../models");

router.post("/register", (req, res, next) => {
  const { email, password } = req.body;

  if (!email) return next(new Error("Email is required"));
  if (!password) return next(new Error("Password is required"));
  if (!password.trim().length >= 6)
    return next(new Error("Password is too short"));
});

module.exports = router;
