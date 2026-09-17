require('dotenv').config();

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const connectDB = require('./db/connect');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

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
  swaggerUi.setup(null, { swaggerOptions: { url: '/swagger.json' } })
);
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
