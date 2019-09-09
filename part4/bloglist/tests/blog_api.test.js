const supertest = require("supertest");
const mongoose = require("mongoose");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blog");
const User = require("../models/user");

let token = "";

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  let userObject = new User(helper.initialUsers[0]);
  const user = await userObject.save();

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog({ ...blog, user: user._id });
    await blogObject.save();
  }

  const res = await api.post("/api/login").send({
    username: "zephyrminas",
    password: "hash"
  });

  token = res.body.token;
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("all blogs are returned", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body.length).toBe(helper.initialBlogs.length);
});

test("a specific blog is within the returned blog", async () => {
  const response = await api.get("/api/blogs");

  const contents = response.body.map(r => r.title);
  expect(contents).toContain("React patterns");
});

test("unique identifier is named id", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body[0].id).toBeDefined();
});

test("a valid blog can be added ", async () => {
  const newBlog = {
    title: "async/await simplifies making async calls",
    author: "Pedro Fernandes",
    url:
      "https://pedromsfernandes.me/async-await-simplifies-making-async-calls",
    likes: 1000
  };

  await api
    .post("/api/blogs")
    .set("authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1);

  const titles = blogsAtEnd.map(n => n.title);
  expect(titles).toContain("async/await simplifies making async calls");
});

test("if not given, likes property defaults to 0", async () => {
  const newBlog = {
    title: "likes defaults to 0",
    author: "Pedro Fernandes",
    url: "https://pedromsfernandes.me/likes-defaults-to-0"
  };

  const result = await api
    .post("/api/blogs")
    .set("authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  expect(result.body.likes).toBe(0);
});

test("if title and/or url are missing, server responds with 400", async () => {
  const newBlog = {
    author: "Pedro Fernandes",
    likes: 1000
  };

  await api
    .post("/api/blogs")
    .set("authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(400);
});

test("delete blog successful", async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToDelete = blogsAtStart[0];

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set("authorization", `Bearer ${token}`)
    .expect(204);

  const blogsAtEnd = await helper.blogsInDb();

  expect(blogsAtEnd.length).toBe(helper.initialBlogs.length - 1);

  const titles = blogsAtEnd.map(r => r.title);

  expect(titles).not.toContain(blogToDelete.title);
});

test("delete blog with invalid id is unsuccessful", async () => {
  const invalidId = await helper.nonExistingId();

  await api
    .delete(`/api/blogs/${invalidId}`)
    .set("authorization", `Bearer ${token}`)
    .expect(204);

  const blogsAtEnd = await helper.blogsInDb();

  expect(blogsAtEnd.length).toBe(helper.initialBlogs.length);
});

test("update blog is successful", async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToUpdate = blogsAtStart[0];

  const res = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send({ likes: blogToUpdate.likes });

  expect(res.body.likes).toBe(blogToUpdate.likes);
});

afterAll(() => {
  mongoose.connection.close();
});
