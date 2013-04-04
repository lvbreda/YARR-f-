/*
 connection
 {
 type: mongodb/mysql,
 reactive: true/false,
 details : {}/""
 }
 */
var _connection;
var _callback = function (name, result) {
    _communicator.fireListeners(name, result);
};
var db;

exports.init = function (connection) {
    _connection = connection;
}
exports.connection = _connection;


exports.createDB = function (connection) {
    _connection = connection ? connection : _connection;
    var self = this;
    db = require('./lib/' + _connection.type);
    db.setup(_connection.details);

    if (_connection.reactive) {
        db.setReactive(_connection.reactive, _connection.details);
    }
    return db;
}

