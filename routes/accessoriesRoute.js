const express = require("express");
const {
  getAllAccessories,
  getAdminAccessories,
  createAccessories,
  updateAccessories,
  deleteAccessories,
  getAccessoriesDetails,
} = require("../controllers/accessoriesController");
const { AdminCheckMiddleWare } = require("../middleware/AdminMiddleWare");
const { AuthCheck } = require("../middleware/AuthMiddleWar");

const router = express.Router();

router.route("/accessories").get(getAllAccessories);

router.route("/admin/accessories").get(getAdminAccessories);

router
  .route("/admin/accessory/new")
  .post(AuthCheck, AdminCheckMiddleWare, createAccessories);

router
  .route("/admin/accessory/:id")
  .put(AuthCheck, AdminCheckMiddleWare, updateAccessories)
  .delete(AuthCheck, AdminCheckMiddleWare, deleteAccessories);

router.route("/accessory/:id").get(getAccessoriesDetails);

module.exports = router;
