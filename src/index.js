const express = require("express");
const { connectDB } = require("./db/connection");
const { User } = require("./db/user");
const bcrypt = require("bcrypt");

const app = express();
const PORT = 3000;

app.use(express.json());

connectDB().then(() => {
  console.log("MongoDB Connected!");
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const findUser = await User.findOne({
    username,
  });

  if (findUser) {
    return res.status(400).json({
      message: "Username has been taken",
    });
  }

  const hashPassword = bcrypt.hashSync(password, 5);

  await User.create({
    username: username,
    password: hashPassword,
  });

  res.status(201).json({
    message: "User registered!",
  });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const findUser = await User.findOne({
    username,
  });

  if (!findUser) {
    return res.status(400).json({
      message: "User not found",
    });
  }

  const isPasswordValid = bcrypt.compareSync(password, findUser.password);

  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Wrong password",
    });
  }

  return res.status(200).json({
    message: "User logged in",
    user_data: findUser,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
