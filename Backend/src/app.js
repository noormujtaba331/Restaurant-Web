const express = require("express");
const app = express();
const multer = require("multer"); 
const Product_Model = require("./models/product.model");
const dotenv = require("dotenv");
const uploadToImageKit  = require("./services/imagekit.services");
const dbConnect = require("./db/db");
const cors = require("cors");
const Order_Model = require("./models/order.model");

app.use(cors());
dotenv.config();
dbConnect();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// --- CREATE PRODUCT - FIXED ---
app.post("/products", upload.single("image"), async (req, res) => {
  try {
    console.log("Form Text Body:", req.body);
    console.log("Uploaded File:", req.file?.originalname);

    let imageUrl = "";
    if (req.file) {
      imageUrl = await uploadToImageKit(req.file.buffer , req.file.originalname);
    }

    const product = await Product_Model.create({
      name: req.body.name,
      details: req.body.details || req.body.description, // details handle karo
      price: Number(req.body.price) || 0,
      category: req.body.category,
      image: imageUrl,
      // YE LINES MISSING THI - ISI WAJAH SE PRICE CHANGE NAHI HO RAHI THI
      sizes: req.body.sizes || "Regular",
      SPrice: Number(req.body.SPrice) || 0,
      MPrice: Number(req.body.MPrice) || 0,
      LPrice: Number(req.body.LPrice) || 0,
    });

    res.status(201).json({
      message: "Product created successfully!",
      product,
    });

  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

app.get("/products", async (req, res) => {
  try {
    const products = await Product_Model.find();
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/products/:id", async (req, res) => {
  try {
    const product = await Product_Model.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted successfully!", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- UPDATE PRODUCT - FIXED ---
app.patch("/products/:_id", upload.single("image"), async (req, res) => {
  try {
    console.log("Update Body:", req.body);
    const updateData = {
      name: req.body.name,
      details: req.body.details || req.body.description,
      price: Number(req.body.price),
      category: req.body.category,
      sizes: req.body.sizes,
      SPrice: Number(req.body.SPrice),
      MPrice: Number(req.body.MPrice),
      LPrice: Number(req.body.LPrice),
    };

    if (req.file) {
      updateData.image = await uploadToImageKit(req.file.buffer, req.file.originalname);
    }

    const product = await Product_Model.findByIdAndUpdate(req.params._id, updateData, { new: true });
    res.status(200).json({ message: "Product updated successfully!", product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

app.post("/orders", async (req, res) => {
  try {
    const orderData = req.body;
    const order = await Order_Model.create(orderData);
    res.status(201).json({ message: "Order created successfully!", order });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/orders", async (req, res) => {
  try {
    const orders = await Order_Model.find();
    res.status(200).json({ orders });
  } catch (error) {
    console.log(error);
  }
});

app.patch('/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const updatedOrder = await Order_Model.findOneAndUpdate(
      { orderId: orderId },
      { status: status },
      { new: true, runValidators: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/orders', async (req, res) => {
    try {
        await Order_Model.deleteMany({}); 
        res.status(200).json({ message: "All orders cleared successfully from database" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = app;