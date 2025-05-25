const express = require("express");
const { authenticated, authRoles } = require("../middleware/authHandler");


const router = express.Router();


router.get("/", authenticated, (req, res) => {
  res.render("admin/index", {
    title: "Admin Dashboard",
  });
});

router.get("/products", authenticated, (req, res) => {
  res.render("admin/products/index", {
    title: "Admin Products Management",
  });
});


router.get("/products/create-product", authenticated, (req, res) => {
  res.render("admin/products/create", {
    title: "Create Product",
  });
})





module.exports = router;