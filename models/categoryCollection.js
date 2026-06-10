// models/categoryCollection.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {

        // categoryCreate
        name: {
            type: String,
            required: true,
            trim: true
        },
        slug: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        }

        // end
    },
    { timestamps: true } // auto adds: createdAt, updatedAt
);

// category + s : is collection name
module.exports = mongoose.model('category', categorySchema); 
