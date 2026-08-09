const express = require("express");
const router = express.Router();
const db = require("../config/db");
const multer = require("multer");
const path = require("path");

// =========================
// MULTER CONFIG
// =========================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
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

const upload = multer({
  storage,
});

// =========================
// GET ALL THERAPIES
// =========================

router.get("/", (req, res) => {
  const query = `
    SELECT *
    FROM therapies
    ORDER BY id DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Fetch therapies error:", err);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch therapies",
      });
    }

    res.json({
      success: true,
      data: results,
    });
  });
});

// =========================
// GET SINGLE THERAPY + PROGRAMS
// =========================

router.get("/:id", (req, res) => {
  const therapyId = req.params.id;

  const therapyQuery = `
    SELECT *
    FROM therapies
    WHERE id = ?
  `;

  db.query(
    therapyQuery,
    [therapyId],
    (err, therapyResults) => {
      if (err) {
        console.error(
          "Fetch therapy error:",
          err
        );

        return res.status(500).json({
          success: false,
          message: "Failed to fetch therapy",
        });
      }

      if (therapyResults.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Therapy not found",
        });
      }

      const therapy = therapyResults[0];

      const programQuery = `
        SELECT
          id,
          program_number,
          program_title,
          program_description,
          youtube_link,
          sort_order
        FROM therapy_programs
        WHERE therapy_id = ?
        ORDER BY program_number ASC
      `;

      db.query(
        programQuery,
        [therapyId],
        (err, programs) => {
          if (err) {
            console.error(
              "Fetch programs error:",
              err
            );

            return res.status(500).json({
              success: false,
              message: "Failed to fetch programs",
            });
          }

          res.json({
            success: true,
            data: {
              ...therapy,
              programs,
            },
          });
        }
      );
    }
  );
});

// =========================
// CREATE THERAPY
// =========================

router.post(
  "/",
  upload.single("thumbnail"),
  (req, res) => {

    const {
      title,
      tagline,
      description,
      programs,
    } = req.body;

    console.log("Received title:", title);
    console.log("Received programs:", programs);
    console.log("Received file:", req.file);

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Therapy title is required",
      });
    }

    // =========================
    // IMAGE PATH
    // =========================

    const thumbnail = req.file
      ? `/uploads/${req.file.filename}`
      : "";

    // =========================
    // PARSE PROGRAMS
    // =========================

    let parsedPrograms = [];

    try {
      parsedPrograms = JSON.parse(
        programs || "[]"
      );
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid programs data",
      });
    }

    // =========================
    // INSERT THERAPY
    // =========================

    const therapyQuery = `
      INSERT INTO therapies
      (
        title,
        tagline,
        description,
        thumbnail
      )
      VALUES (?, ?, ?, ?)
    `;

    db.query(
      therapyQuery,
      [
        title,
        tagline || "",
        description || "",
        thumbnail,
      ],
      (err, result) => {

        if (err) {
          console.error(
            "Therapy insert error:",
            err
          );

          return res.status(500).json({
            success: false,
            message: "Failed to create therapy",
            error: err.message,
          });
        }

        const therapyId = result.insertId;

        console.log(
          "Therapy created:",
          therapyId
        );

        // =========================
        // NO PROGRAMS
        // =========================

        if (
          !parsedPrograms ||
          parsedPrograms.length === 0
        ) {
          return res.status(201).json({
            success: true,
            message:
              "Therapy created successfully",
            therapyId,
            thumbnail,
          });
        }

        // =========================
        // INSERT PROGRAMS
        // =========================

        const programQuery = `
          INSERT INTO therapy_programs
          (
            therapy_id,
            program_number,
            program_title,
            program_description,
            youtube_link,
            sort_order
          )
          VALUES ?
        `;

        const programValues =
          parsedPrograms.map(
            (program, index) => [
              therapyId,
              program.program_number ||
                index + 1,
              program.program_title,
              program.program_description ||
                "",
              program.youtube_link || "",
              program.sort_order ||
                index + 1,
            ]
          );

        db.query(
          programQuery,
          [programValues],
          (err, result) => {

            if (err) {
              console.error(
                "Program insert error:",
                err
              );

              return res.status(500).json({
                success: false,
                message:
                  "Therapy created but programs failed",
                error: err.message,
              });
            }

            console.log(
              `${result.affectedRows} programs created`
            );

            res.status(201).json({
              success: true,
              message:
                "Therapy and programs created successfully",
              therapyId,
              programCount:
                result.affectedRows,
              thumbnail,
            });
          }
        );
      }
    );
  }
);

module.exports = router;