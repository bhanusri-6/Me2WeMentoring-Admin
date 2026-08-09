// Add Hero
router.post("/", async (req, res) => {
  try {
    const {
      title,
      highlight_text,
      description,
      button_text,
      button_link,
      status,
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO hero_sections
      (title, highlight_text, description, button_text, button_link, status)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        title,
        highlight_text,
        description,
        button_text,
        button_link,
        status || "Active",
      ]
    );

    res.status(201).json({
      success: true,
      id: result.insertId,
      message: "Hero created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});