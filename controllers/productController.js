const { Products } = require('../models/productModel')
const { messages } = require('../utility/messages');
const { AppError } = require('../utility/appError');

//create Product API, Authenticated with Passport JS
const addProduct = async (req, res, next) => {

  try {
    const { product_name, product_brand, product_price, product_category, sort_order } = req.body;

    //product_seller id get from token
    let product_seller = req.user._id

    if (product_name == "string" || product_brand == "string" || product_price <= 0 ||
      product_category == "string" || sort_order <= 0) {
      return res.status(400).json({
        status: "Bad Request",
        requestAt: req.requestTime,
        errorCode: 400,
        message: messages.enter_valid_value_of_product
      });
    }

    let product = new Products({
      product_name,
      product_brand,
      product_price,
      product_category,
      sort_order,
      product_seller
    });


    const ValidProduct = await Products.findOne({ product_name: product_name, product_seller: product_seller });
    if (ValidProduct) {
      return res.status(400).json({
        status: "Bad Request",
        requestAt: req.requestTime,
        errorCode: 400,
        message: messages.product_already_addded_by_seller
      });
    }

    product
      .save()
      .then(() => {
        return res.status(201).json({
          status: "success",
          requestAt: req.requestTime,
          data: {
            newProduct: {
              id: product._id,
              product_name: product.product_name,
              product_brand: product.product_brand,
              product_price: product.product_price,
              product_category: product.product_category,
              product_seller: product.product_seller,
              sort_order: product.sort_order
            },
          },
          message: messages.product_added_successfully
        });
      })
      .catch(err => {
        return next(new AppError(err, 401));
      });
  } catch (err) {
    return next(new AppError(err, 401));
  }


};

//getProductByID API , Authenticated with Passport JS
const getProductByID = async (req, res, next) => {

  try {
    //user id get from token
    const user_id = req.user._id

    let product_id = req.params.product_id
    let getProduct = await Products.findById(product_id)

    if (!getProduct) {
      return res.status(404).json({
        status: "Bad Request",
        requestAt: req.requestTime,
        errorCode: 404,
        message: messages.product_not_found_with_provided_id
      });
    }
    else {
      return res.status(200).send({
        status: "success",
        requestAt: req.requestTime,
        product: getProduct,
        message: messages.product_get_successfully,
      });
    }
  } catch (err) {
    return next(new AppError(err, 400));
  }


};

//updateProductByID API , Authenticated with Passport JS
const updateProductByID = async (req, res, next) => {

  try {
    const id = req.user._id

    let product_id = req.params.product_id
    let { product_name, product_brand, product_price, product_category, product_seller, sort_order } = req.body;

    if (product_name == "string" || product_brand == "string" || product_price <= 0 ||
      product_category == "string" || product_seller == "string" || sort_order <= 0) {
      return res.status(400).json({
        status: "Bad Request",
        requestAt: req.requestTime,
        errorCode: 400,
        message: messages.enter_valid_value_of_product
      });
    }

    let updateProductData = {
      product_name: product_name,
      product_brand: product_brand,
      product_price: product_price,
      product_category: product_category,
      product_seller: product_seller,
      sort_order: sort_order
    }

    let updatedProduct = await Products.findByIdAndUpdate(product_id, updateProductData, {
      new: true,
      runValidators: true,
    });
    if (!updatedProduct) {
      return res.status(404).json({
        status: "Bad Request",
        requestAt: req.requestTime,
        errorCode: 404,
        message: messages.product_not_found_with_provided_id
      });
    }
    else {
      return res.status(200).json({
        status: "Success",
        requestAt: req.requestTime,
        updatedProduct: updatedProduct,
        message: messages.product_updated_successfully,
      });
    }
  }
  catch (err) {
    return next(new AppError(err, 400));
  }

};

//setProductAvailabilityByID API , Authenticated with Passport JS
const setProductAvailabilityByID = async (req, res, next) => {

  try {
    const id = req.user._id

    let product_id = req.params.product_id
    let { is_available } = req.body;

    let updatedProduct = await Products.findByIdAndUpdate(product_id, { is_available: is_available }, {
      new: true,
      runValidators: true,
    });
    if (!updatedProduct) {
      return res.status(404).json({
        status: "Bad Request",
        requestAt: req.requestTime,
        errorCode: 404,
        message: messages.product_not_found_with_provided_id
      });
    }
    else {
      return res.status(200).json({
        status: "Success",
        requestAt: req.requestTime,
        updatedProduct: updatedProduct,
        message: is_available ? messages.product_is_now_available : messages.product_is_now_not_available,
      });
    }
  }
  catch (err) {
    return next(new AppError(err, 400));
  }


};

//deleteProductByID API , Authenticated with Passport JS
const deleteProductByID = async (req, res, next) => {

  try {
    //user id get from token
    const user_id = req.user._id

    let product_id = req.params.product_id
    let deleteProduct = await Products.findByIdAndDelete(product_id)

    if (!deleteProduct) {
      return res.status(404).json({
        status: "Bad Request",
        requestAt: req.requestTime,
        errorCode: 404,
        message: messages.product_not_found_with_provided_id
      });
    }
    else {
      return res.status(200).send({
        status: "success",
        requestAt: req.requestTime,
        Product_id: deleteProduct._id,
        message: messages.product_deleted_successfully,
      });
    }
  } catch (err) {
    return next(new AppError(err, 400));
  }

};

//getAllProductList API , Authenticated with Passport JS
const getAllProductList = async (req, res, next) => {
  try {
    const { product_category, price_range, product_name, sort_order } = req.query;
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    if (page <= 0 || limit <= 0) {
      return res.status(401).json({
        status: "Bad Request",
        requestAt: req.requestTime,
        errorCode: 400,
        message: messages.enter_valid_value_for_pagination
      });
    }

    // create the filter criteria based on query request parameters
    const filter = {};
    if (product_category) {
      filter.product_category = product_category;
    }
    if (price_range) {
      const [minPrice, maxPrice] = price_range.split('-');  //sample price_range = 10-90000
      filter.product_price = { $gte: minPrice, $lte: maxPrice };
    }
    if (product_name) {
      filter.product_name = { $regex: new RegExp(product_name, 'i') };
    }
    if (sort_order) {
      filter.sort_order = sort_order;
    }
    const skip = (page - 1) * limit;

    // Query into mongoDB with filtering and pagination
    const productList = await Products.find(filter, { __v: 0 })
      .sort({ sort_order: 1 })
      .skip(skip)
      .limit(limit);

    const totalResults = await Products.countDocuments(filter);

    return res.status(200).send({
      status: "success",
      requestAt: req.requestTime,
      NoResults: productList.length,
      totalResults,
      data: {
        products: productList,
      },
    });
  } catch (err) {
    return next(new AppError(err, 400));
  }
};

module.exports = {
  addProduct,
  getProductByID,
  updateProductByID,
  deleteProductByID,
  setProductAvailabilityByID,
  getAllProductList
}

