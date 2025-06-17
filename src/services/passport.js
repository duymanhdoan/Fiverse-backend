const passportJWT = require('passport-jwt');
const config = require('../../config/config');
const User = require("../models/User");
let ExtractJwt = passportJWT.ExtractJwt;
let Strategy = passportJWT.Strategy;
const jwt = require('jsonwebtoken');

const applyPassportStrategy = passport => {
  const options = {};
  options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  options.secretOrKey = config.passport.secret;
  passport.use(
    new Strategy(options, (payload, done) => {
      User.findOne({ email: payload.email }, (err, user) => {
        if (err) {
          return done(err, false);
        }
        if (user) {
          return done(null, {
            email: user.email,
            _id: user[config.passport.underscoreId]
          });
        }
        return done(null, false);
      });
    })
  );
};

module.exports.applyPassportStrategy = applyPassportStrategy;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.status(401).send({
    message: 'Unauthorized'
  })

  jwt.verify(token, config.passport.secret, (err, user) => {
    console.log(err)

    if (err) return res.sendStatus(403)

    req.user = user

    next()
  })
}

module.exports.authenticateToken = authenticateToken;

