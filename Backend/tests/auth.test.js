const request = require("supertest");
const { app } = require("../index.js");

const bcrypt = require("bcryptjs");

const User = require("../models/userModel.js");
const OTP = require("../models/otpModel.js");
/*

Create account:
-> invalid email -  throw error

*/

describe("POST /api/auth/register", () => {
  it("should return 400 if missing name", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "abc@gmail.com", password: "ncrfhchfcf", otp: "123456" });
    expect(res.statusCode).toBe(400);
  });
  it("should return 400 if missing email", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "cinl", password: "ncrfhchfcf", otp: "123456" });
    expect(res.statusCode).toBe(400);
  });
  it("should return 400 if missing password", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "cinl", email: "abc@gmail.com", otp: "123456" });
    expect(res.statusCode).toBe(400);
  });
  it("should return 400 if missing otp", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "cinl", email: "abc@gmail.com", password: "ncrfhchfcf" });
    expect(res.statusCode).toBe(400);
  });

  it("should return 422 if weak password (shoud contain atleast 1 capital letter)", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "cinl",
      email: "abc@gmail.com",
      password: "crfhchfc@1yf",
      otp: "234213",
    });
    expect(res.statusCode).toBe(422);
  });
  it("should return 422 if weak password (shoud contain atleast 1 special symbol)", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "cinl",
      email: "abc@gmail.com",
      password: "crfhchfCx1yf",
      otp: "234213",
    });
    expect(res.statusCode).toBe(422);
  });
  it("should return 422 if weak password (shoud contain atleast 1 number)", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "cinl",
      email: "abc@gmail.com",
      password: "crfhchfc@xyf",
      otp: "234213",
    });
    expect(res.statusCode).toBe(422);
  });
  it("should return 422 if weak password (shoud contain atleast 12 character long)", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "cinl",
      email: "abc@gmail.com",
      password: "crfhchS@xyf",
      otp: "234213",
    });
    expect(res.statusCode).toBe(422);
  });
  it("should return 422 if weak password (shoud contain atleast 1 small letter)", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "cinl",
      email: "abc@gmail.com",
      password: "ASDZXCQW@123A",
      otp: "234213",
    });
    expect(res.statusCode).toBe(422);
  });

  it("should return 409 if account already exists", async () => {
    await User.create({
      name: "rn",
      email: "abc@gmail.com",
      password: "23Ssa@fvfbff",
    });
    const res = await request(app).post("/api/auth/register").send({
      name: "cfhbfc",
      email: "abc@gmail.com",
      password: "123S3e@ddccf",
      otp: "243234",
    });
    expect(res.statusCode).toBe(409);
  });

  it("should not create account if invalid otp", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "ac",
      email: "abc@gmail.com",
      password: "$3Aacdccfghv",
      otp: "456346",
    });
    expect(res.statusCode).toBe(401);
  });
  it("should not create account if otp type is not accountCreate", async () => {
    await OTP.create({
      email: "abc@gmail.com",
      otp: "456346",
      otpType: "PasswordReset",
    });

    const res = await request(app).post("/api/auth/register").send({
      name: "ac",
      email: "abc@gmail.com",
      password: "$3Aacdccfghv",
      otp: "456346",
    });
    expect(res.statusCode).toBe(401);
  });

  it("should create account for valid details", async () => {
    await OTP.create({
      email: "abc@gmail.com",
      otp: "456346",
      otpType: "AccountCreate",
    });
    const res = await request(app).post("/api/auth/register").send({
      name: "ac",
      email: "abc@gmail.com",
      password: "$3Aacdccfghv",
      otp: "456346",
    });
    expect(res.statusCode).toBe(201);
  });
});

describe("POST /api/auth/login", () => {
  it("should return 400 for missing email or password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "abc@gmail.com" });
    expect(res.statusCode).toBe(400);
    const res1 = await request(app)
      .post("/api/auth/login")
      .send({ password: "2@Aacdvfcdvf" });
    expect(res1.statusCode).toBe(400);
  });

  it("should return 401 for invalid email", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "abc@gmail.com", password: "2@Aacdvfcdvf" });
    expect(res.statusCode).toBe(401);
  });

  it("should return 401 for invalid password", async () => {
    const hashedPassword = await bcrypt.hash("1@Aacdvfcdvf", 10);
    await User.create({
      name: "rn",
      email: "abc@gmail.com",
      password: hashedPassword,
    });
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "abc@gmail.com", password: "2@Aacdvfcdvf" });
    expect(res.statusCode).toBe(401);
  });

  it("should login for valid credential", async () => {
    const hashedPassword = await bcrypt.hash("2@Aacdvfcdvf", 10);
    await User.create({
      name: "rn",
      email: "abc@gmail.com",
      password: hashedPassword,
    });
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "abc@gmail.com", password: "2@Aacdvfcdvf" });
    expect(res.statusCode).toBe(200);
    const cookies = res.headers["set-cookie"];
    expect(cookies).toBeDefined();
  });
});

describe("GET /api/auth/is-auth", () => {
  it("should return 401 for not authorised", async () => {
    const res = await request(app).get("/api/auth/is-auth");
    expect(res.statusCode).toBe(401);
  });
  it("should return 200 for authorised", async () => {
    const hashedPassword = await bcrypt.hash("2@Aacdvfcdvf", 10);
    await User.create({
      name: "rn",
      email: "abc@gmail.com",
      password: hashedPassword,
    });
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: "abc@gmail.com", password: "2@Aacdvfcdvf" });
    const cookies = loginRes.headers["set-cookie"];
    const res = await request(app)
      .get("/api/auth/is-auth")
      .set("Cookie", cookies);
    expect(res.statusCode).toBe(200);
  });
});
