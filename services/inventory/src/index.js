const express = require('express');
const axios = require('axios');
const opentracing = require('opentracing');

const { createTracer } = require('./tracer.js');

const tracer = createTracer(
  'inventory-service',
  'http://collector:14268/api/traces'
);

const app = express();

app.use('/', async (req, res) => {
  const parent = tracer.extract(opentracing.FORMAT_HTTP_HEADERS, req.headers);
  const span = tracer.startSpan('inventory.process', { childOf: parent });
  const id = req.query.kennelId;
  span.setTag('inventory.kennel-id', id);

  const ids = await getInventoryByKennelId(id, span);
  res.send(ids);
  span.finish();
});

app.listen('8080', '0.0.0.0');

async function getInventoryByKennelId(id, parent) {
  const inventory = [[0], [1, 2], [3, 4, 5]];

  const span = tracer.startSpan('inventory.get-inventory-by-kennel-id', {
    childOf: parent,
  });

  await new Promise((resolve) => setTimeout(resolve, 100));
  span.finish();
  return inventory[id];
}