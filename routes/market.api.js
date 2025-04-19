const express = require("express");
const router = express.Router();
const marketController = require("../controllers/market.controller");
const authController = require("../controllers/auth.controller");

router.post("/", authController.authenticate, marketController.createItem);
router.get("/", marketController.getAllItems);
router.get("/:itemId", marketController.getItemById);
router.put(
  "/:itemId",
  authController.authenticate,
  marketController.updateItem
);
router.delete(
  "/:itemId",
  authController.authenticate,
  marketController.deleteItem
);

module.exports = router;
