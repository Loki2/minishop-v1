const express = require("express");
const { authenticated, authRoles } = require("../middleware/authHandler");

const { get_products, get_createProduct, post_createProduct } = require("../controllers/product.controller");


const router = express.Router();


router.get("/", authenticated, get_products);

router.get("/products", authenticated, (req, res) => {
  res.render("admin/products/index", {
    title: "Admin Products Management",
  });
});


router.get("/products/create-product", authenticated, get_createProduct)
router.post("/products/create-product", authenticated, post_createProduct)





module.exports = router;