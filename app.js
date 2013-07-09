require('./server/server.js').listen(process.env.VCAP_APP_PORT || 3000);
