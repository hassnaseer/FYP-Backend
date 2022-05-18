
const User = require('../models/user.model');

exports.checkDuplicateEmail = (req, res, next) => {
    // Email
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(user => {
      if (user) {
        res.status(400).send({
          message: "Email already exists!"
        });
        return;
      }

      next();
    });
};