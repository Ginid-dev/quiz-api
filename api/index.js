const router = require("express").Router();
const authGuard = require("../middleware/auth");

router.use("/user", require("./user"));

module.exports = router;
