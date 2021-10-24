const mongoose = require("mongoose");
const User = require("../../models/User");
const dotenv = require("dotenv");
const app = require("../../server");
const request = require("supertest");
dotenv.config();

describe("Auth route tests", () => {
  let api;
  beforeAll(async () => {
    //launch server
    api = app.listen(5001, () => console.log("test server launched on 5001"));
    //then connect to test db
    mongoose.connect(
      process.env.TEST_DB_CONNECT,
      {
        useNewUrlParser: true,
      },
      () => {
        console.log("connected to test db");
      }
    );
    //ensure that we start with no info in db
    await User.deleteMany({});
  });
  afterAll(async () => {
    //close connections after test suite runs
    await api.close();
    await mongoose.connection.close();
  });
  it("displays hello world for /", async () => {
    const res = await request(api).get("/api/auth");
    expect(res.statusCode).toEqual(200);
  });
  it("allows registration of new user",async () => {
    const res = await request(api)
      .post("/api/auth/register")
      .send({
        email: "test-email@email.com",
        name: "test-name",
        password: "test-pass",
      })
      .set("Content-Type", "application/json");
    expect(res.statusCode).toEqual(201);

    expect(res.body).toHaveProperty("_id");
  });
  it("does not allow registration with existing email", async () => {
    const res = await request(api)
    .post("/api/auth/register")
    .send({
      email: "test-email@email.com",
      name: "test-name",
      password: "test-pass",
    })
    .set("Content-Type", "application/json");
  expect(res.statusCode).toEqual(400);
  });
  it("allows login of existing user", () => {});
  it("does not allow login with incorrect email", () => {});
  it("does not allow login with incorrect password", () => {});
});
