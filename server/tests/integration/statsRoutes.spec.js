const mongoose = require("mongoose");
const User = require("../../models/User");
const dotenv = require("dotenv");
const app = require("../../server");
const request = require("supertest");
dotenv.config();

describe("Games routes tests", () => {
  let api;
  beforeAll(async () => {
    //launch server
    api = app.listen(5003, () => console.log("test server launched on 5003"));
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
    const res = await request(api).get("/api/stats");
    expect(res.statusCode).toEqual(200);
  })
});
