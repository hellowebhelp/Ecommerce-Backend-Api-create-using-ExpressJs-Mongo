// models/productCollection.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {

        // ProductCreate
        
        name: {
            type: String,
            required: true,
            trim: true
        },
        category: {
            type: String,
            required: true,
            trim: true
        },
        price: {
            type: Number,
            required: true
        },
        stock: {
            type: Number,
            required: true,
            default: 0
        }
        // end
    },
    { timestamps: true } // auto adds: createdAt, updatedAt
);

// Product + s : is collection name
module.exports = mongoose.model('Product', productSchema); 
