// config/db.js
const mongoose = require('mongoose');
const Collection = require('../models/productCollection'); //for indexes dropped 
const Category = require('../models/categoryCollection'); //for indexes dropped 
const ConnectDB = async () => {

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");

        // ✅ why dropIndexes: It goes into MongoDB and physically deletes that old fields index from the database so it stops blocking same fields
        try {
            await Collection.collection.dropIndexes();
            await Category.collection.dropIndexes();
            console.log('✅ All indexes dropped');
        } catch (err) {
            console.log('❌ Index Error:', err.message);
        }

    } catch (error) {
        console.error(error.message);
        process.exit(1);
        // console.log("not connect");
    }
};

module.exports = ConnectDB;