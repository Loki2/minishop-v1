const express = require("express");


const router = express.Router();


router.get("/", (req, res) => {
  res.render("products", {
    title: "Shops",
  });
});


router.get("/:product_id", (req, res) => {
  res.render("product", {
    title: "Product Details",
  });
});


module.exports = router;