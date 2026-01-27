// Iudex configuration for httpbin tests
export default {
  reporters: [
    'console',
    {
      reporter: 'json',
      config: {
        outputDir: '.iudex/results',
        pretty: true
      }
    }
  ]
};
