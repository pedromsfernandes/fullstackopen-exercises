const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);

const User = require("../models/user");

beforeEach(async () => {
  await User.deleteMany({});

  for (let user of helper.initialUsers) {
    let userObject = new User(user);
    await userObject.save();
  }
});

test("user register without username is rejected", async () => {
  const newUser = {
    name: "Miguel Fernandes",
    password: "yes"
  };

  await api
    .post("/api/users")
    .send(newUser)
    .expect(400);
});

test("user register without min 3 length password is rejected", async () => {
  const newUser = {
    username: "gaedron",
    password: "yo"
  };

  const res = await api
    .post("/api/users")
    .send(newUser)
    .expect(400);

  expect(res.body.error).toContain("at least 3 characters long");
});

test("user register with existing username is rejected", async () => {
  const newUser = {
    username: "temrab",
    password: "yes"
  };

  await api
    .post("/api/users")
    .send(newUser)
    .expect(400);
});

test("user register with valid data is accepted", async () => {
  const newUser = {
    username: "gaedron",
    password: "yes"
  };

  await api
    .post("/api/users")
    .send(newUser)
    .expect(201);
  const users = await api.get("/api/users");

  expect(users.body.length).toBe(helper.initialUsers.length + 1);
  expect(users.body.map(user => user.username)).toContain("gaedron");
});
