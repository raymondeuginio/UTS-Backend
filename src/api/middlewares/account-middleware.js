const passport = require('passport');
const passportJWT = require('passport-jwt');

const config = require('../../core/config');
const { Account } = require('../../models');

passport.use(
  'account',
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

const account_middleware = (request, response, next) => {
  passport.authenticate('account', { session: false }, (err, account) => {
    if (err) {
      return next(err);
    }
    if (!account) {
      return response.status(401).send('Unauthorized');
    }

    const loged_in = account.username;
    const requested = request.params.username;

    if (loged_in !== requested) {
      return response.status(403).send('Anda tidak memiliki akses');
    }
    next();
  })(request, response, next);
};

module.exports = account_middleware;
