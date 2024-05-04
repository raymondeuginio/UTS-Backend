const passport = require('passport');
const passportJWT = require('passport-jwt');

const config = require('../../core/config');
const { Account } = require('../../models');

// Authenticate user based on the JWT token
passport.use(
  'user',
  new passportJWT.Strategy(
    {
      jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderWithScheme('jwt'),
      secretOrKey: config.secret.jwt,
    },
    async (payload, done) => {
      const account = await Account.findOne({ id: payload.account_id });
      return account ? done(null, account) : done(null, false);
    }
  )
);

module.exports = passport.authenticate('account', { session: false });
