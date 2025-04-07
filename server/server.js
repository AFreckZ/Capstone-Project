const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Dummy register endpoint
app.post("/api/register", (req, res) => {
  const { name, email, password } = req.body;
  console.log("Registered:", { name, email, password });
  res.status(201).json({ message: "User registered successfully!" });
});

// Dummy login endpoint
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt:", { email, password });
  res.status(200).json({ message: "Login successful!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
