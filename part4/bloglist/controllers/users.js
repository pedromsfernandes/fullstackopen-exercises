const usersRouter = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    url: 1,
    title: 1,
    author: 1
  });

  response.json(users.map(user => user.toJSON()));
}); 

usersRouter.post("/", async (request, response, next) => {
  try {
    if (request.body.password.length < 3) {
      return response.status(400).json({
        error: "Password must be at least 3 characters long."
      });
    }

    const password = await bcrypt.hash(request.body.password, 10);

    const user = new User({
      username: request.body.username,
      name: request.body.name,
      password
    });

    const savedUser = await user.save();

    response.status(201).json(savedUser.toJSON());
  } catch (e) {
    next(e);
  }
});

module.exports = usersRouter;
