const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = callback => {
    MongoClient.connect(
        "mongodb+srv://deepakdeedar:XAByB900ui9xX8q4@cluster0-dztfu.mongodb.net/shop?retryWrites=true&w=majority", { useUnifiedTopology: true }
      )
        .then(client => {
            console.log('Connected');
            _db = client.db();
            callback();
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
};

const getDb = () => {
    if(_db) {
        return _db;
    }
    throw "Database not found";
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

//fitik59519@tastrg.com
