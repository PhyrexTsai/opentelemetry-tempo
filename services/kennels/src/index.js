const express = require('express');
const opentracing = require('opentracing');
const data = require('./data');
const { createTracer } = require('./tracer');

const tracer = createTracer(
  'kennels-service',
  'http://collector:14268/api/traces'
);

const app = express();

app.use('/', async (req, res) => {
  const parent = tracer.extract(opentracing.FORMAT_HTTP_HEADERS, req.headers);
  const span = tracer.startSpan('kennels.process-request', { childOf: parent });

  const id = req.query.id;
  const name = await data.getKennelName(id, span, tracer);

  if (!name) {
    res.status(404);
    res.send();
    span.finish();
    return;
  }

  const inventory = await data.getInventory(id, span, tracer);

  let dogs = await Promise.all(
    inventory.map(async (x) => {
      const name = await data.getDogDetails(x, span, tracer);
      return {
        id: x,
        name,
      };
    })
  );

  res.send({ name, dogs });
  span.finish();
});

app.listen('8080', '0.0.0.0');