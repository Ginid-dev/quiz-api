const router = require("express").Router();
const authGuard = require("../middleware/auth");

router.use("/user", require("./user"));

router.use(authGuard);
router.use("/quiz", require("./quiz"));
router.use("/practice", require("./practice"));

module.exports = router;
