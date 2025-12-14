const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

const DB_FILE = path.join(__dirname, "requests.json");

if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, "[]");
}

app.post("/api/requests", (req, res) => {
  const requests = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));

  requests.push({
    id: Date.now(),
    ...req.body,
    created_at: new Date().toISOString()
  });

  fs.writeFileSync(DB_FILE, JSON.stringify(requests, null, 2));
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
