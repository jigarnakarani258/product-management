const { Categorys } = require('../models/categoryModel')
const { messages } = require('../utility/messages');
const { AppError } = require('../utility/appError');

//addCategory API, Authenticated with Passport JS
const addCategory = async (req, res, next) => {

  try {
    const { hardware, connectivity, management } = req.body;

    //user id get from token
    let user_id = req.user._id

    let category = new Categorys({
      hardware,
      connectivity,
      management,
    });

    const categoryExist = await Categorys.find(
      {
        hardware,
        connectivity,
        management,
      }, { __v: 0 });

    if (!categoryExist) {
      return res.status(400).json({
        status: "fail",
        requestAt: req.requestTime,
        message: messages.category_already_exist
      });
    }

    category
      .save()
      .then(() => {
        return res.status(201).json({
          status: "success",
          requestAt: req.requestTime,
          data: {
            newcategory: {
              id: category._id,
              hardware: category?.hardware,
              connectivity: category?.connectivity,
              management: category?.management,
            },
          },
          message: messages.category_created_successfully
        });
      })
      .catch(err => {
        return next(new AppError(err, 401));
      });
  } catch (err) {
    return next(new AppError(err, 400));
  }

};

//getCategoryByID API , Authenticated with Passport JS
const getCategoryByID = async (req, res, next) => {

  try {
    //user id get from token
    const user_id = req.user._id

    let category_id = req.params.category_id
    let getcategory = await Categorys.findById(category_id)

    if (!getcategory) {
      return res.status(404).json({
        status: "Bad Request",
        requestAt: req.requestTime,
        errorCode: 404,
        message: messages.category_not_found_with_provided_id
      });
    }
    else {
      return res.status(200).send({
        status: "success",
        requestAt: req.requestTime,
        categoryInfo: getcategory,
        message: messages.fetch_category_info_successfully,
      });
    }
  } catch (err) {
    return next(new AppError(err, 400));
  }


};

//dropCategoryByID API , Authenticated with Passport JS
const dropCategoryByID = async (req, res, next) => {

  try {
    //user id get from token
    const user_id = req.user._id

    let category_id = req.params.category_id;

    let dropCategory = await Categorys.findByIdAndDelete(category_id, {
      new: true,
      runValidators: true,
    });

    if (!dropCategory) {
      return res.status(404).json({
        status: "Bad Request",
        requestAt: req.requestTime,
        errorCode: 404,
        message: messages.category_not_found_with_provided_id
      });
    }
    else {
      return res.status(200).send({
        status: "success",
        requestAt: req.requestTime,
        dropCategory: dropCategory,
        message: messages.category_deleted_successfully,
      });
    }
  } catch (err) {
    return next(new AppError(err, 400));
  }

};


//updateCategoryByID API , Authenticated with Passport JS
const updateCategoryByID = async (req, res, next) => {

  try {
    //acesss by admin-seller
    const id = req.user._id

    let category_id = req.params.category_id
    const { hardware, connectivity, management } = req.body;

    let updatecategorydata = {
      hardware: hardware, connectivity: connectivity, management: management
    }
    let updatedCategory = await Categorys.findByIdAndUpdate(category_id, updatecategorydata, {
      new: true,
      runValidators: true,
    });
    if (!updatedCategory) {
      return res.status(404).json({
        status: "Bad Request",
        requestAt: req.requestTime,
        errorCode: 404,
        message: messages.category_not_found_with_provided_id
      });
    }
    else {

      return res.status(200).json({
        status: "Success",
        requestAt: req.requestTime,
        updatedCategory: updatedCategory,
        message: messages.category_updated_successfully,
      });
    }
  }
  catch (err) {
    return next(new AppError(err, 400));
  }

};


module.exports = {
  addCategory,
  getCategoryByID,
  updateCategoryByID,
  dropCategoryByID
}

