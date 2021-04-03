const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  let token = req.headers["authorization"];

  if (!token) {
    res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
    return;
  }

  token = token.substring(token.lastIndexOf(" ", token.length)).trim();

  jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
    if (err || !decoded)
      res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    else {
      req.user = decoded;
      next();
    }
  });
};
