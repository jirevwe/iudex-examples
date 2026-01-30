export default {
  reporters: [
    'console',
    {
      reporter: 'postgres',
      config: {
        // Enable reporter
        enabled: true,

        // Connection
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5433'),
        database: process.env.DB_NAME || 'iudex_tests',
        user: process.env.DB_USER || 'iudex',
        password: process.env.DB_PASSWORD,
        ssl: process.env.DB_SSL === 'true',

        // Performance
        enableBatching: true,
        batchSize: parseInt(process.env.REPORTER_BATCH_SIZE || '100'),

        // Error handling
        throwOnError: true,  // Temporarily enabled for debugging

        // Pool
        poolSize: 10
      }
    },
    {
      reporter: 'json',
      config: {
        outputDir: '.iudex/results',
        pretty: true
      }
    }
  ]
};
