const express = require("express");
const app = express();
require('dotenv').config(); // npm install dotenv
const cors = require('cors');
const ConnectDB = require("./config/db.js");


ConnectDB();
app.use(express.json());
app.use(cors()); // add this — before routes: npm install cors

// Routes
const productApi = require('./routes/productRoutes.js');
app.use('/api/products', productApi);
 

app.get("/", (req, res) => {
  res.send("Hello from Express.js!");
});



// start server 
app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
});