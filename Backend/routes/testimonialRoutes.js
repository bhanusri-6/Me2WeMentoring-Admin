const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const {
  getTestimonials,
  getActiveTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require("../controllers/testimonialController");

// ===============================
// UPLOAD DIRECTORY
// ===============================

const uploadDir = path.join(
  __dirname,
  "../uploads/testimonials"
);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

// ===============================
// MULTER CONFIG
// ===============================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// ===============================
// ROUTES
// ===============================

// GET ALL
router.get("/", getTestimonials);

// GET ACTIVE
router.get("/active", getActiveTestimonials);

// CREATE
router.post(
  "/",
  upload.single("image"),
  createTestimonial
);

// UPDATE
router.put(
  "/:id",
  upload.single("image"),
  updateTestimonial
);

// DELETE
router.delete(
  "/:id",
  deleteTestimonial
);

module.exports = router;