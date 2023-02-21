const mongoose = require('mongoose');

const mongoUser= "nicomassa";
const mongoPass = "pd4W7kAWS82D5cxL";
const dataBase = "ecommerce";
const mongoDbConfig = `mongodb+srv://${mongoUser}:${mongoPass}@cluster0.q77nmf6.mongodb.net/${dataBase}`;

module.exports {mongoDbConfig}