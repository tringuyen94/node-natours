const express = require('express');
const morgan = require('morgan');
const ErrorResponse = require('./error/response');
const errorHandler = require('./error/handler');
const appRouter = require('./routes/index');
const rateLimit = require('express-rate-limit');
const { default: helmet } = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const path = require('path');
const app = express();
const viewRouter = require('./routes/view.routes');
const cookieParser = require('cookie-parser');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('Uncaught Exception, Server is shutting down...');
  process.exit(1);
});
/**
 * Global  Middldewares
 */
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

//HELMET
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        // ... other directives
        'script-src': [
          "'self'", // allow scripts from your own domain
          'ws://localhost:1234/',
          "'unsafe-inline'", // allow inline scripts (you may want to remove this depending on your needs)
          'https://api.mapbox.com', // allow scripts from the Mapbox CDN
          'https://js.stripe.com',
          'cdnjs.cloudflare.com', // allow scripts from the Cloudfare CDN
        ],
        'frame-src': ['https://js.stripe.com', 'https://hooks.stripe.com'],
        'worker-src': [
          "'self'", // allow web workers from your own domain
          'http://localhost:8080', // allow web workers from the current host (development environment)
          'https://api.mapbox.com', // allow web workers from the Mapbox CDN
          'https://js.stripe.com',
          'ws://localhost:1234/',
          'blob:', // allow web workers from blob URLs
        ],
        'connect-src': [
          "'self'", // allow connections to your own domain
          'ws://localhost:1234/',
          'https://js.stripe.com',
          'https://api.stripe.com',
          'data:',
          'https://q.stripe.com',
          'https://api.mapbox.com', // allow connections to the Mapbox API
          'https://events.mapbox.com', // allow connections to Mapbox events
        ],
      },
    },
  })
);
app.use(cookieParser());
if (process.env.NODE_ENV === 'dev') {
  app.use(morgan('dev')); // Log request
}
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request was sent, try again one hour later',
});
// app.get('/', (req, res, next) => {
//   console.log(req.cookies);
//   next();
// });
app.get('/', (req, res) => {
  res.status(200).render('base');
});

app.use('/api', limiter); //Limit Request
app.use(mongoSanitize()); //Data sanitize against NoSQL injection
app.use(
  hpp({
    whitelist: ['duration'],
  })
);

// app.use('');
app.use(express.json({ limit: '10kb' })); // req.body parser

/** END */

/**
 * Connect Database
 */
require('./db');
/** END */

/**
 * ROUTES
 */
app.use('/', viewRouter);
app.use('/api/v1', appRouter);

/**
 * GLOBAL ERROR HANDLING
 */

app.use((req, res, next) => {
  next(new ErrorResponse(`${req.originalUrl} not exists in this app`, 404));
});
app.use(errorHandler);

/** END */

module.exports = app;
