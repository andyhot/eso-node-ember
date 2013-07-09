var esoUtils = require('./utils.js');

var api = {

	create : function(pool) {
		// generates the middleware
		return function(req, res, next) {

			if (req.path==='/players') {
				api.handlePlayers(req, res, pool);
			} else if (req.path==='/clubs') {
				api.handleClubs(req, res, pool);
			} else {
				next();
			}

		};
	},

	setup : function(app, prefix, pool) {
		// setup the middleware and the routes that are not yet included in it
		// Ultimately this will not be needed
		app.use(prefix, api.create(pool));
		api.setupRoutes(prefix, app, pool);
	},

	setupRoutes : function(prefix, app, pool) {

		app.get(prefix + '/players/:id', function (request, response) {

		  var id = esoUtils.asInt(request.params, 'id');

		  pool.query(
		    'SELECT id, code, trim (from firstname) as firstname, trim (from lastname) as lastname, fathername, mothername, to_char(birthdate, \'YYYY-MM-DD\') as birthdate, rating, clu_id ' +
		    'FROM players WHERE id = $1', [id], function(err, result) {

		    if (err) {
		      response.json({'err':err});
		      return;
		    }

		    var rows = result.rows;
		    response.json({player: rows.length===1 ? rows[0] : null});
		  });

		});

		app.get(prefix + '/clubs/:id', function (request, response) {

			var id = esoUtils.asInt(request.params, 'id');

			pool.query(
				'SELECT id, code, trim (from name) as name ' +
				'FROM clubs WHERE id = $1', [id], function(err, result) {

				if (err) {
					response.json({'err':err});
					return;
				}

				var rows = result.rows;
				response.json({club: rows.length===1 ? rows[0] : null});
			});

		});

		app.get(prefix + '/clubs/:id/players', function (request, response) {

			var id = esoUtils.asInt(request.params, 'id');
			var offset = esoUtils.asInt(request.query, 'offset');
			var limit = esoUtils.asInt(request.query, 'limit', 10, 50);
			var q = request.query.q;
			var hasQuery = q || q===null || q==='',
				queryPart = '';
			var qParams = [id, limit, offset];

			if (hasQuery) {
				if (q && q.length>2) {
					queryPart = 'AND lastname LIKE $4 ';
					qParams.push('%' + q.toUpperCase() + '%');
				} else {
					queryPart = 'AND 1=2 ';
				}
			}

			pool.query(
				'SELECT id, code, trim (from firstname) as firstname, trim (from lastname) as lastname, fathername, mothername, to_char(birthdate, \'YYYY-MM-DD\') as birthdate, rating, clu_id ' +
				'FROM players WHERE code::integer<100000 AND clu_id= $1 ' + queryPart +
				'ORDER BY code LIMIT $2 OFFSET $3', qParams, function(err, result) {
				//eyes.inspect(result);
				if (err) {
					response.json({'err':err});
					return;
				}

				var rows = result.rows;
				response.json({players: rows});
			});

		});
	},

	handlePlayers: function(req, res, pool) {
		var offset = esoUtils.asInt(req.query, 'offset');
		var limit = esoUtils.asInt(req.query, 'limit', 10, 50);
		var q = req.query.q;
		
		var hasQuery = q || q===null || q==='',
			queryPart = '';
		var qParams = [limit, offset];

		if (hasQuery) {
			if (q && q.length>2) {
				queryPart = 'AND lastname like $3 ';
				qParams.push('%' + q.toUpperCase() + '%');
			} else {
				// to small query - don't return any results
				queryPart = 'AND 1=2 ';
			}
		}

		// support alias for /club/:id/players (to help ember)
		var clu_id = req.query.clu_id;		
		if (clu_id) {
			var pos = qParams.length + 1;
			queryPart = 'AND clu_id = $' + pos + ' ';
			qParams.push(clu_id);
		}

		pool.query(
			'SELECT id, code, trim (from firstname) as firstname, trim (from lastname) as lastname, fathername, mothername, to_char(birthdate, \'YYYY-MM-DD\') as birthdate, rating, clu_id ' +
			'FROM players WHERE code::integer<100000 ' + queryPart +
			'ORDER BY code LIMIT $1 OFFSET $2', qParams, function(err, result) {
			//eyes.inspect(result);
			if (err) {
				res.json({'err':err});
				return;
			}

			var rows = result.rows;
			res.json({players: rows});
		});
	},

	handleClubs: function(req, res, pool) {
		var offset = esoUtils.asInt(req.query, 'offset');
		var limit = esoUtils.asInt(req.query, 'limit', 10, 50);
		var q = req.query.q;
		var hasQuery = q || q===null || q==='',
			queryPart = '';
		var qParams = [limit, offset];

		if (hasQuery) {
			if (q && q.length>2) {
				queryPart = 'AND name like $3 ';
				qParams.push('%' + q.toUpperCase() + '%');
			} else {
				queryPart = 'AND 1=2 ';
			}
		}

		pool.query(
			'SELECT id, code, trim (from name) as name ' +
			'FROM clubs WHERE greek=true ' + queryPart +
			'ORDER BY code LIMIT $1 OFFSET $2', qParams, function(err, result) {
			//eyes.inspect(result);
			if (err) {
				res.json({'err':err});
				return;
			}

			var rows = result.rows;
			res.json({clubs: rows});
		});
	}


};

module.exports = {
	create: api.create,
  setup: api.setup
};
