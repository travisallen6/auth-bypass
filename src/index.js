function withObject(user, config = {}) {
  let { env } = config;
  if (!user)
    throw new Error(
      'You must specify a data to be placed on req.session.user as the first argument'
    );

  env = env || 'NODE_ENV';
  return function withObjectMiddleware(req, res, next) {
    if (!req.session.user && process.env[env]) {
      req.session.user = user;
    }
    next();
  };
}

function withDB(dbConfig, config = {}) {
  if (!dbConfig) {
    throw new Error(
      'The required database configuration object is undefined. Specify an object with the table, column and target id for the desired user data.'
    );
    return function(req, res, next) {
      next();
    };
  }
  let { env } = config;
  const { table, column, id } = dbConfig;
  return function widDBMiddleware(req, res, next) {
    env = env || 'NODE_ENV';
    if (!req.session.user && process.env[env]) {
      const db = req.app.get('db');
      db[table]
        .find({ [column]: id })
        .then(user => {
          if (user.length === 1) {
            req.session.user = user[0];
            next();
          } else if (user.length === 0) {
            throw new Error(
              'No user was returned from the database based on the database configuration you provided. No user data will be placed on req.session.user.'
            );
            next();
          } else {
            throw new Error(
              'More than one user was returned given the provided database configuration. No user data will be placed on req.session.user'
            );
            next();
          }
        })
        .catch(err => {
          throw new Error(err);
        });
    } else {
      next();
    }
  };
}

exports.withObject = withObject;
exports.withDB = withDB;
