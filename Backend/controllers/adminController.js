const db = require("../config/db");

// Login
const login = (req, res) => {
  const { email, password } = req.body;

  const sql =
    "SELECT * FROM admins WHERE email=? AND password=?";

  db.query(sql, [email, password], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    if (result.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    res.json({
      success: true,
      message: "Login Successful",
      admin: result[0],
    });
  });
};

// Create Admin
const createAdmin = (req, res) => {
  const { name, email, password } = req.body;

  const checkSql =
    "SELECT * FROM admins WHERE email=?";

  db.query(checkSql, [email], (err, result) => {
    if (result.length > 0) {
      return res.json({
        success: false,
        message: "Email already exists",
      });
    }

    const sql =
      "INSERT INTO admins(name,email,password) VALUES(?,?,?)";

    db.query(
      sql,
      [name, email, password],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: err.message,
          });
        }

        res.json({
          success: true,
          message: "Admin Created Successfully",
        });
      }
    );
  });
};

module.exports = {
  login,
  createAdmin,
};