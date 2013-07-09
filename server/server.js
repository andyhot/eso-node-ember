'use strict';
var anyDB = require('any-db');
anyDB.adapters.postgres.forceJS = true;

var connData;

if (process.env.VCAP_SERVICES) {
  console.log(process.env.VCAP_SERVICES);
  var services = JSON.parse(process.env.VCAP_SERVICES);
  var credentials = services['postgresql-9.1'][0].credentials;
  connData = {
    adapter: 'postgres',
    host: credentials.host,
    port: credentials.port,
    database: credentials.name,
    user: credentials.username,
    password: credentials.password
  }
} else {
  connData = {
    adapter: 'postgres',
    host: 'localhost',
    database: 'eso',
    user: 'eso',
    password: 'eso'
  };
}

var pool = anyDB.createPool(connData, {min: 2, max: 20});

var esoUtils = require('./utils.js');

var eyes = require('eyes');
var express = require('express');
var app = express();

app.configure(function(){
  app.use(express.bodyParser());
});

app.use(function (request, response, next) {
  // rewrite for club and players urls to enhance javascript navigation
  var path = request.path;

  if (path==='/' || path.match(/^\/clubs(\/.*)?$/) || path.match(/^\/players(\/.*)?$/)) {
    request.url = '/index.html';
  }
  next();

});

app.configure('production', function(){
  app.use(express.static(__dirname + '/../dist'));
});

app.configure(function(){
  // this is our rest api
  //app.use('/api/v1', require('./api.js').create(pool));
  require('./api.js').setup(app, '/api/v1', pool);
});

module.exports = app;
