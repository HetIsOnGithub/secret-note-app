const express = require("express");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const notes = {};

app.post("/create", (req, res) => {
  const { text, expiry, password } = req.body;
  const id = uuidv4();
  const timeout = parseInt(expiry, 10);

  notes[id] = {
    text,
    password: password || null,
  };

  setTimeout(() => {
    delete notes[id];
  }, timeout);

  res.json({ link: `/view.html?id=${id}` });
});

app.get("/note/:id", (req, res) => {
  const note = notes[req.params.id];

  if (!note) {
    return res.status(404).json({ error: "Note not found or expired." });
  }

  const providedPassword = req.query.password;

  
  if (note.password && note.password !== providedPassword) {
    return res.status(403).json({ error: "Incorrect password." });
  }

  
  delete notes[req.params.id];

  res.json({ text: note.text });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
