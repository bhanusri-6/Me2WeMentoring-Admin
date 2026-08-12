const express = require("express");
const cors = require("cors");
require("dotenv").config();

const therapyRoutes = require("./routes/therapyRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://me2-we-mentoring-admin.vercel.app/",
      "https://me2-we-mentoring.vercel.app/",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  })
);

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true
  })
);
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));
app.use("/api/admin", adminRoutes);

app.use("/api/therapies", therapyRoutes);
app.use("/api/testimonials", testimonialRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});