
let messages = {}

// Authentication Middleware 
messages.roletype_not_found = "User role type not found"

// user module
messages.email_already_exist = "This email already exists.!!"
messages.user_registered_successfully = "Customer has been registered successfully"
messages.provide_email = "Please provide email."
messages.provide_password = "Please provide password."
messages.invalid_email = "Invalid User, Please enter valid user email!"
messages.invalid_password = "Invalid password , Please enter valid user password!"
messages.user_login_successfully = "User SignIn successfully!!"
messages.user_not_found_with_provided_id = "No user found with that id!"
messages.user_get_successfully = "Get current user profile successfully!!"
messages.user_not_found_with_provided_id = "No user found with that id!"
messages.user_update_successfully = "User profile updated successfully!!"
messages.user_is_not_active= "User is not Active."
messages.enter_valid_value_of_user = "please enter valid value of user"

// product module
messages.product_already_addded_by_seller= "This Product is already added by this product_seller successfully"
messages.product_added_successfully = "Product has been added successfully"
messages.product_updated_successfully = "Product has been updated successfully"
messages.product_deleted_successfully = "Product has been deleted successfully"
messages.product_get_successfully = "Retrive Product info successfully"
messages.product_is_now_not_available = "Product is not-availble now due to out of stock "
messages.product_is_now_available = "Product is availble now ."
messages.product_not_found_with_provided_id = "Product is not found with provided product_id "
messages.enter_valid_value_of_product = "please enter valid value of product"

// category module
messages.category_already_exist= "This category is already exist"
messages.category_created_successfully = "Category has been added successfully"
messages.category_updated_successfully = "Category has been updated successfully"
messages.category_deleted_successfully = "Category has been deleted successfully"
messages.category_is_now_not_available = "Category is not-availble now due to out of stock "
messages.fetch_category_info_successfully = "Retrive Category info successfully."
messages.category_not_found_with_provided_id = "Category is not found with provided category_id "
messages.enter_valid_value_of_category = "please enter valid value of category"

//pagination 
messages.enter_valid_value_for_pagination = "Please Enter valid(Greater then Zero) value for the page and limit query parameter."

module.exports.messages = messages