/**Mongo db connection setup**/
var mongo = require('mongoskin');
var BSON = mongo.BSONPure;
var q = require('q');
var db;
var oplog;


/**Collection **/

var Collection = function (name) {
    var self = this;
    self.find = function (query, options) {
        var deferred = q.defer();
        if (query._id) query._id = new BSON.ObjectID(query._id);
        db.collection(name).find(query, options).toArray(function (err, result) {
            if (err) console.log("Error", err);
            deferred.resolve(result);
        });
        return deferred.promise;
    }
    self.findOne = function (query, options) {
        var deferred = q.defer();
        if (query._id) query._id = new BSON.ObjectID(query._id);
        db.collection(name).findOne(query, options, function (err, result) {
            if (err) console.log("Error", err);
            deferred.resolve(result);
        });
        return deferred.promise;
    }
    self.remove = function (query, options) {
        var deferred = q.defer();
        if (query._id) query._id = new BSON.ObjectID(query._id);
        db.collection(name).remove(query, options, function (err, result) {
            if (err) console.log("Error", err);
            deferred.resolve(result);
        });
        return deferred.promise;
    }
    self.update = function (query, options) {
        var deferred = q.defer();
        query._id = new BSON.ObjectID(query._id);
        db.collection(name).update(query, options, function (err, result) {
            if (err) console.log("Error", err);
            deferred.resolve(result);
        });
        return deferred.promise;
    }
    self.insert = function (query, options) {
        var deferred = q.defer();
        db.collection(name).insert(query, options, function (err, result) {
            if (err) console.log("Error", err);
            deferred.resolve(result);
        });
        return deferred.promise;
    }
    return self;
}
exports.setup = function (connection) {
    db = mongo.db(connection.uri, {w:1});
}
exports.setReactive = function (reactive, callback) {
    if (reactive) {
        oplog = db.collection("oplog.$main");
        var cursor = oplog.find({"ns":{$not:""}}, {tailable:true, awaitData:true});
        cursor.each(function (err, log) {
            if (err) console.log("Reactive Error", err);
            if (!err) console.log("Oplog", log);
        });
    }
}
exports.createCollection = function (name) {
    return Collection(name);
}