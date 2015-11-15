var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FixturesModel = mongoose.model('fixtures', new Schema({
	id: mongoose.Schema.ObjectId,
	team: { type: String, required: true},
	home: Boolean,
	logo: String,
	result: String,
	datetime: { type: Date, default: Date.now }
}));

module.exports.list = function(callback ) {
	FixturesModel
		.find()
    .sort('datetime')
		.exec( function(err, list ){
			if ( err ) {
        return;
				//throw err
			}

			return callback(list);
		});
}

module.exports.item = function(id, callback) {
	FixturesModel.findOne( {_id: id}, function(err, game){
		if ( err ) {
      return;
			throw err;
		}
		return callback(game);
	});
}

module.exports.nextGame = function(callback) {
	FixturesModel
		.findOne( {result: '-'} )
		.sort('datetime')
		.exec( function(err, game){
			if ( err ) {
	      return;
				throw err;
			}
			return callback(game);
		});
}


module.exports.deleteAll = function( callback ) {
	FixturesModel.remove({}, function(err){
		return callback();
	})
}

module.exports.insert = function(data, callback ) {
	FixturesModel.create(data, function(err, data, next) {
		if (err) {
      return;
			//return next(err);
		}
    return callback();
	});
}
