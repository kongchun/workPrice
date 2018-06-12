var db = require('./db.js');
var mongodb = require("mongodb");

exports.updateCompanyPosition = function(company) {
	db.close();
	var query = {};
	try{
		query = {'_id': new mongodb.ObjectId(company['_id'])};
	}catch(error){
		console.error(error);
		query = {'_id': company['_id']};
	}
	return db.open("repertory_company").then(function(collection) {
		return collection.update({
			'_id': query['_id']
		}, {
			'$set': {
				'position': company['position'],
				'bdstatus': '1',
				'district': company['district'],
				'city': company['city'],
			}
		});
	}).then(function(data) {
		db.close();
		return data;
	}).catch(function(error) {
		db.close();
		console.error(error)
		throw error;
	})
	
};