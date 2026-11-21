const express = require("express");
const cors = require("cors");
require("dotenv").config();

const insuranceRoutes = require("./routes/insuranceRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Insurance API routes
app.use("/api/insurance", insuranceRoutes);

// Backend homepage
app.get("/", (req, res) => {
  res.json({
    message: "Insurance AI backend is running",
    status: "success",
  });
});

// Use Render's assigned port or 5000 locally
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
