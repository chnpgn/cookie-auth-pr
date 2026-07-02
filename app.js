const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser());

const users = [
  { id: 1, username: "admin", role: "admin" },
  { id: 2, username: "john", role: "user" },
];

app.post("/login", (req, res) => {
  const { username } = req.body;

  const user = users.find((u) => u.username === username);

  if (!user) {
    return res.status(401).json({
      message: "Invalid user",
    });
  }

  res.cookie("user", JSON.stringify(user), {
    httpOnly: true,
  });

  res.json({
    message: "Logged in",
  });
});

function authenticate(req, res, next) {
  const cookie = req.cookies.user;

  if (!cookie) {
    return res.status(401).json({
      message: "Not authenticated",
    });
  }

  req.user = JSON.parse(cookie);

  next();
}

app.get("/profile", authenticate, (req, res) => {
  res.json(req.user);
});

app.listen(3000, () => {
  console.log("Server is running at http://localhost:3000");
});
