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
    api = app.listen(5004, () => console.log("test server launched on 5004"));
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
    const res = await request(api).get("/api/user");
    expect(res.statusCode).toEqual(200);
  })
  it("displays user info for /show", async () => {
    //first create user
    const createRes = await request(api)
      .post("/api/auth/register")
      .send({
        email: "test-email@email.com",
        name: "test-name",
        password: "test-pass",
        friends: ['test-2']
      })
      .set("Content-Type", "application/json");
    
    const token = createRes.headers['auth-token']
    
    
      //then get info for that user
    const res = await request(api)
      .get('/api/user/show')
      .set('auth-token',`${token}`)
    
    
    expect(res.body.name).toEqual('test-name')
    
  })

  it("gives 400 with invalid token", async () => {
    //first create user
    const createRes = await request(api)
      .post("/api/auth/register")
      .send({
        email: "test-email@email.com",
        name: "test-name",
        password: "test-pass",
        friends: ['test-2']
      })
      .set("Content-Type", "application/json");
      //then get info for that user
    const res = await request(api)
      .get('/api/user/show')
      .set('auth-token',`invalid`)
    
    
    expect(res.statusCode).toEqual(400)
    
  })

  it("displays user info for /show/name if friends", async () => {
    const registerRes = await request(api)
      .post('/api/auth/register')
      .send({
        email: "test-email2@email.com",
        name: 'test-2',
        password: "test-pass",
        friends: ['test-name']
      })
      const token = registerRes.headers['auth-token']
      const res = await request(api)
      .get('/api/user/show/test-name')
      .set('auth-token',`${token}`)
    
    console.log(res.body)
    expect(res.body.message).toEqual('you are friends')
  })
  it("displays minimal info for /show/name if not friends", async () => {
    const registerRes = await request(api)
      .post('/api/auth/register')
      .send({
        email: "test-email3@email.com",
        name: 'test-3',
        password: "test-pass",
        friends: ['test2']
      })
      const token = registerRes.headers['auth-token']
      const res = await request(api)
      .get('/api/user/show/test-2')
      .set('auth-token',`${token}`)
      expect(res.body.message).toEqual('friend request pending')
    })

});
