const axios = require('axios');
const opentracing = require('opentracing');

function getKennelName(id, parent, tracer) {
  const span = tracer.startSpan('kennels.get-dog-details', { childOf: parent });
  const name = ['awesome kennel', 'not as awesome kennel', 'some other kennel'][
    id
  ];
  span.finish();
  return name;
}

async function getDogDetails(id, parent, tracer) {
  const span = tracer.startSpan('kennels.get-dog-name', { childOf: parent });
  let name;
  try {
    let headers = {};
    tracer.inject(span, opentracing.FORMAT_HTTP_HEADERS, headers);
    const res = await axios.get(`http://dogs:8080/?id=${id}`, { headers });
    name = res.data;
  } catch (e) {
    console.log(e);
  }

  span.finish();
  return name || 'Nameless Dog';
}

async function getInventory(id, parent, tracer) {
  const span = tracer.startSpan('kennels.get-inventory', { childOf: parent });
  let result;

  try {
    let headers = {};
    tracer.inject(span, opentracing.FORMAT_HTTP_HEADERS, headers);
    const response = await axios.get(`http://inventory:8080/?kennelId=${id}`, {
      headers,
    });
    result = response.data;
  } catch (e) {
    console.log(e);
    result = [];
  }

  span.finish();
  return result;
}

module.exports = {
  getKennelName,
  getDogDetails,
  getInventory,
};
