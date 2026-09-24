require('dotenv').config();

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const connectDB = require('./db/connect');
const routes = require('./routes');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Render runs behind a proxy.
app.set('trust proxy', 1);
app.use(cors());
app.use(express.json());
// Serve the small Swagger login link script.
app.use('/swagger-login.js', express.static('public/swagger-login.js'));

// Store the logged-in user in a session cookie.
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'change-this-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60
    }
  })
);

// Start Passport session support.
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.json({
    message: 'Personal Task Manager API',
    docs: '/api-docs'
  });
});

// Dynamic swagger so Try it out uses this host
app.get('/swagger.json', (req, res) => {
  const proto = req.get('x-forwarded-proto') || req.protocol;
  const host = req.get('host');
  res.json({
    ...swaggerDocument,
    servers: [{ url: `${proto}://${host}`, description: 'Current server' }]
  });
});

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(null, {
    swaggerOptions: { url: '/swagger.json' },
    customJs: '/swagger-login.js'
  })
);
app.use('/auth', authRoutes);
app.use('/', routes);

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

start();
