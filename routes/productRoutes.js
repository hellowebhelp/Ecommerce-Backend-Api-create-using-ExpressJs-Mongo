const express = require('express');
const router = express.Router();
const Product = require('../models/productCollection');
const category = require('../models/categoryCollection');
const mongoose = require('mongoose');

// BACKEND
// ✅ CREATE PRODUCT - ALL SET!
router.post('/create', async (req, res) => {
  try {
    const { name, category, price, stock } = req.body;

    if (!name || !category || price == null) {
      return res.status(400).json({
        success: false,
        message: 'Name, category, and price are required'
      });
    }

    const productData = new Product({
      name,
      category,
      price,
      stock: stock || 0
    });

    const savedProduct = await productData.save();

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: savedProduct
    });

  } catch (error) {
    console.log(error); // ✅ what does this print in terminal?
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }
    res.status(500).json({ success: false, message: error.message }); // ✅ changed this
  }
});


/**
 * ✅ GET ALL PRODUCTS "pagination" WAY
 * /api/products/all?page=2&limit=10
 * /api/products/all?cat=electronics
 */

router.get('/all', async (req, res) => {
  try {
    const maxLimit = 100;
    const defaultLimit = 20;
    const defaultPage = 1;

    // Pagination
    let page = parseInt(req.query.page) || defaultPage;
    if (page < 1) page = defaultPage;

    let limit = parseInt(req.query.limit) || defaultLimit;
    if (limit > maxLimit) limit = maxLimit;
    if (limit < 1) limit = defaultLimit;

    const skip = (page - 1) * limit;

    // Build filter
    let query = {};

    // Filter by category
    if (req.query.cat) {
      query.category = req.query.cat;
    }

    // Get total count
    const total = await Product.countDocuments(query);

    // Fetch products
    const productsData = await Product
      .find(query)
      .select('_id name price category stock image')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: productsData,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages
      }
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products'
    });
  }
});


/**
 * ✅ Delete single product by ID
 * # Delete single product
 * DELETE http://localhost:5000/api/products/507f1f77bcf86cd799439011
 */

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: deletedProduct
    });

  } catch (error) {
    console.error('Delete error:', error);  // ADD HERE
    res.status(500).json({
      success: false,
      message: 'Failed to delete product'
    });
  }
});


// ✅ UPDATE SINGLE PRODUCT
router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, stock } = req.body;

    // ✅ Validate String ID (not ObjectId)
    if (!id || id.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    // ✅ At least one field should be provided
    if (!name && !category && price == null && stock == null) {
      return res.status(400).json({
        success: false,
        message: 'At least one field (name, category, price, or stock) is required'
      });
    }

    // ✅ Build update object (only include provided fields)
    const updateData = {};
    if (name) updateData.name = name;
    if (category) updateData.category = category;
    if (price != null) updateData.price = price;
    if (stock != null) updateData.stock = stock;

    // ✅ Find and update
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }  // new: true returns updated doc
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });

  } catch (error) {
    console.log(error);  // ✅ logs error to terminal
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ======================FRONT-END============================
// ✅ Get single product by slug
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error('Fetch product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product'
    });
  }
});

// example route
// router.get('/create', (req, res) => {
//   res.json({
//     success: true,
//     message: "API working",
//     data: {
//       name: "Asit",
//       role: "developer"
//     }
//   });
// });

module.exports = router;

