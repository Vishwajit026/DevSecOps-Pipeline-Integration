require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`[DevSecOps App] Microservice actively listening on port ${PORT}`);
  console.log(`[DevSecOps App] Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`[DevSecOps App] Security Gates: Helmet, RateLimiting & CSP initialized.`);
});

// Graceful termination handling for containerized orchestration (SIGTERM / SIGINT)
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server gracefully');
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
});
