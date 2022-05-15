const express = require("express");
const {
  getAdminUnits,
  createUnit,
  updateUnit,
  deleteUnit,
} = require("../controllers/unitPriceController");
const { AdminCheckMiddleWare } = require("../middleware/AdminMiddleWare");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { AuthCheck } = require("../middleware/AuthMiddleWar");

const router = express.Router();

router.route("/admin/units").get(getAdminUnits);

router.route("/admin/unit/new").post(createUnit);

router.route("/admin/unit/:id").put(updateUnit).delete(deleteUnit);

module.exports = router;
