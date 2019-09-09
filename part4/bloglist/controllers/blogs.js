const blogsRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs.map(blog => blog.toJSON()));
});

blogsRouter.post("/", async (request, response, next) => {
  const token = request.token;

  const { title, author, url, likes } = request.body;

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: "token missing or invalid" });
    }

    const user = await User.findById(decodedToken.id);

    const blog = new Blog({
      title,
      author,
      url,
      likes,
      user: user._id
    });

    const result = await blog.save();
    user.blogs = user.blogs.concat(result._id);
    await user.save();
    response.status(201).json(result.toJSON());
  } catch (e) {
    next(e);
  }
});

blogsRouter.delete("/:id", async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: "token missing or invalid" });
    }
    const user = await User.findById(decodedToken.id);
    const blog = await Blog.findById(request.params.id);

    if (!blog) response.status(204).end();

    if (blog.user.toString() === user.id.toString()) {
      await blog.remove();
      response.status(204).end();
    } else {
      response.status(401).end();
    }
  } catch (e) {
    next(e);
  }
});

blogsRouter.put("/:id", async (request, response, next) => {
  const likes = request.body.likes;

  try {
    const res = await Blog.findByIdAndUpdate(
      request.params.id,
      { likes },
      { new: true }
    );
    response.json(res.toJSON());
  } catch (e) {
    next(e);
  }
});

module.exports = blogsRouter;
