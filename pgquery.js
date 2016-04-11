var pg=require('pg');
var config = require('./config');

var conString = config.postgres_url;

module.exports = {
	 query: function(queryString, params, cb) {
	 	console.log("Query String:\n" + queryString + "\n");
	 	console.log("Query Parameters: " + params + "\n");

		pg.connect(conString, function(err, client, done) {
			if(err) {
				console.log('error fetching client from pool');
				done();
				return cb(err);
			}

			client.query(queryString, params, function(err, result) {
				done();
				cb(err, result);
			});
		});
	 }
}