const db = require("../config/db");

// Create Therapy
const createTherapy = async (req, res) => {
  try {
    const {
      title,
      tagline,
      description,
      thumbnail,
      programs
    } = req.body;

    // Validation
    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required"
      });
    }

    // Insert Therapy
    const [therapyResult] = await db.query(
      `INSERT INTO therapies
      (title, tagline, description, thumbnail)
      VALUES (?, ?, ?, ?)`,
      [
        title,
        tagline,
        description,
        thumbnail
      ]
    );

    const therapyId = therapyResult.insertId;

    // Insert Programs
    if (Array.isArray(programs) && programs.length > 0) {
      for (let i = 0; i < programs.length; i++) {
        await db.query(
          `INSERT INTO therapy_programs
          (therapy_id, program_title, youtube_link, sort_order)
          VALUES (?, ?, ?, ?)`,
          [
            therapyId,
            programs[i].program_title,
            programs[i].youtube_link,
            i + 1
          ]
        );
      }
    }

    res.status(201).json({
      success: true,
      message: "Therapy created successfully",
      therapyId
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createTherapy
};