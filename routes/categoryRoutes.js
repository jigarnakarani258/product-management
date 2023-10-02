const express = require('express');
const {
  addCategory,
  getCategoryByID,
  updateCategoryByID,
  dropCategoryByID
} = require('../controllers/categoryController')
const passport = require('passport');
const { checkUserPermission } = require('../middlewares/RoleBasedUserPermission');
const categoryRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Category Management
 *     description: Category management related APIs 
 */

/**
 * @swagger
 * /addCategory:
 *   post:
 *     tags:
 *       - Category Management
 *     summary: Add categories
 *     description: Add categories with the provided details.
 *     security:
 *       - jwt: []  # Requires JWT token authentication
 *     parameters:
 *      - in: body
 *        name: createOrder 
 *        schema:
 *          type: object
 *          properties:
 *            hardware:
 *              type: object
 *              description: Details of the hardware category.
 *              properties:
 *                name:
 *                  type: string
 *                  description: The name of the hardware category.
 *                description:
 *                  type: string
 *                  description: The description of the hardware category.
 *            connectivity:
 *              type: object
 *              description: Details of the connectivity category.
 *              properties:
 *                name:
 *                  type: string
 *                  description: The name of the connectivity category.
 *                description:
 *                  type: string
 *                  description: The description of the connectivity category.
 *            management:
 *              type: object
 *              description: Details of the management category.
 *              properties:
 *                name:
 *                  type: string
 *                  description: The name of the management category.
 *                description:
 *                  type: string
 *                  description: The description of the management category.
 *     responses:
 *       201:
 *         description: Categories added successfully
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - JWT token not provided or invalid.
 *       500:
 *         description: Internal Server Error
 */
categoryRouter.route('/addCategory')
  .post(passport.authenticate("jwt", { session: false }), checkUserPermission, addCategory)


/**
 * @swagger
 * /getCategoryByID/{category_id}:
 *   get:
 *     tags:
 *       - Category Management
 *     summary: Get a category by ID
 *     description: Retrieve a category by its unique ID.
 *     security:
 *       - jwt: []  # Requires JWT token authentication
 *     parameters:
 *       - name: category_id
 *         in: path
 *         description: The ID of the category to retrieve.
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       401:
 *         description: Unauthorized - JWT token not provided or invalid.
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal Server Error
 */
categoryRouter.route("/getCategoryByID/:category_id")
  .get(passport.authenticate("jwt", { session: false }), checkUserPermission, getCategoryByID);

/**
 * @swagger
 * /dropCategoryByID/{category_id}:
 *   delete:
 *     tags:
 *       - Category Management
 *     summary: Delete a category by ID
 *     description: Delete a category by its unique ID.
 *     security:
 *       - jwt: []  # Requires JWT token authentication
 *     parameters:
 *       - name: category_id
 *         in: path
 *         description: The ID of the category to delete.
 *         required: true
 *         type: string
 *     responses:
 *       204:
 *         description: Category deleted successfully
 *       401:
 *         description: Unauthorized - JWT token not provided or invalid.
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal Server Error
 */
categoryRouter.route("/dropCategoryByID/:category_id")
  .delete(passport.authenticate("jwt", { session: false }), checkUserPermission, dropCategoryByID);

/**
 * @swagger
 * /updateCategoryByID/{category_id}:
 *   put:
 *     tags:
 *       - Category Management
 *     summary: Update a category by ID
 *     description: Update the details of a category by its unique ID.
 *     security:
 *       - jwt: []  # Requires JWT token authentication
 *     parameters:
 *       - name: category_id
 *         in: path
 *         description: The ID of the category to update.
 *         required: true
 *         type: string
 *       - in: body
 *         name: createOrder 
 *         schema:
 *           type: object
 *           properties:
 *             hardware:
 *               type: object
 *               description: Details of the hardware category.
 *               properties:
 *                 name:
 *                   type: string
 *                   description: The name of the hardware category.
 *                 description:
 *                   type: string
 *                   description: The description of the hardware category.
 *             connectivity:
 *               type: object
 *               description: Details of the connectivity category.
 *               properties:
 *                 name:
 *                   type: string
 *                   description: The name of the connectivity category.
 *                 description:
 *                   type: string
 *                   description: The description of the connectivity category.
 *             management:
 *               type: object
 *               description: Details of the management category.
 *               properties:
 *                 name:
 *                   type: string
 *                   description: The name of the management category.
 *                 description:
 *                   type: string
 *                   description: The description of the management category.
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       400:
 *         description: Bad request - Invalid input data
 *       404:
 *         description: Category not found
 *       401:
 *         description: Unauthorized - JWT token not provided or invalid.
 */
categoryRouter.route("/updateCategoryByID/:category_id")
  .put(passport.authenticate("jwt", { session: false }), checkUserPermission, updateCategoryByID);


module.exports.categoryRouter = categoryRouter