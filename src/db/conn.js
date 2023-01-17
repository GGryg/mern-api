const { MongoClient } = require('mongodb');
const Db = process.env.MONGO_URI;

console.log(Db);

const client = new MongoClient(Db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let dbConnection;

module.exports = {
    connectToServer: (callback) => {
        client.connect((err, db) => {
            if(err || !db){
                return callback(err);
            }

            dbConnection = db.db('products');
            console.log('Successfully connected to MongoDB');

            return callback();
        });
    },

    getDb: () => {
        return dbConnection;
    }
};