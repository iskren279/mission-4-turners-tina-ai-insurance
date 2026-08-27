const express = require("express");
const cors = require("cors");
require("dotenv").config();

const insuranceRoutes = require("./routes/insuranceRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/insurance", insuranceRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Insurance AI backend is running",
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
