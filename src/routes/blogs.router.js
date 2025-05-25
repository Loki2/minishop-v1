const express = require("express");


const router = express.Router();


router.get("/", (req, res) => {
  res.render("blogs", {
    title: "Blogs",
  });
});




module.exports = router;