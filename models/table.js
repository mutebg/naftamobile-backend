var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TableModel = mongoose.model('table', new Schema({
	id: mongoose.Schema.ObjectId,
	position: Number,
	team: { type: String, required: true},
	games: Number,
	points: Number,
	ga: String,
}));

module.exports.list = function(callback ) {
	TableModel
		.find()
    .sort('position')
		.exec( function(err, list ){
			if ( err ) {
        return;
				//throw err
			}

			return callback(list);
		});
}

module.exports.deleteAll = function( callback ) {
	TableModel.remove({}, function(err){
		return callback();
	})
}

module.exports.insert = function(data, callback ) {
	TableModel.create(data, function(err, data, next) {
		if (err) {
      //throw err;
			return
		}
    return callback();
	});
}
