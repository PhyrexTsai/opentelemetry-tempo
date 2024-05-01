const initTracer = require('jaeger-client').initTracer;

function createTracer(serviceName, collectorEndpoint) {
  const config = {
    serviceName,
    sampler: {
      type: 'const',
      param: 1,
    },
    reporter: {
      logSpans: true,
      collectorEndpoint,
    },
  };
  const options = {
    logger: {
      info(msg) {
        console.log('INFO ', msg);
      },
      error(msg) {
        console.log('ERROR', msg);
      },
    },
  };

  return initTracer(config, options);
}

module.exports = {
  createTracer,
};