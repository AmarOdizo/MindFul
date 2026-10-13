require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const { testConnection } = require('./src/config/supabase');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    const server = http.createServer(app);

    // Test Supabase connection
    const status = await testConnection();
    if (status.connected) {
      console.log(`⚡ Supabase: ${status.message}`);
    } else {
      console.log(`ℹ️ Supabase: ${status.message}`);
    }

    server.listen(PORT, '0.0.0.0', () => {
      console.log(`===============================================`);
      console.log(`🌿 MindFul Backend Server is running!`);
      console.log(`📡 Local:     http://localhost:${PORT}`);
      console.log(`🩺 Health:    http://localhost:${PORT}/api/health`);
      console.log(`⚡ Database:  Supabase (PostgreSQL)`);
      console.log(`===============================================`);
    });

    const shutdown = () => {
      console.log('\nShutting down gracefully...');
      server.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
