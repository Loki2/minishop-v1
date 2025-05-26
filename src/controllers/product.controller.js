const Product = require("../models/product");
const mkdirp = require("mkdirp");


exports.get_products = async (req, res, next) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 })

    res.render('admin/products/index', {
      products: products
    })
  } catch (error) {
    next(error)
  }
}

exports.get_createProduct = async (req, res, next) => {
  try {
    res.render('admin/products/create', {
      title: "Create Product",
    })
  } catch (error) {
    next(error);
  }
}

exports.post_createProduct = async (req, res, next) => {
  try {
    const user = res.locals.user;
    const imageFile = typeof req.files.productImage !== 'undefined' ? req.files.productImage.name : "";
    const { code, name, desc, category, stock_available, status } = req.body;

    console.log(`req.body: ${JSON.stringify(req.body)}`);
    console.log(`imageFile: ${imageFile}`);

    console.log(`first`, user._id)

    const product = new Product({
      code: code,
      name: name,
      desc: desc,
      image: imageFile,
      category: category,
      stock_available: stock_available,
      status: status,
      createdBy: user._id,
    });


    await product.save(function (error) {
      if (error) return console.error(error);

      mkdirp.sync('./public/uploads/images/products/' + product._id);

      mkdirp.sync('./public/uploads/images/products/' + product._id + '/gallery');

      if (imageFile != "") {
        const productImage = req.files.productImage;
        const path = './public/uploads/images/products/' + product._id + '/' + imageFile;

        productImage.mv(path, function (error) {
          return console.log(error)
        });
      }
    });

    res.redirect('/admin/products');
  } catch (error) {
    next(error);
  }
}

exports.get_viewProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    const service = await Service.findById({ _id: product.category });

    res.render('admin/product/view', {
      code: product.code,
      name_lao: product.name_lao,
      name_eng: product.name_eng,
      desc: product.desc,
      image: product.image,
      category: service.name_eng,
    })
  } catch (error) {
    next(error);
  }
}

exports.get_updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    const services = await Service.find();

    res.render('admin/product/edit', {
      id: product._id,
      services: services,
      code: product.code,
      name_lao: product.name_lao,
      name_eng: product.name_eng,
      desc: product.desc,
      image: product.image,
      status: product.status
    }); 0
  } catch (error) {
    next(error)
  }
}

exports.post_updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    await Product.update({ _id: id }, req.body);

    res.redirect('/admin/products')
  } catch (error) {
    next(error)
  }
}

exports.get_deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    await Product.findByIdAndRemove(id);

    res.redirect('/admin/products')
  } catch (error) {
    next(error);
  }
}