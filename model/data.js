const { MongoClient } = require("mongodb");
const client = new MongoClient("mongodb+srv://hieule2509:25092003@uwc.0sx5qbe.mongodb.net/?retryWrites=true&w=majority");

let dbConnection;

module.exports = {
  getDb: function () {
    dbConnection = client.db("uwc");
    if (!dbConnection) {
      console.log("Cannot connect to database.");
      return;
    }
    return dbConnection;
  },
};
