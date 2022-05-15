const express = require("express");
const {
  getAllAccessories,
  getAdminAccessories,
  createAccessories,
  updateAccessories,
  deleteAccessories,
  getAccessoriesDetails,
} = require("../controllers/accessoriesController");

const router = express.Router();

router.route("/accessories").get(getAllAccessories);

router.route("/admin/accessories").get(getAdminAccessories);

router.route("/admin/accessory/new").post(createAccessories);

router
  .route("/admin/accessory/:id")
  .put(updateAccessories)
  .delete(deleteAccessories);

router.route("/accessory/:id").get(getAccessoriesDetails);

module.exports = router;
