const express = require('express');
const axios = require('axios');
const opentracing = require('opentracing');

const { createTracer } = require('./tracer.js');

const tracer = createTracer(
  'dogs-service',
  'http://collector:14268/api/traces'
);

const app = express();

app.use('/', async (req, res) => {
  const parent = tracer.extract(opentracing.FORMAT_HTTP_HEADERS, req.headers);
  const span = tracer.startSpan('dogs.process-request', { childOf: parent });
  const id = req.query.id;
  span.setTag('dogs.id', id);

  const name = await getDogName(id, span);
  res.send(name);
  span.finish();
});

app.listen('8080', '0.0.0.0');

async function getDogName(id, parent) {
  const names = ['Rufus', 'Rex', 'Dobby', 'Möhre', 'Jack', 'Charlie'];

  const span = tracer.startSpan('inventory.get-dog-name', {
    childOf: parent,
  });
  await new Promise((resolve) => setTimeout(resolve, 100));
  span.finish();
  return names[id];
}