const passport = require("passport");
const APIError = require("../utils/APIError.js");
const status = require("http-status");
exports.authJwt = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, function (err, user, info) {
    if (info) return next(new APIError(info.message, status.BAD_REQUEST));
    if (user) {
      req.user = user;
    } else {
      return next(new APIError("User Not Found", status.BAD_REQUEST));
    }
    next();
  })(req, res, next);
};
