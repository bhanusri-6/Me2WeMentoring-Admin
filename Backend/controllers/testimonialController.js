const db = require("../config/db");

// GET ALL TESTIMONIALS
const getTestimonials = (req, res) => {
  const sql = `
    SELECT *
    FROM testimonials
    ORDER BY created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Get testimonials error:", err);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch testimonials",
      });
    }

    res.status(200).json({
      success: true,
      data: results,
    });
  });
};


// GET ACTIVE TESTIMONIALS
const getActiveTestimonials = (req, res) => {
  const sql = `
    SELECT *
    FROM testimonials
    WHERE status = 'Active'
    ORDER BY created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Get active testimonials error:", err);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch active testimonials",
      });
    }

    res.status(200).json({
      success: true,
      data: results,
    });
  });
};


// CREATE TESTIMONIAL
const createTestimonial = (req, res) => {
  const {
    name,
    designation,
    review,
    rating,
    status,
  } = req.body;

  const image = req.file
    ? `/uploads/testimonials/${req.file.filename}`
    : null;

  if (!name || !designation || !review) {
    return res.status(400).json({
      success: false,
      message: "Name, designation and review are required",
    });
  }

  const sql = `
    INSERT INTO testimonials
    (
      name,
      designation,
      review,
      rating,
      image,
      status
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const values = [
    name,
    designation,
    review,
    rating || 5,
    image,
    status || "Active",
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Create testimonial error:", err);

      return res.status(500).json({
        success: false,
        message: "Failed to create testimonial",
      });
    }

    res.status(201).json({
      success: true,
      message: "Testimonial created successfully",
      data: {
        id: result.insertId,
        name,
        designation,
        review,
        rating: rating || 5,
        image,
        status: status || "Active",
      },
    });
  });
};


// UPDATE TESTIMONIAL
const updateTestimonial = (req, res) => {
  const { id } = req.params;

  const {
    name,
    designation,
    review,
    rating,
    status,
  } = req.body;

  // If new image uploaded
  const newImage = req.file
    ? `/uploads/testimonials/${req.file.filename}`
    : null;

  if (!name || !designation || !review) {
    return res.status(400).json({
      success: false,
      message: "Name, designation and review are required",
    });
  }

  let sql;
  let values;

  if (newImage) {
    sql = `
      UPDATE testimonials
      SET
        name = ?,
        designation = ?,
        review = ?,
        rating = ?,
        image = ?,
        status = ?
      WHERE id = ?
    `;

    values = [
      name,
      designation,
      review,
      rating,
      newImage,
      status,
      id,
    ];
  } else {
    sql = `
      UPDATE testimonials
      SET
        name = ?,
        designation = ?,
        review = ?,
        rating = ?,
        status = ?
      WHERE id = ?
    `;

    values = [
      name,
      designation,
      review,
      rating,
      status,
      id,
    ];
  }

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Update testimonial error:", err);

      return res.status(500).json({
        success: false,
        message: "Failed to update testimonial",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Testimonial updated successfully",
    });
  });
};


// DELETE TESTIMONIAL
const deleteTestimonial = (req, res) => {
  const { id } = req.params;

  const sql = `
    DELETE FROM testimonials
    WHERE id = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Delete testimonial error:", err);

      return res.status(500).json({
        success: false,
        message: "Failed to delete testimonial",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Testimonial deleted successfully",
    });
  });
};


module.exports = {
  getTestimonials,
  getActiveTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};