var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NewsModel = mongoose.model('news', new Schema({
	id: mongoose.Schema.ObjectId,
	title: { type: String, required: true},
	text: String,
	image: String,
	link: { type: String, required: true, unique : true},
	datetime: { type: Date, default: Date.now }
}));

module.exports.list = function(start, limit, callback ) {
	NewsModel
		.find()
    .select('_id title image datetime')
		.sort('-datetime')
		.exec( function(err, list ){
			if ( err ) {
        return;
				//throw err
			}

			return callback(list);
		});
}

module.exports.item = function(id, callback) {
	NewsModel.findOne( {_id: id}, function(err, news){
		if ( err ) {
      return;
			throw err;
		}
		return callback(news);
	});
}

module.exports.insert = function(data, callback ) {
	NewsModel.create(data, function(err, data, next) {
		if (err) {
      return;
			//return next(err);
		}
    return callback();
	});
}
