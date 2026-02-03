export default {
  // Database configuration (used by CLI commands like db:migrate)
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'iudex_tests',
    user: process.env.DB_USER || 'iudex',
    password: process.env.DB_PASSWORD || 'iudex_dev_password',
    ssl: process.env.DB_SSL === 'true',
    autoMigrate: process.env.AUTO_MIGRATE !== 'false'  // Default: true
  },

  reporters: [
    'console',
    {
      reporter: 'postgres',
      config: {
        // Enable reporter
        enabled: true,

        // Connection
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME || 'iudex_tests',
        user: process.env.DB_USER || 'iudex',
        password: process.env.DB_PASSWORD || 'iudex_dev_password',
        ssl: process.env.DB_SSL === 'true',

        // Migrations - Auto-run on first connection (development)
        autoMigrate: true,

        // Performance
        enableBatching: true,
        batchSize: parseInt(process.env.REPORTER_BATCH_SIZE || '100'),

        // Error handling
        throwOnError: true,  // Temporarily enabled for debugging

        // Pool
        poolSize: 10
      }
    }
  ]
};
