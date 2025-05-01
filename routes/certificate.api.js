const express = require("express");
const router = express.Router();
const certificateController = require("../controllers/certificate.controller");
const authController = require("../controllers/auth.controller"); 

router.post(
  "/",
  authController.authenticate,
  authController.checkAdminPermission,
  certificateController.createCertificate
);

router.get(
  "/all",
  authController.authenticate,
  authController.checkAdminPermission,
  certificateController.getAllCertificates
);

router.get("/", certificateController.getAllCertificates);
router.get("/:id", certificateController.getCertificateById);
router.put(
  "/:id",
  authController.authenticate,
  authController.checkAdminPermission,
  certificateController.updateCertificate
);
router.delete(
  "/:id",
  authController.authenticate,
  authController.checkAdminPermission,
  certificateController.deleteCertificate
);

module.exports = router;
