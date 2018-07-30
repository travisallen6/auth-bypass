# Auth Bypass Middleware

Configurable Express middleware for preserving and controlling session data during development. This middleware is designed to work with express and express-session to force data on to `req.session.user` prior to each endpoint controller running, preventing the need of repeatedly logging in during the development process. This middleware is designed to not modify req.session.user in a production environment through the use of environmental variables, meaning that no modifications should be necessary to prevent the user session from being modified in a production environment.

## Installation

This is a Node.js module available through the npm registry.
Before installing, download and install Node.js. Node.js 0.10 or higher is required.
Installation is done using the npm install command:

`$ npm install express`

## nodemon.json

This middleware supports the following nodemon.json configuration for determining whether the code is a development or production environment. You may optionally provide an alternative environmental variable which you would define in the development .env, but leave undefined in the production .env. Below is an example nodemon.json which will define the default NODE_ENV environmental variable. Since nodemon generally isn't run in production, this environmental variable will be undefined.

```json
{
  "restartable": "rs",
  "ignore": [".git", "node_modules/**/node_modules"],
  "watch": ["server/", "db/"],
  "env": {
    "NODE_ENV": "development"
  },
  "ext": "js json sql"
}
```

## There are two methods available to determine what data will be set to the user session

### byObject

This method allows data from a javascript object to be used as the data that will be placed on req.session.user.

```js
require('dotenv').config();
const express = require('express'),
  session = require('express-session'),
  authBypass = require('auth-bypass');

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

// The object defined as .byObject
app.use(
  authBypass.byObject(
    {
      id: 1,
      name: 'John Doe',
      email: 'john@doe.com'
    },
    {
      // Second argument is an optional configuration object.
      env: 'MODE' // This will use process.env.mode instead of the default process.env.NODE_ENV defined in the suggested nodemon.json configuration above.
    }
  )
);
```

## withDB

This method uses the massiveJS library to query a specified table, column, and ID value from a postgreSQL database which will then be placed on req.session.user.

```js
require('dotenv').config();
const express = require('express'),
  session = require('express-session'),
  massive = require('massive'),
  authBypass = require('auth-bypass');

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

massive(process.env.CONNECTION_STRING).then(db => {
  app.set('db', db);
  console.log('DB Connected');
});

// The object defined as .byObject
app.use(
  authBypass.withDB(
    {
      table: 'users',
      column: 'id',
      id: 1
    },
    {
      // Second argument is an optional configuration object.
      env: 'MODE' // This will use process.env.mode instead of the default process.env.NODE_ENV defined in the suggested nodemon.json configuration above.
    }
  )
);
```

The above example would query the 'users' table for a value of '1' in the 'id' column.
