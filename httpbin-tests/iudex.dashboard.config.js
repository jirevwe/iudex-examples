// Configuration for generating dashboard test data
// Outputs to main iudex repo for dashboard display
export default {
  reporters: [
    'console',
    {
      reporter: 'json',
      config: {
        outputDir: '../../../iudex/.iudex/results',
        pretty: true
      }
    }
  ]
};
